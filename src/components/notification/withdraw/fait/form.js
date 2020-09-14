import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link, withRouter } from 'react-router-dom';
import { Field, change, formValueSelector } from 'redux-form';
import { FormattedMessage } from 'umi-plugin-locale';
import Big from 'big.js';
import Action from '@/components/notification/action';
import Form, { FieldSelect, FieldInput } from '@/components/form';
import fiatType from '@/common/fiat-type';
import stringifyVolumn, { toFixed } from '../../../../utils/format';
import { getSessionStore } from '../../../../utils/storage'

// import classnames from 'classnames';
import Modal from '@/components/modal';
import Success from '@/assets/svg/success';
import styles from './styles.scss';

const getFiatFee = (amount = 0) => (amount * 0.008 < 80 ? 80 : amount * 0.008);
let minWithdraw = 200;
let isAllWithdraw = false;
@withRouter
@connect(
  (state, ownProps) => ({
    locale: state.Intl.locale,
    userInfo: state.Account.userInfo,
    amount: formValueSelector(ownProps.name)(state, 'amount'),
    accountInfo: {},
    bankList: state.Address.address[`withdraw_${ownProps.name}`],
    loading: state.Loading.submitLoading,
    tmp_token: state.Address.withdraw.tmp_token,
    isVerified: state.Address.withdraw.isVerified,
  }),
  dispatch => ({
    _updateAmount: (value, name) => dispatch(change(name, 'amount', value)),
    _getAddress: values => dispatch({type:'getWithdrawAddress',payload:values}),
    _createWithdraw: values => dispatch({type:'createWithdraw',payload:values}),
    _removeTemplate: () => dispatch({
      type: 'Notification/changeTemplate'
    }),
    _showAuthTip: () =>
      dispatch({
        type: 'Notification/changeTemplate',
        payload: {type:'withdraw_auth_tip'},
      }),
    _showKycTip: () =>
      dispatch({
        type: 'Notification/changeTemplate',
        payload: {type:'withdraw_kyc_tip'},
      }),
    _showVerification: (isCoin, tmp_token) =>
      dispatch({
        type: 'Notification/changeTemplate',
        payload:{
          type: 'verification_modal',
          isCoin,
          tmp_token,
        }
      }),
  })
)
class FiatForm extends PureComponent {
  state = {
    fee: 0,
    kycLevel: -1,
    hasVerified: false,
    visible: false,
    balance: toFixed(0, 8),
  };
  componentWillMount() {
    const { bankList, _getAddress, name,accountInfo} = this.props;
    const acc = accountInfo;
    const accInfo = acc ;
    const { withdraw_min } = accInfo[name] || {};
    minWithdraw = withdraw_min;
    // let balance = toFixed(0, accInfo[name].digits);
    // if (accInfo[name].amount && parseFloat(accInfo[name].amount) > 0) {
    //   const frozen =
    //     parseFloat(accInfo[name].frozen_order || 0);
    //   const avail = parseFloat(accInfo[name].amount) - frozen;
    //   balance = toFixed(
    //     Math.min(avail, parseFloat(accInfo[name].withdraw_max)),
    //     accInfo[name].digits
    //   );
    // }
    // this.setState({ balance: balance });
    return !bankList && _getAddress({ coinType: fiatType(name), type: 1 });
  }
  componentWillReceiveProps(nextProps) {
    const { tmp_token, amount, userInfo, isVerified } = nextProps;
    const { balance } = this.state;
    if (this.props.amount !== amount) {
      if (isAllWithdraw) {
        isAllWithdraw = false;
        this.setState({ fee: getFiatFee(balance) });
      } else {
        this.setState({ fee: getFiatFee(amount) });
      }
    }
    if (this.props.tmp_token !== tmp_token && tmp_token) {
      this.props._showVerification(false, tmp_token);
    }
    if (this.props.userInfo !== userInfo) {
      const kycLevel = userInfo.kyc;
      const hasVerified = userInfo.bound_twofa;
      if (!hasVerified) {
        this.props._showAuthTip();
      } else if (kycLevel < 3) {
        this.props._showKycTip();
      }
      this.setState({ kycLevel, hasVerified });
    }
    if (this.props.isVerified !== isVerified) {
      this.setState({ visible: true });
    }
  }

  big(val = 0, number = 0, toFix = 8) {
    const c = new Big(val);
    return toFixed(c.minus(number), toFix);
  }
  _getMax = excludeFee => {
    const { balance } = this.state;
    const fee = getFiatFee(balance);
    const max = this.big(balance, fee, 2);
    return excludeFee ? (max > 0 ? max : 0) : balance;
  };
  _validate = values => {
    const { balance } = this.state;
    const errors = {};
    const amount = Number(values.amount);
    if (amount < 0) {
      errors.amount = 'must_>_0';
    }
    if (amount < minWithdraw) {
      errors.amount = 'must_>_min_fiat';
    }
    if (amount > balance) {
      errors.amount = 'must_<_available_balance';
    }
    if (!values.bankAccount) {
      errors.bankAccount = 'required';
    }
    if (!values.amount) {
      errors.amount = 'required';
    }
    return errors;
  };
  _onAmountChange = value => {
    const precision = value.split('.')[1];
    const len = 2;
    if (isNaN(value)) {
      return null;
    }
    if (precision && precision.length > len) {
      return Number(value).toFixed(len);
    }
    return value;
  };
  _withDrawAll = () => {
    const { name } = this.props;
    isAllWithdraw = true;
    this.props._updateAmount(this._getMax(), name);
  };
  _createWithdrawRequest = ({ bankAccount, amount }) => {
    const { name, _createWithdraw } = this.props;
    _createWithdraw({
      bank_account: bankAccount,
      // amount: Number(amount),
      amount: amount,
      fiat_type: fiatType(name),
    });
  };
  _submit = e => {
    const { hasVerified, kycLevel } = this.state;
    if (!hasVerified) {
      e.preventDefault();
      this.props._showAuthTip();
      return;
    }
    if (kycLevel < 3) {
      e.preventDefault();
      this.props._showKycTip();
    }
  };
  _hideModal = () => {
    this.setState({ visible: false });
  };

