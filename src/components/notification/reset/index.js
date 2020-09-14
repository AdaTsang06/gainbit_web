import React, { PureComponent } from 'react';
import { Field } from 'redux-form';
import { connect } from 'dva';
import { FormattedMessage, IntlProvider } from 'umi-plugin-locale';
import Form, { FieldInput } from '@/components/form';
import getFieldErr from '@/utils/get-field-err';
import initNECaptcha from '@/utils/verify/neteasetest';
import Action from '@/components/notification/action';
import styles from './styles.scss';
import classnames from 'classnames';
import common from '@/css/common.scss';
import messages from './messages.json';
import Icon from '@/assets/ETH_hover.png';

@connect(
  state => ({
    loading: state.Loading.submitLoading,
    locale: state.Intl.locale,
    userInfo: state.Account.userInfo
  })
)
class Reset extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      values: {},
      resultShow: false,
      count: 3,
    };
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  _logout = (go) => {
    this.props.dispatch({type:'logout',payload:go})
  }
  removeTemplate = () =>{
    this.props.dispatch({type:'Notification/changeTemplate'})
  }
  _goBack = () => {
    const { history } = this.props;
    history.goBack();
  };
  _validate = values => {
    const errors = {
      old_password: getFieldErr('password', values.old_password, true),
      new_password1: getFieldErr('password', values.new_password1, true),
      new_password2: getFieldErr('password', values.new_password2, true),
      code: getFieldErr('code', values.code, true),
    };
    const { old_password, new_password1, new_password2 } = values;
    if (new_password1 && new_password2 && new_password1 !== new_password2) {
      errors.new_password2 = 'different_password';
    }
    if (
      old_password &&
      old_password === new_password1 &&
      new_password1 === new_password2
    ) {
      errors.new_password2 = 'same_password';
    }
    return errors;
  };
  _changePassword = (config = {}) => {
    const { values } = this.state;
    let count = 3;
    const submitValus = {
      old_password: values.old_password,
      new_password: values.new_password2,
      //code: values.code ? values.code : '',
    };
    this.props.dispatch({type:'Account/changePassword',payload:{ ...submitValus, ...config }}).then(result => {
      if (result) {
        this.setState({ resultShow: result });
        this.interval = setInterval(() => {
          count -= 1;
          this.setState({ count });
          if (count === 0) {
            clearInterval(this.interval);
            this.props.dispatch({type:'Account/logout'});
          }
        }, 1000);
      }
    });
  };
  _submit = values => {
    this.setState({ values }, () => {
      //const  {locale}  = this.props;
      // initNECaptcha(locale, this._changePassword).then(instance => {
      //   if (!instance) {
          this._changePassword();
      //     return;
      //   }
      //   instance.popUp();
      // });
    });
  };
  render() {
    const { loading,locale } = this.props;
    const { resultShow, count } = this.state;
    const action = (
        <button disabled={loading} className='submit_button' style={{marginRight:'30px'}}>
          <FormattedMessage id="submit" />
        </button>
    );
    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div className={classnames(common.container, styles.container)}>
          <div className={styles.sms}>
            {!resultShow ? (
              <Form
                className={styles.sms_form}
                onSubmit={this._submit}
                form="request-password"
                validate={this._validate}
                asyncBlurFields={['mobile']}
                action={action}
                actionAlign="flex-end"
                >
                <FormattedMessage id="password_placeholder1">
                  {msg => (
                    <Field
                      name="old_password"
                      type="password"
                      component={FieldInput}
                      placeholder={msg}
                      label={<FormattedMessage id="old_password" />}
                    />
                  )}
                </FormattedMessage>
                <FormattedMessage id="password_placeholder2">
                  {msg => (
                    <Field
                      name="new_password1"
                      type="password"
                      component={FieldInput}
                      label={<FormattedMessage id="new_password" />}
                      placeholder={msg}
                    />
                  )}
                </FormattedMessage>
                <FormattedMessage id="password_placeholder3">
                  {msg => (
                    <Field
                      name="new_password2"
                      type="password"
                      component={FieldInput}
                      label={<FormattedMessage id="confirm_password" />}
                      placeholder={msg}
                    />
                  )}
                </FormattedMessage>
              </Form>
            ) : (
              <div className={styles.sms_result}>
                <img src={Icon} />
                <FormattedMessage id="resetSuccess" />
                <FormattedMessage
                  id="resetSuccess2"
                  values={{ count: count }}
                />
                <button className='submit_button' onClick={this._logout} style={{marginTop:'10px'}}>
                  <FormattedMessage id="goBackHome" />
                </button>
              </div>
            )}
          </div>
        </div>
      </IntlProvider>
    );
  }
}
export default  Reset