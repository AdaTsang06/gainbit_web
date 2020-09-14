import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { withRouter } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { IntlProvider, FormattedMessage } from 'umi-plugin-locale';
import classnames from 'classnames';
import { acTabColor, tabColor } from '@/common/color';
import messages from './messages';
import styles from './styles.scss';

@withRouter
@connect(state => ({
  locale: state.Intl.locale
}))
class SwitchBarOrder extends PureComponent {
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
                borderBottom: chose === item ? borderBottom : '0px',
                ...itemStyle,
              }}
            >
              {idx === 0 ? (
                <FormattedMessage
                  id={item === 'PER' ? 'Optional' : item}
                  values={{
                    item: (
                      <label
                        data-tip
                        data-for={'order_tips' + idx}
                        className={styles.tab_tip}
                      >
                        <i className={styles.switch_bar_icon} />
                      </label>
                    ),
                  }}
                />
              ) : (
                <FormattedMessage
                  id={item === 'PER' ? 'Optional' : item}
                  values={{
                    item: '',
                  }}
                />
              )}
            </a>
          ))}
          <ReactTooltip
            id="order_tips0"
            effect="solid"
            place="bottom"
            offset={{ right: 18 }}
          >
            <pre>
              <FormattedMessage id="limitTip" />
            </pre>
          </ReactTooltip>
          <ReactTooltip
            id="order_tips2"
            effect="solid"
            place="bottom"
            offset={{ right: 18 }}
          >
            <pre>
              <FormattedMessage id="stopTip" />
            </pre>
          </ReactTooltip>
          {title}
        </div>
      </IntlProvider>
    );
  }
}
export default SwitchBarOrder