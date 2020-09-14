import React, { PureComponent } from 'react';
import { connect } from 'dva';
import ReactTooltip from 'react-tooltip';
import { Field, change, formValueSelector } from 'redux-form';
import { FormattedMessage } from 'umi-plugin-locale';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import Big from 'big.js';
import Form, { FieldInput } from '@/components/form';
import PopUp from '@/components/popup';
import stringifyVolumn, { toFixed } from '../../../../utils/format';
import Modal from '@/components/modal';
import Success from '@/assets/svg/success';
import { getAccountId } from '../../../../utils/util';
import styles from './styles.scss';
import { account_type } from '../../../../common/constant-enum';

@withRouter
@connect(
  (state, ownProps) => ({
    amount: formValueSelector(ownProps.name)(state, 'amount'),
    addressList: state.AcCenter.withdrawAddress,
    loading: state.Loading.submitLoading,
    balanceInfos:state.Account.balanceInfos,
    currencyInfos:state.Account.currencyInfos,
    accountInfos: state.Account.accountInfos,
    dayWithdrawMax: state.AcCenter.dayWithdrawMax
  }),
  dispatch => ({
    _updateAmount: (value, name) => dispatch(change(name, 'amount', value)),
    _updateAddress: (value, name) => dispatch(change(name, 'withdrawAddress', value)),
    _createWithdraw: values => dispatch({type:'AcCenter/createWithdraw',payload:values}),
    _removeTemplate: () => dispatch({type: 'Notification/changeTemplate'}),
    _getWithdrawAddress: payload =>  dispatch({type:'AcCenter/getWithdrawAddress',payload}),
    _getWidthdrawMax: payload => dispatch({type:'AcCenter/getWidthdrawMax', payload})
  }
))
class CryptoForm extends PureComponent {
  state = {
    hasVerified: false,
    visible: false,
    balance: {},
    showPopUp: false
  };

  componentWillMount() {
    const { balanceInfos,name, accountInfos=[] } = this.props;
    const  balances = balanceInfos[account_type.accountTypeEx] || {};
    let balance = balances[name] || {};
    this.setState({ balance: balance });
    this.props._getWidthdrawMax({currency: name});
    this.props._getWithdrawAddress({ currency: name,  accountid: getAccountId(account_type.accountTypeEx,accountInfos)})
  }

  big(val = 0, number = 0, toFix = 8) {
    if (!val) {
      return 0;
    }
    const c = new Big(val);
    return toFixed(c.minus(number), toFix);
  }

  _getAvail = () => {
    const {
      name,
      currencyInfos= {},
      dayWithdrawMax
    } = this.props;
    const { withdraw_max = 0, digits = 8 } = currencyInfos[name] || {};
    let min = Math.min(parseFloat(dayWithdrawMax), parseFloat(withdraw_max));
    return min.toFixed(digits);
  };

  _validate = values => {
    const { name, currencyInfos } = this.props;
    const { withdraw_min = 0 } = currencyInfos[name] || {};
    const errors = {};
    const amount = Number(values.amount);
     if (!values.amount) {
      errors.amount = 'required';
    }
    else if (parseFloat(amount) <= 0 ) {
      errors.amount = 'must_>_0';
    }
    else if (amount < withdraw_min) {
      errors.amount = 'must_>_min';
    }
    else if (amount > parseFloat(this._getAvail())) {
      errors.amount = 'must_<_available_balance_2';
    }
    if (!values.withdrawAddress) {
      errors.withdrawAddress = 'required';
    }
    return errors;
  };
  _onAmountChange = value => {
    const { name, currencyInfos } = this.props;
    const { digits = 8 } =  currencyInfos[name] || {};
    const precision = value.split('.')[1];
    const len = digits;
    if (isNaN(value)) {
      return;
    }
    if (precision && precision.length > len) {
      return;
    }
    return value;
  };
  _withDrawAll = () => {
    const { name } = this.props;
    this.props._updateAmount(this._getAvail(), name);
  };
  _createWithdrawRequest = ({ withdrawAddress, amount }) => {
    const { name, _createWithdraw } = this.props;
    _createWithdraw({
      address: withdrawAddress ? withdrawAddress.toString() : '',
      amount: Number(amount).toString(),
      currency: name,
    }).then(tmp_token => {
      if (tmp_token) {
        this.setState({ visible: true });
      }
    });
  };
  _hideModal = () => {
    this.setState({ visible: false });
    this.props._removeTemplate();
  };

  _viewWithdraw = () => {
    this._hideModal();
    //充值提现记录
     this.props.history.push('/ac/account/coinsHistory');
  };