  _viewWithdraw = () => {
    this.props.history.push('/ac/account/history/withdrawal/fiat');
  };
  render() {
    const {
      name,
      loading,
      // locale,
      bankList,
      amount,
      _removeTemplate,
      accountInfo,
    } = this.props;
    const { /*fee,*/ visible, balance } = this.state;
    const acc = accountInfo;
    const accInfo = acc ;
    const { withdraw_fee, withdraw_min, digits } = accInfo[name] || {};
    const data =
      bankList &&
      bankList
        .map(item => ({
          value: item.get('bank_account'),
          name: props => (
            <span {...props}>
              <span>{item.get('bank_name')}</span>
              <span>{item.get('bank_account')}</span>
            </span>
          ),
        }))
        .toJS();
    /* const helpLink = (
      <a
        style={{ color: '#4a90e2' }}
        rel="noopener noreferrer"
        target="_blank"
        href={`${
          locale === 'en-US'
            ? 'https://gx.kf5.com/hc/kb/article/1146472/?lang=en'
            : 'https://gx.kf5.com/hc/kb/article/1146471/'
        }`}
      >
        <FormattedMessage id="help_center" />
      </a>
    );*/
    const action = (
      <Action
        loading={loading}
        cancel={_removeTemplate}
        submit={this._submit}
      />
      /*<button
        onClick={this._submit}
        disabled={loading}
        type="submit"
        className={classnames('submit_button', {
          submit_button_loading: loading,
        })}
      >
        <FormattedMessage id="withdraw" />
      </button>*/
    );
    const addBank = (
      <div className={styles.add_address} onClick={_removeTemplate}>
        <Link to={`/ac/manage/bank_account/${name}`}>
          <FormattedMessage id="add_bank_account_title" />
        </Link>
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
          actionAlign="flex-start"
          action={action}
        >
          <div className={styles.crypto_amount_lable}>
            <FormattedMessage
              id="withdrawal_money"
              values={{ name: name ? name : '' }}
            />
          </div>
          <div className={styles.crypto_amount_item}>
            <FormattedMessage
              values={{ value: stringifyVolumn(withdraw_min, digits) }}
              id="min_amount_tip"
            >
              {msg => (
                <Field
                  name="amount"
                  type="text"
                  disabled={!balance}
                  normalize={this._onAmountChange}
                  component={FieldInput}
                  placeholder={msg}
                  // label={}
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
            <FormattedMessage id="available_money" />
            <a>
              {' '}
              {stringifyVolumn(balance, digits)} {name}
            </a>
          </div>
          <div className={styles.crypto_form_item}>
            <FormattedMessage id="tx_fee" />
            <a>
              {stringifyVolumn(withdraw_fee, digits)} {name}
            </a>
          </div>
          <div className={styles.crypto_amount_lable}>
            <FormattedMessage id="bank_account" />
          </div>
          <div className={styles.crypto_form_item}>
            {data && data.length ? (
              <Field
                placeholder={<FormattedMessage id="fiat_placeholder" />}
                extra={addBank}
                name="bankAccount"
                type="number"
                options={{ align: 'left' }}
                arr={data}
                component={FieldSelect}
                // label={}
              />
            ) : (
              <Fragment>
                <FormattedMessage id="withdrawal_bank" />
                <Link
                  className={styles.add_address_button}
                  to={`/ac/account/manage/bank_account/${name}`}
                  onClick={_removeTemplate}
                >
                  <FormattedMessage id="add_bank_account" />
                </Link>
              </Fragment>
            )}
          </div>
          <pre className={styles.crypto_withdraw_warning}>
            <FormattedMessage
              values={{
                min: stringifyVolumn(withdraw_min, digits),
                name: name,
                max: balance,
                fee: stringifyVolumn(withdraw_fee, digits),
                minFee: stringifyVolumn(
                  parseFloat(withdraw_fee) * parseFloat(amount) || 0,
                  digits
                ),
              }}
              id="fiat_withdraw_warning"
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
            <FormattedMessage id="withdraw_success_title" />
          </div>
          <div className="confirm_modal_action">
            <button onClick={this._hideModal}>
              <FormattedMessage id="close" />
            </button>
            <button onClick={this._viewWithdraw}>
              <FormattedMessage id="view_withdraw" />
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}
export default FiatForm