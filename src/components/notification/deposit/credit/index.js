import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Field, formValueSelector } from 'redux-form';
import { FormattedMessage } from 'umi-plugin-locale';
import Form, { FieldInput, renderDatePicker } from 'components/form';
import getFieldErr from 'utils/get-field-err';
import stringifyVolumn from 'utils/format';
import moment from 'moment';
import Modal from 'components/modal';
import close from '@/assets/close.png';
// import { getCoin } from '@/common/coin-type';
import styles from './styles.scss';

const selector = formValueSelector('fiatDeposit');
@connect(
  state => ({
    amount: selector(state, 'amount'),
    submitbirth: selector(state, 'birth'),
    loading: state.Loading.submitLoading,
    birth: state.Address.birth,
    credit: state.Address.credit,
  })
)
class Credit extends PureComponent {
  state = {
    isVisible: false,
  };

  componentWillMount() {
    this.props.dispatch({type:'getBirth'})
  }
  componentWillReceiveProps(nextProps) {
    const { credit } = nextProps;
    if (
      credit &&
      credit.get('payment_id') !== this.props.credit.get('payment_id')
    ) {
      this.setState({ isVisible: true });
    }
  }
  _validate = values => {
    const errors = {
      amount: getFieldErr('credit-amount', values.amount, true),
      birth: getFieldErr('credit-birth', values.birth, true),
    };
    return errors;
  };
  _createDepositRequest = values => {
    const { amount, birth } = this.props;
    const isShowBirth =
      birth &&
      birth.get('birth') &&
      birth.get('birth') !== '' &&
      birth.get('birth') !== undefined
        ? true
        : false;
    let submitValue = Object.assign({
      amount: amount,
      birth: isShowBirth ? birth.get('birth') : values.birth,
      fiat_type: 1,
    });
    this.props.dispatch({type:'createCredit',payload:submitValue})
  };
  _doConfirm = () => {
    this._hideModal();
  };
  _hideModal = () => {
    this.setState({ isVisible: false });
  };
  render() {
    const { loading, amount, birth, credit } = this.props;
    const { isVisible } = this.state;
    const isShowBirth =
      birth &&
      birth.get('birth') &&
      birth.get('birth') !== '' &&
      birth.get('birth') !== undefined
        ? true
        : false;
    let fee = amount && (amount * 0.05 < 10 ? 10 : amount * 0.05);
    let total = amount && Number(amount) + Number(fee);
    const action = (
      <button disabled={loading} type="submit" className='submit_button'>
        <FormattedMessage id="deposit" />
      </button>
    );

    return (
      <div className={styles.crypto}>
        <Form
          ref={e => {
            this.form = e;
          }}
          onSubmit={this._createDepositRequest}
          validate={this._validate}
          form="fiatDeposit"
          actionAlign="flex-start"
          action={action}
        >
          {!isShowBirth && (
            <div className={styles.crypto_amount_item}>
              <div className={styles.birth_item}>
                <FormattedMessage id="birth" />
                <Field
                  name="birth"
                  inputValueFormat="YYYY-MM-DD"
                  dateFormatCalendar="dddd"
                  dateFormat="YYYY-MM-DD"
                  fixedHeight
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  normalize={value =>
                    value ? moment(value).format('YYYY-MM-DD') : null
                  }
                  component={renderDatePicker}
                  onBlurShowError
                />
              </div>
            </div>
          )}
          <div className={styles.crypto_amount_item}>
            <Field
              name="amount"
              type="number"
              component={FieldInput}
              label={<FormattedMessage id="credit_amount" />}
              action={<span className={styles.dollar_icon}>$</span>}
            />
          </div>
          <div className={styles.crypto_form_item}>
            <FormattedMessage id="credit_fee" />
            {fee && '$'}
            <span>
              {/* {stringifyVolumn(fee, 2) < 10 ? '10' : stringifyVolumn(fee, 2)} */}
              {stringifyVolumn(fee, 2)}
            </span>
            <span className={styles.fee_tip}>
              <FormattedMessage id="fee_tip" />
            </span>
          </div>
          <div className={styles.crypto_form_item}>
            <FormattedMessage id="total_amount" />
            {total && '$'}
            <span>{stringifyVolumn(total, 2)}</span>
          </div>
        </Form>
        <div>
          <Modal
            className="confirm_modal"
            bodyStyle={{ padding: '0px' }}
            width={600}
            visible={isVisible}
          >
            <div className="confirm_modal_title_bt">
              <FormattedMessage id="credit_success_title" />
              <span className="img_con" onClick={this._hideModal}>
                <img src={close} alt="close" />
              </span>
            </div>
            <div className="confirm_modal_con_bt">
              {!isShowBirth && <FormattedMessage id="credit_success_con1" />}
              <FormattedMessage id="credit_success_con2" />
            </div>
            <div className="confirm_modal_action_bt">
              <form
                action="https://sandbox.test-simplexcc.com/payments/new"
                method="post"
                target="_blank"
                onSubmit={this._doConfirm}
              >
                <input
                  type="hidden"
                  name="version"
                  value={credit.get('version') || ''}
                />
                <input
                  type="hidden"
                  name="partner"
                  value={credit.get('partner') || ''}
                />
                <input
                  type="hidden"
                  name="payment_id"
                  value={credit.get('payment_id') || ''}
                />
                <input
                  type="hidden"
                  name="user_id"
                  value={credit.get('user_id') || ''}
                />
                <input
                  type="hidden"
                  name="email"
                  value={credit.get('email') || ''}
                />
                <input
                  type="hidden"
                  name="fiat_total_amount[amount]"
                  value={credit.get('amount') || ''}
                />
                <input
                  type="hidden"
                  name="fiat_total_amount[currency]"
                  value={credit.get('currency') || ''}
                />
                <input
                  type="hidden"
                  name="first_name"
                  value={credit.get('firstname') || ''}
                />
                <input
                  type="hidden"
                  name="last_name"
                  value={credit.get('lastname') || ''}
                />
                <input
                  type="hidden"
                  name="phone"
                  value={credit.get('phone') || ''}
                />
                <input
                  type="hidden"
                  name="payment_flow_type"
                  value={credit.get('payment_flow_type') || ''}
                />
                <input
                  type="hidden"
                  name="return_url"
                  value={credit.get('return_url') || ''}
                />
                <input
                  type="hidden"
                  name="original_http_ref_url"
                  value={credit.get('original_http_ref_url') || ''}
                />
                <input
                  className="confirm_btn"
                  type="submit"
                  name="commit"
                  value="确认"
                />
              </form>
            </div>
          </Modal>
        </div>
        <pre className={styles.crypto_card_warning}>
          {/* <div>
            <FormattedMessage id="please_note" />
          </div> */}
          <FormattedMessage id="credit-card-warning" />
        </pre>
      </div>
    );
  }
}
export default Credit