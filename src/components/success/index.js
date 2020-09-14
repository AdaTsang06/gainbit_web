import React, { PureComponent } from 'react';
import { FormattedMessage, IntlProvider } from 'umi-plugin-locale';
import { connect } from 'dva';
import Icon from '@/assets/svg/success';
import messages from './messages.json';
import styles from './styles.scss';

@connect(state =>({
  locale: state.Intl.locale
}))
class Success extends PureComponent {
  render() {
    const { msg, style, locale } = this.props;
    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div className={styles.success} style={style}>
          <Icon />
          <FormattedMessage id={msg} />
        </div>
      </IntlProvider>
    );
  }
}
export default  Success