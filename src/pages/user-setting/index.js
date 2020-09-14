import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { IntlProvider } from 'umi-plugin-locale';
import messages from './messages.json';

@connect(state => ({
  locale: state.Intl.locale,
}))
class userSetting extends PureComponent {
  render() {
    const { locale } = this.props;
    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        {this.props.children}
      </IntlProvider>
    );
  }
}
export default  userSetting