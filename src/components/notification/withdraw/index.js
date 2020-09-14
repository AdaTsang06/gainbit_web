import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { IntlProvider } from 'umi-plugin-locale';
import Crypto from './crypto';
import Fait from './fait';

@connect(state => ({
  locale: state.Intl.locale,
}))
class Withdraw extends PureComponent {
  render() {
    const { coin, locale } = this.props;
    return (
      <IntlProvider locale={locale}>
        {coin === 'USD' ? (
          <Fait coin={coin} name={coin} />
        ) : (
          <Crypto coin={coin} name={coin} />
        )}
      </IntlProvider>
    );
  }
}
export default  Withdraw