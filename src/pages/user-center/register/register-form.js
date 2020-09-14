import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi-plugin-locale';
import { Link } from 'react-router-dom';
import { Field, formValueSelector, change } from 'redux-form';
import { connect } from 'dva';
import classnames from 'classnames/bind';
import Form, { FieldCheckbox, FieldInput, FieldSelect } from '../../../components/form';
import getFieldErr from '../../../utils/get-field-err';
import initNECaptcha from '@/utils/verify/neteasetest';
import styles from './styles.scss';
import ActionButton from '../../../components/action-button';
import { handleMobileCode } from '../../../utils/util';

const cx = styles::classnames;
const validate = values => {
  const errors = {
    mobile: getFieldErr('mobile', values.mobile, true),
    password: getFieldErr('password', values.password, true),
    password2: getFieldErr('password', values.password2, true),
    verify: getFieldErr('verify', values.verify, true),
    //check: !values.check && 'error_check',
  };
  if (
    values.password2 &&
    values.password &&
    values.password !== values.password2
  ) {
    errors.password2 = 'different_password';
  }
  return errors;
};

@connect(
  state => ({
    locale: state.Intl.locale,
    mobile: formValueSelector('registerForm')(state, 'mobile'),
    country_code: formValueSelector('registerForm')(state, 'country_code'),
    invite_code: formValueSelector('registerForm')(state, 'invite_code'),
  }),
  dispatch => ({
    _registerRequest: values => dispatch({type:"Account/registerRequest",payload:values}),
    resendMobileCodeRequest: (values,callBack) => dispatch({type:"Account/resendMobileCodeRequest",payload:values,callBack}),
    _showAgreement: () =>
      dispatch({ type: 'TEMPLATE_CHANGE', template: 'agreement' }),
    _updateInviteCode: (value) => dispatch(change('registerForm', 'invite_code', value)),
  })
)
class RegisterForm extends PureComponent {
  constructor(props){
    super();
    const countrys = handleMobileCode(props.locale);
    this.state = {
      values: {},
      count: 0,
      countrys
    };
  }

  componentWillReceiveProps(nextProps){
    if(this.props.inviteCode !== nextProps.inviteCode){
      this.props._updateInviteCode(nextProps.inviteCode);
    }
  }
 
  _register = values => {
    this.setState({ values }, () => {
      this._registerRequest();
    });
  };
  _registerRequest = (config = {}) => {
    const { values } = this.state;
    config.country_code =  values.country_code;
    config.mobile = values.mobile;
    config.password  = values.password;
    config.captcha  = values.captcha;
    config.invite_code = values.invite_code;
    if (!values.invite_code ) {
      delete config['invite_code'];
    }
    const { mobileCallback,_registerRequest } = this.props;
    mobileCallback(values.mobile);
    _registerRequest({ ...config });
  };
  _sendCode = () => {
    const { mobile } = this.props;
    if(!mobile){
      return;
    }
    const { locale } = this.props;
    initNECaptcha(locale, this.resendMobileCodeRequest).then(instance => {
      if (!instance) {
          this.resendMobileCodeRequest();
          return;
        }
        instance.popUp();
   });
  };

  resendMobileCodeRequest = (config = {}) => {
    const { mobile,country_code } = this.props;
    this.props.resendMobileCodeRequest({
      ...config,
      mobile,
      country_code,
    }, this._onGetCaptcha);
    
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
  render() {
    const { locale, _showAgreement, inviteCode } = this.props;
    const { count,countrys } = this.state;
    const initialValues = { country_code: '86', invite_code: inviteCode };
    return (
      <React.Fragment>
        <Form
          /*ref={e => {
            this.form = e;
          }}*/
          className={styles.register_form}
          onSubmit={this._register}
          action={() => <ActionButton id="register" />}
          validate={validate}
          form="registerForm"
          initialValues={initialValues}
        >
          <div className={styles.register_form_header}>
            <div className={styles.register_form_header_link}>
              <FormattedMessage id="registerHeader1" />
              <div>
                <FormattedMessage id="registerHeader2" />
                <Link to={'/login'}>
                  <FormattedMessage id="registerHeader3" />
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
          <FormattedMessage id="mobile_code">
            {msg => (
              <div style={{ display: 'flex', position: 'relative' }}>
                <Field
                  name="captcha"
                  type="number"
                  placeholder={msg}
                  component={FieldInput}
                  locale={locale}
                  onBlurShowError
                />
                <div className={cx(count > 0 ? 'button_disabled' : 'resend')}>
                  <button onClick={this._sendCode} disabled={count} type='button'>
                    {count ? `${count} s` : <FormattedMessage id="resend" />}
                  </button>
                </div>
              </div>
            )}
          </FormattedMessage>
          <FormattedMessage id="password">
            {msg => (
              <Field
                placeholder={msg}
                name="password"
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
                placeholder={msg}
                name="password2"
                type="password"
                component={FieldInput}
                locale={locale}
                onBlurShowError
              />
            )}
          </FormattedMessage>
          <FormattedMessage id="register_code">
            {msg => (
              <Field
                name="invite_code"
                type="text"
                placeholder={msg}
                component={FieldInput}
                locale={locale}
                onBlurShowError
                disabled={inviteCode ? true: false}
              />
            )}
          </FormattedMessage>
          {/* <div className={styles.check_desc}>
            <Field
              name="check"
              type="checkbox"
              component={FieldCheckbox}
              locale={locale}
              label={
                <span>
                  <FormattedMessage id="check_desc" />
                  <a onClick={_showAgreement}>
                    《<FormattedMessage id="agreement" />》
                  </a>
                </span>
              }
              onBlurShowError
            />
          </div> */}
            <span id="captcha" />
        </Form>
      </React.Fragment>
    );
  }
}
export default RegisterForm