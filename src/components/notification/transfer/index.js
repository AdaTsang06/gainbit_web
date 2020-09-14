import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Field, change, formValueSelector } from 'redux-form';
import { FormattedMessage } from 'umi-plugin-locale';
import { withRouter } from 'react-router-dom';
import Form, { FieldInput } from '@/components/form';
import Selects from '@/components/selects';
import stringifyVolumn from '../../../utils/format';
import { getTotalProfitAndFrozen } from '../../../utils/wallet';
import { acCurrency } from  '../../../common/constants';
import Modal from '@/components/modal';
import Success from '@/assets/svg/success';
import styles from './styles.scss';
import { account_type, transfer_dir  } from '../../../common/constant-enum';
import { tranferDirectionSel } from '../../../common/search-item';
import { th } from 'date-fns/locale';

@withRouter
@connect(
  (state) => ({
    amount: formValueSelector('tranferForm')(state, 'amount'),
    loading: state.Loading.submitLoading,
    balanceInfos:state.Account.balanceInfos,
    currencyInfos:state.Account.currencyInfos,
    positionInfos:state.Account.positionInfos,
    ticker: state.ws.ticker
  }),
  dispatch => ({
    _updateAmount: (value) => dispatch(change('tranferForm', 'amount', value)),
    _createTransfer: values => dispatch({type:'AcCenter/createTransfer',payload:values}),
    _removeTemplate: () => dispatch({type: 'Notification/changeTemplate'}),
  })
)
 class TransferForm extends PureComponent {
  state = {
    visible: false,
    balance: 0,
    direction:0,
  };

  componentWillMount() {
   this.getBalance(transfer_dir.transfer_ex_td, this.props.balanceInfos);
  }

  componentWillReceiveProps(nextProps){
    const { balanceInfos } = nextProps;
    if(this.props.balanceInfos !== balanceInfos){
        this.getBalance(this.state.direction, balanceInfos);
    }
  }

  getBalance = (direction, balanceInfos={}) => {
    switch(direction){
        case transfer_dir.transfer_ex_td:{
            const  balances = balanceInfos[account_type.accountTypeEx] || {};
            let balance = balances[acCurrency] || {};
            this.setState({ balance: balance,direction });
            break;
        }
        case transfer_dir.transfer_td_ex:{
            const  balances = balanceInfos[account_type.accountTypeTd] || {};
            let balance = balances[acCurrency] || {};
            this.setState({ balance: balance,direction });
            break;
        }
    }
  }
  _getMax = () => {
    const { balance, direction } = this.state;
    const { positionInfos, ticker, currencyInfos } = this.props;
    let avail = parseFloat(balance.amount_available || 0);
    if(direction === transfer_dir.transfer_td_ex){
      const totalProfitFrozen = getTotalProfitAndFrozen(positionInfos, ticker, currencyInfos);
      const profit = totalProfitFrozen.profit;//盈亏
      if(profit < 0){
        avail += profit;
      }
    }
    return avail;
  };
  _validate = values => {
    const errors = {};
    const amount = Number(values.amount || 0);
    if (amount <= 0) {
      errors.amount = 'must_>_0';
    }
    if (amount > this._getMax()) {
      errors.amount = 'must_<_transfer_available';
    }
    return errors;
  };
  _onAmountChange = value => {
    const { currencyInfos } = this.props;
    const { digits = 2 } =  currencyInfos[acCurrency] || {};
    const precision = value.split('.')[1];
    const len = digits;
    if (isNaN(value)) {
      return null;
    }
    if (precision && precision.length > len) {
      return value.split('.')[0]+'.'+precision.substring(0,len);
    }
    return value;
  };
  _tranferAll = () => {
    const { currencyInfos } = this.props;
    const { digits = 2 } =  currencyInfos[acCurrency] || {};
    this.props._updateAmount(this._getMax().toFixed(digits));
  };
  _createTransferRequest = ({ amount }) => {
    const {  _createTransfer } = this.props;
    _createTransfer({
      direction : this.state.direction,
      amount: Number(amount).toString(),
    }).then((result) => {
      if(result){
        this.setState({ visible: true });
      }
    });
  };
  _hideModal = () => {
    this.props._removeTemplate();
    this.setState({ visible: false });
  };
  _viewTransfer = () => {
    //划转记录
     this.props._removeTemplate();
     this.setState({ visible: false });
     this.props.history.push('/ac/account/transferHistory');
  };
  onChange = (value) => {
    this.getBalance(value, this.props.balanceInfos);
  }
  render() {
    const {
      loading,
      _removeTemplate,
      currencyInfos
    } = this.props;
    const { visible, direction } = this.state;
    const avail = this._getMax();
    const action = (
      <div className="confirm_modal_action">
        <button type='button' onClick={_removeTemplate}>
          <FormattedMessage id="cancle" />
        </button>
        <button disabled={loading}>
          <FormattedMessage id="confirm" />
        </button>
    </div>
    );
    return (
      <div className={styles.crypto}>
        <Form
          ref={e => {
            this.form = e;
          }}
          onSubmit={this._createTransferRequest}
          validate={this._validate}
          form='tranferForm'
          actionAlign="flex-end"
          action={action}
          initialValues={{ direction: transfer_dir.transfer_ex_td }}
        >
          <div className={styles.crypto_amount_lable}>
            <FormattedMessage id="direction" />
          </div>
          <div className={styles.crypto_form_item}>         
             <Selects
                width={140}
                name="symbol"
                onChange={this.onChange}
                arr={tranferDirectionSel}
                defaultValue={direction}
                options={{align:"left"}}
            />
          </div>        
          <div className={styles.crypto_amount_lable}>
            <FormattedMessage
              id="transAmountTx"
              values={{ currency: acCurrency }}
            />
          </div>
          <div className={styles.crypto_amount_item}>
            <FormattedMessage           
              id="amountPlaceHolder"
            >
              {msg => (
                <Field
                  name="amount"
                  type="text"
                  normalize={this._onAmountChange}
                  disabled={! avail > 0}
                  component={FieldInput}
                  placeholder={msg}
                />
              )}
            </FormattedMessage>
            <a
              onClick={this._tranferAll}
              className={styles.crypto_amount_action}
            >
              <FormattedMessage id="All" />
            </a>
          </div>
          <div className={styles.crypto_form_item}>
            <FormattedMessage id="avTransAmountTx" />
            <a>
              {stringifyVolumn(avail, (currencyInfos[acCurrency] && currencyInfos[acCurrency].digits)||2)} {acCurrency}
            </a>
          </div>  
          <pre className={styles.crypto_withdraw_warning}>
            <FormattedMessage          
              id="transfer_warning"
            />
          </pre>      
        </Form>
        <Modal
          className="confirm_modal"
          bodyStyle={{ padding: '32px 32px 24px' }}
          width={400}
          visible={visible}
        >
          <div className="confirm_modal_title">
            <Success />
            <FormattedMessage id="transfer_success_title" />
          </div>
          <div className="confirm_modal_action">
            <button onClick={this._hideModal}>
              <FormattedMessage id="close" />
            </button>
            <button onClick={this._viewTransfer}>
              <FormattedMessage id="view_withdraw" />
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}
export default TransferForm