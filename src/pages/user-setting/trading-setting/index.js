import React, { PureComponent } from 'react';
import {  Link } from 'react-router-dom';
import { IntlProvider, FormattedMessage } from 'umi-plugin-locale';
import { connect } from 'dva';
import classnames from 'classnames/bind';
import styles from './styles.scss';
import messages from './messages.json';

/*eslint-enable*/

const cx = styles::classnames;

@connect(
  state => ({
    is_double_check: state.Security.is_double_check,
    locale: state.Intl.locale,
  }),
  dispatch => ({
    _toggleConfirm: value => dispatch({type:'toggleConfirm',payload:value}),
  })
)
class TradingSetting extends PureComponent {
  state = {
    isDoubleCheck: this.props.is_double_check,
    data: [
      {
        name: <FormattedMessage id="transaction" />,
        discription: <FormattedMessage id="transaction_use" />,
        key: 'double-check',
        action: '',
      }
    ],
  };
  componentWillReceiveProps(nextProps) {
    const { is_double_check } = nextProps;
    if (this.props.is_double_check !== is_double_check) {
      this.setState({ isDoubleCheck: is_double_check });
    }
  }
  _toggleConfirm = value => {
    const { _toggleConfirm } = this.props;
    _toggleConfirm(value);
  };
  render() {
    const {
      match: { path },
      locale,
    } = this.props;
    const { data, isDoubleCheck } = this.state;
    const profile = {};
    return (
      <IntlProvider
        locale={locale}
        messages={messages[locale]}
        style={{ padding: '0 20px' }}
      >
        <ul className={styles.list}>
          {data.map(item => (
              <li key={item.key}>
                <span>
                  {item.name}
                  <span className={styles.list_itemTips}>
                    {item.discription}
                  </span>
                </span>
                <span
                  className={cx({
                    status_open: profile[item.field],
                    status_close: !profile[item.field],
                  })}
                >
                  {item.field && (
                    <FormattedMessage
                      id={
                        profile[item.field]
                          ? 'status_open'
                          : 'status_close'
                      }
                    />
                  )}
                </span>
                <span>
                  {item.action ? (
                    <Link
                      to={`${path}/${item.key}`}
                      style={{ color: '#2c90d5' }}
                    >
                      {item.action &&
                        !profile[item.field] && (
                          <FormattedMessage id={item.action} />
                        )}
                    </Link>
                  ) : (
                    <span className={cx(styles.switch, styles.white)}>
                      <input
                        onChange={() => this._toggleConfirm(false)}
                        type="radio"
                        name="switch"
                        id="switch-off"
                        checked={!isDoubleCheck}
                      />
                      <input
                        onChange={() => this._toggleConfirm(true)}
                        type="radio"
                        name="switch"
                        id="switch-on"
                        checked={isDoubleCheck}
                      />
                      <span className={cx(styles.toggle)} />
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
      </IntlProvider>
    );
  }
}
export default  TradingSetting;
