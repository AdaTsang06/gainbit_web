import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { IntlProvider } from 'umi-plugin-locale';
import messages from './messages.json';

@connect(
  state => ({
    locale: state.Intl.locale,
    loggedIn: state.Account.loggedIn
  }))
class Account extends PureComponent {
  render() {
    const {
      locale,
      children,
    } = this.props;
    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        {children}
      </IntlProvider>
    );
  }
}
export default  Account