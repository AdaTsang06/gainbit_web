import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'dva';
import { IntlProvider } from 'umi-plugin-locale';
import RegisterForm from './register-form';
import messages from './messages';
import Layout from '../layout';

@withRouter
@connect(
  state => ({
    locale: state.Intl.locale,
    inviteCode: state.Account.inviteCode
  }),
  dispatch => ({
    _updateInviteCode: (code) =>  dispatch({ type: 'Account/updateInviteCode',payload:code })
  })
)
class Register extends PureComponent {
  state = {
    mobile: null,
  };

  componentDidMount(){
    const { match, _updateInviteCode } = this.props;
    if(match && match.params && match.params.invite_code){
      _updateInviteCode(match.params.invite_code);
    }
  }

  render() {    
    const { locale, location,inviteCode } = this.props;
    const llcode = new URLSearchParams(location.search).get('invitationCode');
    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <Layout>
          <RegisterForm
            locale={locale}
            invitationCode={llcode}
            mobileCallback={mobile => this.setState({ mobile })}
            inviteCode={inviteCode}
          />
        </Layout>
      </IntlProvider>
    );
  }
}
export default Register