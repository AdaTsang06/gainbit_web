import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { connect } from 'dva';
import stringifyVolumn from '@/utils/format';
import { FormattedMessage, IntlProvider} from 'umi-plugin-locale';
import styles from './styles.scss';
import messages from './messages';
import { dir, dir_reverse, order_type, orderMap } from '@/common/constant-enum';

@connect(
  state => ({
    order: state.Notification.order,
    locale: state.Intl.locale
  })
)
class Confirm extends PureComponent {
  removeTemplate = () =>{
    this.props.dispatch({type:'Notification/changeTemplate',payload:{type:'open_allocation_confirm'}})
  }
  _handleOrder = () => {
    const {
      order,
      type = 0,
    } = this.props;
    if (type === 1) {
      delete order.getPriceFixed;
      delete order.getQuantityFixed;
      //this.dispatch({type:'',payload:order})
    } else {
      //this.dispatch({type:'',payload:order.symbol});
    }
    this.removeTemplate();
  };
  render() {
    const { order, type = 0,locale } = this.props;
    const {
      symbol,
      type: orderType,
      price,
      amount,
      direction,
      getPriceFixed,
      getQuantityFixed,
    } = order;
    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div className={styles.confirm}>
          <div className={styles.confirm_header}>
            {type === 1 ? (
              <FormattedMessage id={dir_reverse[direction]} />
            ) : (
              <FormattedMessage id="cancel_tip" />
            )}
          </div>
          {type === 1 ? (
            <div className={styles.confirm_body}>
              <p>
                <FormattedMessage
                  id="symbol"
                  values={{ symbol: symbol.split('_').join('/') }}
                />
              </p>
              <p>
                <FormattedMessage id="orderType" />&nbsp;<FormattedMessage
                  id={orderMap[orderType]}
                />
              </p>
              {orderType !== order_type.market && (
                <p>
                  <FormattedMessage
                    id="price"
                    values={{ price: stringifyVolumn(price, getPriceFixed) }}
                  />&nbsp;{symbol.split('_')[1]}
                </p>
              )}
              <p>
                <FormattedMessage
                  id="quantity"
                  values={{
                    quantity: stringifyVolumn(amount, getQuantityFixed),
                  }}
                />&nbsp;{symbol.split('_')[0]}
              </p>
            </div>
          ) : (
            <div className={styles.confirm_body}>
              <div className={styles.cancel_all}>
                <FormattedMessage id="cancel_all" />
              </div>
            </div>
          )}
          <div className={styles.confirm_footer}>
            <button
              onClick={this.removeTemplate}
              className={styles.confirm_cancel}
            >
              <FormattedMessage id="cancel" />
            </button>
            <button
              onClick={this._handleOrder}
              className={classNames(
                direction === dir.buy ? styles.buy : styles.sell
              )}
            >
              <FormattedMessage id="confirm" />
            </button>
          </div>
        </div>
      </IntlProvider>
    );
  }
}
export default Confirm;