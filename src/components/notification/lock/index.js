import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Field, change, formValueSelector } from 'redux-form';
import { FormattedMessage } from 'umi-plugin-locale';
import { withRouter } from 'react-router-dom';
import Form, { FieldInput } from '@/components/form';
import stringifyVolumn from '../../../utils/format';
import Modal from '@/components/modal';
import Success from '@/assets/svg/success';
import styles from './styles.scss';
import { account_type } from '../../../common/constant-enum';

@withRouter
@connect(
  (state) => ({
    amount: formValueSelector('lockForm')(state, 'amount'),
    loading: state.Loading.submitLoading,
    balanceInfos:state.Account.balanceInfos,
    currencyInfos:state.Account.currencyInfos,
  }),
  dispatch => ({
    _updateAmount: (value) => dispatch(change('lockForm', 'amount', value)),
    _createLock: values => dispatch({type:'AcCenter/createLock',payload:values}),
    _removeTemplate: () => dispatch({type: 'Notification/changeTemplate'}),
  })
)
 class LockForm extends PureComponent {
  state = {
    visible: false,
    balance: 0
  };

  componentWillMount() {
   this.getBalance(this.props.balanceInfos);
  }

  componentWillReceiveProps(nextProps){
    const { balanceInfos } = nextProps;
    if(this.props.balanceInfos !== balanceInfos){
        this.getBalance(balanceInfos);
    }
  }

  getBalance = (balanceInfos={}) => {
    const  balances = balanceInfos[account_type.accountTypeEx] || {};
    let balance = balances[this.props.coin] || {};
    this.setState({ balance: balance });
  }
  _getMax = () => {
    const { balance} = this.state;
    let avail = parseFloat(balance.amount_available || 0);
    return avail;
  };
  _validate = values => {
    const errors = {};
    const amount = Number(values.amount || 0);
    if (amount <= 0) {
      errors.amount = 'must_>_0';
    }
    if (amount > this._getMax()) {
      errors.amount = 'must_<_lock_available';
    }
    return errors;
  };
  _onAmountChange = value => {
    const { currencyInfos,coin } = this.props;
    const { digits = 2 } =  currencyInfos[coin] || {};
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
  _lockAll = () => {
    const { currencyInfos, coin } = this.props;
    const { digits = 2 } =  currencyInfos[coin] || {};
    this.props._updateAmount(this._getMax().toFixed(digits));
  };
  _createLockRequest = ({ amount }) => {
    const {  _createLock, coin } = this.props;
    _createLock({
      currency: coin, 
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
     this.props._removeTemplate();
     this.setState({ visible: false });
     this.props.history.push('/ac/account/lockHistory');
  };
  render() {
    const {
      loading,
      _removeTemplate,
      currencyInfos,
      coin
    } = this.props;
    const { visible } = this.state;
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
          onSubmit={this._createLockRequest}
          validate={this._validate}
          form='lockForm'
          actionAlign="flex-end"
          action={action}
        >      
          <div className={styles.crypto_amount_lable}>
            <FormattedMessage
              id="transAmountTx"
              values={{ currency: coin }}
            />
          </div>
          <div className={styles.crypto_amount_item}>
            <FormattedMessage           
              id="must_lock_amount"
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
              onClick={this._lockAll}
              className={styles.crypto_amount_action}
            >
              <FormattedMessage id="All" />
            </a>
          </div>
          <div className={styles.crypto_form_item}>
            <FormattedMessage id="avLockAmountTx" />
            <a>
              {stringifyVolumn(avail, (currencyInfos[coin] && currencyInfos[coin].digits)||2)} {coin}
            </a>
          </div>    
        </Form>
        <Modal
          className="confirm_modal"
          bodyStyle={{ padding: '32px 32px 24px' }}
          width={400}
          visible={visible}
        >
          <div className="confirm_modal_title">
            <Success />
            <FormattedMessage id="lockSuccess" />
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
export default LockForm