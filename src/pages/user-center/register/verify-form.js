import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi-plugin-locale';
import { Field } from 'redux-form';
import { connect } from 'dva';
import Form, { FieldInput } from 'components/form';
import classnames from 'classnames/bind';
import getFieldErr from 'utils/get-field-err';
import {
  verifyRequest,
  resendEmailCodeRequest,
  goBack,
} from 'actions/rest-api';
import styles from './styles.scss';
import ActionButton from 'components/action-button';

const cx = styles::classnames;

const validate = values => ({
  verify: getFieldErr('verify', values.verify, true),
});

@connect(
  state => ({
    isReVerify: state.Account.get('isReVerify'),
    reVerifyEmail: state.Account.get('reVerifyEmail'),
  }),
  dispatch => ({
    _verifyRequest: values => dispatch(verifyRequest(values)),
    _goBack: from => dispatch(goBack(from)),
    _resendEmailCodeRequest: values => dispatch(resendEmailCodeRequest(values)),
  })
)
class VerifyForm extends PureComponent {
  state = {
    count: 0,
  };
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  _sendCode = () => {
    this._onGetCaptcha();
    const { email, reVerifyEmail } = this.props;
    this.props._resendEmailCodeRequest({ email: reVerifyEmail || email });
  };
  _onGetCaptcha = () => {
    let count = 59;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };
  render() {
    const { count } = this.state;
    const {
      locale,
      _verifyRequest,
      email,
      isReVerify,
      reVerifyEmail,
    } = this.props;
    return (
      <React.Fragment>
        <Form
          className={styles.wrap}
          onSubmit={_verifyRequest}
          validate={validate}
          initialValues={{ email: isReVerify ? reVerifyEmail : email }}
          enableReinitialize
          action={() => <ActionButton id="submit" />}
          form="verifyForm"
        >
          {isReVerify && (
            <p>
              <FormattedMessage id="re_verify_desc" />
            </p>
          )}
          <div className="field_title">
            <FormattedMessage id="email" />
          </div>
          <Field
            name="email"
            type="text"
            component={FieldInput}
            locale={locale}
            disabled
          />
          <div className={cx(count > 0 ? 'button_disabled' : 'resend')}>
            <button onClick={this._sendCode} disabled={count}>
              {count ? `${count} s` : <FormattedMessage id="resend" />}
            </button>
          </div>
          <div className="field_title">
            <FormattedMessage id="email_code" />
          </div>
          <Field
            name="verify"
            type="number"
            component={FieldInput}
            locale={locale}
            onBlurShowError
          />
        </Form>
      </React.Fragment>
    );
  }
}
export default VerifyForm