import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Field } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'umi-plugin-locale';
import Form, { FieldInput } from '@/components/form';
import Action from '../action';
import styles from '../styles.scss';

@connect(
  state => ({
    isCoin: state.Notification.isCoin,
    tmp_token: state.Address.withdraw.tmp_token,
    loading: state.Loading.submitLoading,
  })
)
@withRouter
class Verify extends PureComponent {
  state = {
    count: 0,
  };
  removeTemplate = () =>{
    this.props.dispatch({type:'Notification/changeTemplate'})
  }
  _validateVerification = values => {
    const errors = {};
    if (!values.email_code) {
      errors.email_code = 'required';
    }
    if (!values.code) {
      errors.code = 'required';
    }
    return errors;
  };
  _verify = values => {
    const { code, email_code } = values;
    const { tmp_token, isCoin } = this.props;
    // const params = code.length === 4 ? { code: code } : { code: code };
    this.props.dispatch({type:'verifyWithdraw',payload:
      {
        code: code.toString(),
        captcha: email_code.toString(),
        tmp_token,
      }},
      isCoin ? 0 : 1
    );
  };
  _sendCode = () => {
    this._onGetCaptcha();
    this.props.dispatch({type:'verifyWithdrawCode'});
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
    const {  loading } = this.props;
    const { count } = this.state;
    return (
      <Form
        action={<Action loading={loading} cancel={this.removeTemplate} />}
        onSubmit={this._verify}
        validate={this._validateVerification}
        form="verification"
        actionAlign="flex-end"
      >
        <FormattedMessage id="mobile_require">
          {msg => (
            <Field
              name="email_code"
              type="text"
              component={FieldInput}
              placeholder={msg}
              label={<FormattedMessage id="mobile" />}
            />
          )}
        </FormattedMessage>
        <div className={styles.sendCodeBtn} style={{ position: 'relative' }}>
          <button className={styles.sendCodeBtn_btn} disabled={count} onClick={this._sendCode}>
            {count ? `${count} s` : <FormattedMessage id="send" />}
          </button>
        </div>
        <FormattedMessage id="mobile_code">
          {msg => (
            <Field
              name="code"
              type="text"
              placeholder={msg}
              component={FieldInput}
              label={<FormattedMessage id="code" />}
            />
          )}
        </FormattedMessage>
      </Form>
    );
  }
}
export default Verify