  render() {
    const {
      name,
      loading,
      _removeTemplate,
      amount = 0,
      currencyInfos,
      addressList
    } = this.props;
    const { visible, showPopUp,balance ={} } = this.state;
    const { withdraw_fee, withdraw_min = 0, withdraw_max = 0 , digits = 8, withdraw_max_daily = 0, withdraw_max_daily_kyc = 0 } = currencyInfos[name] || {};
    //const withdraw_fee = new Big(amount).times(withdraw_fee_percent).toFixed(digits);
    let preBalance = amount;
    if(parseFloat(balance.amount_available || 0) - parseFloat(amount) < parseFloat(withdraw_fee)){
      preBalance = this.big(amount, withdraw_fee) < 0 ? 0 : this.big(amount, withdraw_fee);
    }
    const avail = parseFloat(this._getAvail());
    const action = (
      <div className="confirm_modal_action" style={{zIndex:99}}>
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
          onSubmit={this._createWithdrawRequest}
          validate={this._validate}
          form={name}
          actionAlign="flex-end"
          action={action}
        >
          <div className={styles.crypto_amount_lable}>
            <FormattedMessage
              id="withdrawal_amount"
              values={{ name: name ? name : '' }}
            />
          </div>
          <div className={styles.crypto_amount_item}>
            <FormattedMessage
              values={{
                value: `${stringifyVolumn(
                  withdraw_min,
                  digits
                )} ${name}`,
              }}
              id="min_amount_tip"
            >
              {msg => (
                <Field
                  name="amount"
                  type="text"
                  normalize={this._onAmountChange}
                  disabled={!(avail > 0)}
                  component={FieldInput}
                  placeholder={msg}
                />
              )}
            </FormattedMessage>
            <a
              onClick={this._withDrawAll}
              className={styles.crypto_amount_action}
            >
              <FormattedMessage id="withdraw_all" />
            </a>
          </div>
          <div className={styles.crypto_form_item}>
            <FormattedMessage id="available_amount" />
            <a>
              {' '}
              {stringifyVolumn(avail, digits)} {name}
            </a>
          </div>
          <div className={styles.crypto_form_item}>
            <FormattedMessage id="tx_fee" />
            <a>
              {stringifyVolumn(withdraw_fee, digits)} {name}
            </a>
          </div>
          <div className={styles.crypto_form_item}>
            <FormattedMessage id="preBalance" />
            <a>
              {stringifyVolumn(preBalance, digits)} {name}
            </a>
          </div>
          <div className={styles.crypto_amount_lable}>
            <FormattedMessage id="withdrawal_address" />
          </div>
          <div className={styles.crypto_form_item} style={{position:'relative'}} 
            onMouseOver={() =>this.setState({showPopUp: true})}
            onMouseOut={() =>this.setState({showPopUp: false})}
          >         
            <FormattedMessage id="withdrawal_address">
              {msg => (
                <Field
                  name="withdrawAddress"
                  type="text"
                  disabled={!(avail > 0) }
                  component={FieldInput}
                  placeholder={msg}
                  // label={}
                />
              )}
            </FormattedMessage>
            {addressList && addressList.length > 0 && 
              <PopUp visible={showPopUp}>
                <ul>
                 {addressList.map((item,idx) => {
                   return <li key={idx} onClick={()=>{
                    this.props._updateAddress(item.address, name);
                   }              
                   }> {item.address} </li>
                 })}
                </ul>
             </PopUp>
            }
          </div>
          <pre className={styles.crypto_withdraw_warning}>
            <FormattedMessage
              values={{
                min: stringifyVolumn(withdraw_min, digits),
                name: name,
                max: stringifyVolumn(withdraw_max, digits),
                fee: withdraw_fee,
              }}
              id="crypto_withdraw_warning"
            />
          </pre>
        </Form>
        <div className={styles.crypto_notice_tips}>
          <FormattedMessage id="withDrawQuota"/> 
          <a  
          data-tip
          data-for="can_withdraw_tips">
          <span className={styles.crypto_notice_tips_help}>?</span>
          </a>
          <ReactTooltip
            place="right"
            id="can_withdraw_tips"
            type="dark"
            offset={{ bottom: 0 }}
            effect="solid"
        >
          <div className={classnames(styles.tip_row,styles.first)}>
            <label><FormattedMessage id="grade"/> </label>
            <label><FormattedMessage id="maxGrade"/> </label>
          </div>
          <div className={styles.tip_row}>
            <label><FormattedMessage id="_default"/> </label>
            <label>{withdraw_max_daily} {name}/<FormattedMessage id="day"/> </label>
          </div>
          <div className={styles.tip_row}>
            <label><FormattedMessage id="passAuth"/> </label>
            <label>{withdraw_max_daily_kyc} {name}/<FormattedMessage id="day"/> </label>
          </div>
        </ReactTooltip>       
        </div>
       
        <Modal
          className="confirm_modal"
          bodyStyle={{ padding: '32px 32px 24px' }}
          width={400}
          visible={visible}
        >
          <div className="confirm_modal_title">
            <Success />
            <FormattedMessage id="withdraw_success_title" />
          </div>
          <div className="confirm_modal_action" style={{marginTop:'10px'}}>
            <button onClick={this._hideModal}>
              <FormattedMessage id="close" />
            </button>
            {/* <button onClick={this._viewWithdraw}>
              <FormattedMessage id="view_withdraw" />
            </button> */}
          </div>
        </Modal>
      </div>
    );
  }
}
export default CryptoForm