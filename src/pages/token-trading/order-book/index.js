import React, { Component } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-locale';
import Big from 'big.js';
import classnames from 'classnames';
import getDepth from '@/common/merge-depth';
import { buyColor, sellColor, textColor, contentBg } from '@/common/color';
import { dir } from '@/common/constant-enum';
import allOrderBookIco from '@/assets/wtlg_rg.png';
import buyOrderBookIco from '@/assets/wtlg_g.png';
import sellOrderBookIco from '@/assets/wtlg_r.png';
// import connecting from '@/assets/ws_connecting.gif';
// import connected from '@/assets//ws_connected.png';
import OrderList from './order-list';
import styles from './styles.scss';
import OrderChart from './order-chart';
import { list_title as listTitle } from '../styles.scss';
import SwitchBar from '@/components/switch-bar';

let initCount = 5;
let defaultCount = initCount;

const getDepthOptions = (cp,cb) => {
  const len = getDepth(cb)(cp);
  const arr = new Array(len + 1).fill(0);
  return arr
    .map((item, index) => ({
      name: <FormattedMessage id="price_depth" values={{ index }} />,
      value: index,
    }))
    .reverse()
    .filter((item, index) => index <= 2)
    .reverse();
};

@connect(state => ({
  conected: state.ws.conectWS,
  _orderBook: state.ws.orderBook,
}))
class OrderBook extends Component {
  state = {
    depthOptions: [],
    depth: '',
    isOnline: true,
    count: defaultCount,
    sellOrBuy: 0 //买卖
  };
  orderRef = {};
  componentDidMount() {
    const { nowTicker} = this.props;
    this.setState({ depthOptions: getDepthOptions(nowTicker.currency_quantity, nowTicker.currency_price) });
    this._calcCount();
    this._setDepth(nowTicker.currency_quantity, nowTicker.currency_price);
    window.addEventListener('resize', this._calcCount, false);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this._calcCount, false);
  }
  componentWillReceiveProps(nextProps) {
    const { nowTicker,market } = nextProps;
    if (market !== this.props.market) {
      this.setState({ depthOptions: getDepthOptions(nowTicker.currency_quantity, nowTicker.currency_price) });
    }
  }
  _calcCount = () => {
    const sectionHeight =
      (((this.orderRef && this.orderRef.clientHeight) || 400) - 102) / 2;
    const count = parseInt(sectionHeight / 18, 10);
    this.setState({
      count: count > defaultCount ? defaultCount : count,
    });
  };
  _setDepth = (cp,cb) => {
    const len = getDepth(cb)(cp);
    this.setState({ depth: len });
  };
  big(str, number, val, toFix = 8) {
    const c = new Big(val);
    return c[str](number).toFixed(toFix);
  }
  _onDepthChange = depth => {
    this.setState({ depth });
  };
  _getChartData = (data, count) =>
    [{ total: 0 }, ...data.map(item => ({ total: Number(item.total) }))].splice(
      0,
      count
    );
  _mergeDepth = (data = [], side) => {
    let result = [];
    data.sort((a, b) => (side === dir.buy ? b[0] - a[0] :  b[0] -a[0])).reduce(
      (a, b) => {
        const total = this.big('plus', a.total, b[1]);
        const c = { Price: b[0], Size: b[1], total };
        result.push(c);
        return c;
      },
      { total: 0 }
    );
    return result;
  };

  _changShow = type => {
    switch (type) {
      case 'sell':
        this.setState({ sellOrBuy: dir.sell, count: 2 * initCount });
        defaultCount = 2 * initCount;
        break;
      case 'buy':
        this.setState({ sellOrBuy: dir.buy, count: 2 * initCount });
        defaultCount = 2 * initCount;
        break;
      default:
        this.setState({ sellOrBuy: 0, count: initCount });
        defaultCount = initCount;
        break;
    }
  };

  render() {
    const {
      //conected,
      className,
      callbackOrderInfo,
      _orderBook,
      nowTicker,
      market
    } = this.props;
    let orderBook = {};
    if(market === _orderBook.symbolid){
      orderBook = _orderBook;
    }
    else{
      orderBook[dir.sell]=[];
      orderBook[dir.buy]=[];
    }
    const { count, sellOrBuy } = this.state;
    const sellOrder = this._mergeDepth(orderBook[dir.sell].slice(0, count), dir.sell);
    const buyOrder = this._mergeDepth(orderBook[dir.buy].slice(0, count), dir.buy);
    const sellData = this._getChartData(sellOrder, count);
    const buyData = this._getChartData(buyOrder, count);
    const [amoutUnit, priceUnit] = (nowTicker && [nowTicker.currency_quantity, nowTicker.currency_price]) || [];
    const title = (
      <span className={styles.chooseOrder}>
        <img
          src={allOrderBookIco}
          alt="all"
          onClick={() => {
            this._changShow('');
          }}
        />
        <img
          src={buyOrderBookIco}
          alt="buy"
          onClick={() => {
            this._changShow('buy');
          }}
        />
        <img
          src={sellOrderBookIco}
          alt="sell"
          onClick={() => {
            this._changShow('sell');
          }}
        />
      </span>
    );
    const isDown = nowTicker && nowTicker.change_amount;
    const color = !Number(isDown)
      ? textColor
      : isDown > 0
        ? buyColor
        : sellColor;
    return (
      <div style={{ marginRight: '3px' }}>
        <SwitchBar
          style={{
            padding: '0 20px',
            backgroundColor: contentBg,
          }}
          chose={'entrust'}
          arr={['entrust']}
          title={title}
          activeTabColor={textColor}
        />
        <section
          ref={e => {
            this.orderRef = e;
          }}
          className={classnames(className, styles.order_book_section)}
        >
          <OrderChart buyData={buyData} sellData={sellData} />
          {sellOrBuy !== dir.buy && (
            <div className={listTitle}>
              <FormattedMessage id="sell2" />
              <FormattedMessage
                id="price_market"
                values={{ unit: priceUnit }}
              />
              <FormattedMessage
                id="amount_market"
                values={{ unit: amoutUnit }}
              />
            </div>
          )}
          {sellOrBuy !== dir.buy && (
            <OrderList
              order={sellOrder}
              idx={dir.sell}
              count={count}
              sellOrBuy={sellOrBuy}
              callbackClickOrderInfo={obj =>
                callbackOrderInfo(Object.assign({}, obj))
              }
            />
          )}
          {/* <div
            className={classnames(styles.order_latest_price, {
              [styles.isRise]: change_amount > 0,
              [styles.isDown]: change_amount < 0,
            })}
          >
            <FormattedMessage id="last_price" />
            <span className={styles.current_price}>{price}</span>
            <span
              style={{ color }}
              className={styles.order_latest_price_rate24}
            >
              {isDown > 0 ? '+' : ''}
              {nowTicker.change_percent}
            </span>
          </div> */}
          {sellOrBuy !== dir.sell && (
            <div className={listTitle}>
              <FormattedMessage id="buy2" />
              <FormattedMessage
                id="price_market"
                values={{ unit: priceUnit }}
              />
              <FormattedMessage
                id="amount_market"
                values={{ unit: amoutUnit }}
              />
            </div>
          )}
          {sellOrBuy !== dir.sell && (
            <OrderList
              order={buyOrder}
              idx={dir.buy}
              count={count}
              sellOrBuy={sellOrBuy}
              callbackClickOrderInfo={obj =>
                callbackOrderInfo(Object.assign({}, obj))
              }
            />
          )}
          {/* <div className={styles.merge_depth}>
            <FormattedMessage id="group" />
            {depthOptions.length > 0 &&
              depth !== '' && (
                <Select
                  width={100}
                  defaultValue={depth}
                  onChange={this._onDepthChange}
                  arr={depthOptions}
                  options={{ itemSize: 32 }}
                />
              )}
          </div> */}
        </section>
      </div>
    );
  }
}
export default OrderBook