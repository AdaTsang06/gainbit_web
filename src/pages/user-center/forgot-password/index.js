import React, { PureComponent, Fragment } from 'react';
import { IntlProvider, FormattedMessage } from 'umi-plugin-locale';
import { Link } from 'react-router-dom';
import { Field, formValueSelector } from 'redux-form';
import classnames from 'classnames/bind';
import { connect } from 'dva';
import Form, { FieldInput, FieldSelect } from '@/components/form';
import initNECaptcha from '@/utils/verify/neteasetest';
// import Layout from '../layout';
import getFieldErr from '@/utils/get-field-err';
import styles from './styles.scss';
import ActionButton from '@/components/action-button';
import messages from './messages';
import { handleMobileCode } from '../../../utils/util';


const selector = formValueSelector('forgotPasswordForm');
const cx = styles::classnames;

const validate = values => {
  const errors = {
    mobile: getFieldErr('mobile', values.mobile, true),
    reset_code: getFieldErr('reset_code', values.reset_code, true),
    new_password1: getFieldErr('password', values.new_password1, true),
    new_password2: getFieldErr('password', values.new_password2, true),
  };
  if (
    values.new_password1 &&
    values.new_password2 &&
    values.new_password1 !== values.new_password2
  ) {
    errors.new_password2 = 'different_password';
  }
  return errors;
};

@connect(
  state => ({
    locale: state.Intl.locale,
    mobile: selector(state, 'mobile'),
    country_code: selector(state, 'country_code'),
  }),
  dispatch => ({
    _getMobileCodeRequest: (values, callBack) => dispatch({type:'Account/retrievePwMobileCode',payload:values, callBack}),
    _forgotPasswordRequest: values => dispatch({type:'Account/forgotPasswordRequest',payload:values}),
    _removeTemplate: () => dispatch({type:'Notification/changeTemplate'}),
  })
)
class ForgotPasswordForm extends PureComponent {
  constructor(props) {
    super(props);
    this.doms = [];
    const countrys = handleMobileCode(props.locale);
    this.state = {
      isSent: false,
      count: 0,
      values: {},
      visible: true,
      countrys
    };
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  _getCode = () => {
    const { mobile } = this.props;
    const { count } = this.state;
    if (getFieldErr('mobile', mobile, true) || count) return;
    const { locale } = this.props;
      initNECaptcha(locale, this.getMobileCodeRequest).then(instance => {
      if (!instance) {
        this.getMobileCodeRequest()
      }
      instance.popUp();
    });
    
  };

  getMobileCodeRequest = (config = {}) => {
    const { _getMobileCodeRequest, mobile,country_code } = this.props;
    this.setState({ isSent: true });
    _getMobileCodeRequest({ ...config, mobile,country_code },this._onGetCaptcha);
  }

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
  _forgotPasswordRequest = (config = {}) => {
    const { _forgotPasswordRequest } = this.props;
    const { values } = this.state;
    const submitValus = {
      country_code: values.country_code,
      mobile: values.mobile,
      password : values.new_password2,
      captcha: values.reset_code,
    };
    _forgotPasswordRequest({ ...submitValus, ...config });
  };
  _submit = values => {
    this.setState({ values }, () => {
      this._forgotPasswordRequest();
      return;
    });
  };
  _hideModal = () => {
    const { visible } = this.state;
    if (visible) {
      this.setState({ visible: false });
    }
  };
  render() {
    const { locale, _removeTemplate } = this.props;
    const { isSent, count, countrys } = this.state;
    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        {/*<Layout>*/}
          <Fragment>
            {/*<h3>
            <FormattedMessage id="forgot_title" />
          </h3>*/}
            <Form
              className={styles.forgot_password_form}
              onSubmit={this._submit}
              action={() => <ActionButton id="submit" />}
              form="forgotPasswordForm"
              validate={validate}
              initialValues={{ country_code: '86' }}
            >
              <div className={styles.forgot_password_form_header}>
                <div className={styles.forgot_password_form_header_link}>
                  <FormattedMessage id="forgot_title" />
                  <div>
                    <FormattedMessage id="forgotHeader1" />
                    <Link to={'/register'} onClick={_removeTemplate}>
                      <FormattedMessage id="forgotHeader2" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className={styles.form_item}>
                  <div style={{width:'90px'}}>
                    <Field
                    locale={locale}
                    arr={countrys}
                    name="country_code"
                    type="select"
                    component={FieldSelect}
                    label=''
                    width={80}
                    />
                  </div>
                
                  <FormattedMessage id="mobile">
                  {msg => (
                    <Field
                      name="mobile"
                      type="text"
                      placeholder={msg}
                      component={FieldInput}
                      locale={locale}
                      onBlurShowError
                    />
                  )}
                </FormattedMessage>
              </div>
              <FormattedMessage id="code">
                {msg => (
                  <div
                    className={styles.send_group}
                    style={{ display: 'flex', position: 'relative' }}
                  >
                    <Field
                      realRef={dom => {
                        this.doms[1] = dom;
                      }}
                      disabled={!isSent}
                      placeholder={msg}
                      name="reset_code"
                      type="number"
                      /*action={
                    <span className={styles.send_code} onClick={this._getCode}>
                      {count ? `${count} s` : <FormattedMessage id="send" />}
                    </span>
                  }*/
                      component={FieldInput}
                      locale={locale}
                      onBlurShowError
                      style={{ minWidth: '300px' }}
                    />
                    <div
                      className={cx(
                        count > 0 ? 'button_disabled' : 'resend'
                      )}
                    >
                      <button type='button' onClick={this._getCode} disabled={count > 0}>
                        {count ? `${count} s` : <FormattedMessage id="send" />}
                      </button>
                    </div>
                  </div>
                )}
              </FormattedMessage>
              <FormattedMessage id="new_password">
                {msg => (
                  <Field
                    realRef={dom => {
                      this.doms[2] = dom;
                    }}
                    disabled={!isSent}
                    placeholder={msg}
                    name="new_password1"
                    type="password"
                    component={FieldInput}
                    locale={locale}
                    onBlurShowError
                  />
                )}
              </FormattedMessage>
              <FormattedMessage id="confirm_password">
                {msg => (
                  <Field
                    realRef={dom => {
                      this.doms[3] = dom;
                    }}
                    disabled={!isSent}
                    placeholder={msg}
                    name="new_password2"
                    type="password"
                    component={FieldInput}
                    locale={locale}
                    onBlurShowError
                  />
                )}
              </FormattedMessage>
            </Form>
          </Fragment>
        {/*</Layout>*/}
      </IntlProvider>
    );
  }
}
export default ForgotPasswordForm