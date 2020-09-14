import React, { Component } from 'react';
import { connect } from 'dva';
import Order from './order';
import { order_status, order_status_reverse } from '../../../common/constant-enum';
import styles from './styles.scss';

@connect(
  state => ({
    loggedIn: state.Account.loggedIn,
  }),
  dispatch => ({
    getOrdersBySymbol: params => {
      dispatch({type:'trading/getOrdersBySymbol',payload:params});
    },
  })
)
class TradingOrder extends Component {
  componentWillMount() {
    const { loggedIn, market } = this.props;
    this.queryOrdersBySymbol(market, loggedIn);
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.market !== nextProps.market ||
      this.props.loggedIn !== nextProps.loggedIn
    ) {
      this.queryOrdersBySymbol(nextProps.market, nextProps.loggedIn);
    }
  }

  queryOrdersBySymbol = (market, loggedIn) => {
    const { getOrdersBySymbol,accountInfo = {} } = this.props;
    if (loggedIn) {
      getOrdersBySymbol({
        accountid:accountInfo.id || 0,
        symbolid: market || 0,
        limit: 10,
        skip: 0,
      });
    }
  };
  _cancelOrder = (id) => {
    const { cancelOrder,accountInfo,loggedIn, market } = this.props;
    cancelOrder({accountid:accountInfo.id,orderid:id},()=>{
      this.queryOrdersBySymbol(market, loggedIn);
    });
  }
  render() {
    const {
      orders,
      market,
      symbolInfo,
      cancelAllOrders,
      replaceOrder,
    } = this.props;
    const newOrders = orders.filter(item =>{
      return item.status === order_status.placed || item.status === order_status.partially;
    });
    return (
      <div className={styles.trading_order}>
        <Order
          {...this.props}
          orders={newOrders}
          symbolInfo={symbolInfo}
          cancelOrder={this._cancelOrder}
          cancelAllOrders={() => cancelAllOrders(market)}
          replaceOrder={replaceOrder}
        />
      </div>
    );
  }
}
export default  TradingOrder