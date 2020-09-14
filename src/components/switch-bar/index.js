import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { withRouter } from 'react-router-dom';
import { IntlProvider, FormattedMessage } from 'umi-plugin-locale';
import classnames from 'classnames';
import { acTabColor, tabColor } from '@/common/color';
import messages from './messages';
import styles from './styles.scss';

@withRouter
@connect(state => ({
  locale: state.Intl.locale,
}))
class SwitchBar extends PureComponent {
  render() {
    const {
      chose,
      onClick,
      arr,
      className,
      locale,
      style,
      itemStyle = {},
      borderBottom = `2px solid ${acTabColor}`,
      normalColor = tabColor,
      activeTabColor = acTabColor,
      title,
    } = this.props;
    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div style={style} className={classnames(styles.switch_bar, className)}>
          {arr.map((item, idx) => (
            <a
              key={item}
              onClick={() => onClick(item, idx)}
              style={{
                color: chose === item ? activeTabColor : normalColor,
                borderBottom:
                  chose === item ? borderBottom : `0px solid ${acTabColor}`,
                ...itemStyle,
              }}
            >
              <FormattedMessage id={item === 'PER' ? 'Optional' : item} />
            </a>
          ))}
          {title}
        </div>
      </IntlProvider>
    );
  }
}
export default  SwitchBar