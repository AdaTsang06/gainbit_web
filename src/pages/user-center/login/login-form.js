import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi-plugin-locale';
import { Field, change } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'dva';
import Form, { FieldInput,FieldSelect } from '@/components/form';
import getFieldErr from '../../../utils/get-field-err';
import styles from './styles.scss';
import ActionButton from '@/components/action-button';
import initNECaptcha from '../../../utils/verify/neteasetest';
import { handleMobileCode } from '../../../utils/util';
const validate = values => ({
  mobile: getFieldErr('mobile', values.mobile, true),
  password: getFieldErr('password', values.password, true),
});
@connect(
  state => ({
    locale: state.Intl.locale,
  })
)
class LoginForm extends PureComponent {
  constructor(props) {
    super(props);
    const countrys = handleMobileCode(props.locale);
    this.state = { 
      values: {},
      countrys
    };
  }
  componentWillReceiveProps() {
    const { clearForm } = this.props;
    if (clearForm) {
      this._updateName('mobile', '');
      this._updateName('password', '');
    }
  }

  _updateName = (name, value) =>{
    this.props.dispatch(change('login_form', name, value))
  }
  _loginRequest = (config = {}) => {
    const { values } = this.state;
    this.props.dispatch({type:'Account/loginRequest',payload:{ ...config,...values}});
  };
  _login = values => {
    if (
      !getFieldErr('mobile', values.mobile, true) &&
      !getFieldErr('password', values.password, true)
    ) {
      this.setState({ values }, () => {
        const { locale } = this.props;
        initNECaptcha(locale, this._loginRequest).then(instance => {
          if (!instance) {
            this._loginRequest();
            return;
          }
          instance.popUp();
        });
      });
    } else {
      validate(values);
    }
  };
  render() {
    const  {locale} = this.props;
    const { countrys } = this.state;
    return (
      <React.Fragment>
        <Form
          className={styles.login_form}
          onSubmit={this._login}
          action={() => <ActionButton id="login" />}
          form="LoginForm"
          validate={validate}
          initialValues={{ country_code: '86' }}
        >
          <div className={styles.login_form_header}>
            {/*<img src={Logo} className={styles.login_form_logo} />*/}
            <div className={styles.login_form_header_link}>
              <FormattedMessage id="loginHeader1" />
              <div>
                <FormattedMessage id="loginHeader2" />
                <Link to={'/register'}>
                  <FormattedMessage id="loginHeader3" />
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
             
            <FormattedMessage id="mobile_require">
              {msg => (
                <Field
                  placeholder={msg}
                  name="mobile"
                  type="text"
                  component={FieldInput}
                  onBlurShowError
                  locale={locale}
                />
              )}
            </FormattedMessage>
          </div>
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
          <div className={styles.forgot}>
            <FormattedMessage id="forgot_your_password2" />
            <a onClick={() => {
               this.props.dispatch({ type: 'Notification/changeTemplate', payload: {type:'forgot'} })
            }}>
              <FormattedMessage id="forgot_your_password" />
            </a>
          </div>
          <span id="captcha" />
        </Form>
      </React.Fragment>
    );
  }
}
export default LoginForm;