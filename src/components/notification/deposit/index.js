import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { IntlProvider } from 'umi-plugin-locale';
// import Tab from 'components/tab';
import CryptoDeposit from './crypto';
import Bank from './bank';
// import Credit from './credit';

// const Deposit = ({ match: { url } }) => <Tab url={url} routes={routes} />;
// export default Deposit;
@connect(state => ({
  locale: state.Intl.locale,
}))
class Deposit extends PureComponent {
  render() {
    const { coin, locale } = this.props;
    return (
      <IntlProvider locale={locale}>
        {coin === 'USD' ? <Bank name={coin} /> : <CryptoDeposit name={coin} />}
      </IntlProvider>
    );
  }
}
export default  Deposit