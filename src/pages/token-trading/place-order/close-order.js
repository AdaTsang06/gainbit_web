import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'umi-plugin-locale';
import { connect } from 'dva';
import classnames from 'classnames';
import Big from 'big.js';
import OrderConfirm from './orderConfirm';
import stringifyVolumn from '@/utils/format';
import { LIMIT, MARKET, STOP, dir, order_type,symbol_status } from '../../../common/constant-enum';
import 'rc-slider/assets/index.css';
import styles from './styles.scss';

@withRouter
@connect(
  state => ({
    _orderBook: state.ws.orderBook,
  })
)
class Order extends Component {
   state = {
    amount: '',
    percent: 0,
    price: '',
    error: null,
    avail: 0,
    positonInfo:{},
    modalVisible:false,
    isCached: false
  };
  componentDidMount() {
    const {
      form,
      positions,
      _orderBook,
      market,
    } = this.props;
    if (positions) {
      this._getBalance(positions, form, true);
    }
    this.setInitPrice(market,form === 'buy', _orderBook);
  }
  componentWillReceiveProps(nextProps) {
    const {
      positions,
      market,
      form,
      orderType,
      buyClickPrice,
      sellClickPrice,
      clickAmount,
      _orderBook
    } = nextProps;
    const side = form === 'buy';
    if (positions !== this.props.positions) {
      this._getBalance(positions, form, false);
    }
    if(!this.state.isCached && _orderBook !== this.props._orderBook){
      this.setInitPrice(market,side, _orderBook);
    }
    if (!side &&  buyClickPrice) {
      this.setState({ price: buyClickPrice });
    }
    if (side && sellClickPrice) {
      this.setState({ price: sellClickPrice });
    }
    if (this.props.clickAmount !== clickAmount) {
      this.setState({ amount: clickAmount });
    }
    if (market !== this.props.market) {
      this.setState({
        amount: '',
        percent: 0,
        isCached: false,
        price:''
      });
      this._getBalance(positions, form, true);
    }
    if (orderType !== this.props.orderType) {
      this.setState({ error: null });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    const _nextProps = { ...nextProps, nowTicker: null };
    const _props = { ...this.props, nowTicker: null };
    if (
      JSON.stringify(_props) === JSON.stringify(_nextProps) &&
      this.props.nowTicker.price === nextProps.nowTicker.price &&
      JSON.stringify(this.state) === JSON.stringify(nextState)
    ) {
      return false;
    }
    return true;
  }
  setInitPrice = (market, side, _orderBook) => {
    if(market === _orderBook.symbolid){
      let p='';
      if(!side && _orderBook[dir.buy] && _orderBook[dir.buy].length){
        p=_orderBook[dir.buy][0][0];
      }
      if(side && _orderBook[dir.sell] && _orderBook[dir.sell].length){
        p=_orderBook[dir.sell][0][0];
      }
      this.setState({isCached:true,price:p});
    }
  }
  _getBalance = (positions, form, flag) => {
    let avail = 0,p= {};
    if(positions){
      const direction = form === 'buy' ? dir.sell: dir.buy;
      let pos =positions.filter(item => {
        return item.direction === direction;
      });
      if(pos.length){
         p = pos[0];
         avail =  p.amount_available;
      }
    }
    if(flag){
      this.setState({ avail: avail, positonInfo: p, amount:avail, percent:avail > 0 ? 1 : 0 });
    }
    else{
      this.setState({ avail: avail, positonInfo: p});
    }
  };
  _handleSubmit = () => {
    const { price } = this.state;
    const {
      nowTicker,
      isLogin,
      history,
      orderType
    } = this.props;
    if (!isLogin) {
      history.push('/login');
      return;
    }
    if (!this._validateSubmit()) {
      setTimeout(() => {
        this.setState({ error: null });
      }, 3000);
      return;
    }
    if(orderType === LIMIT ){
      const cPrice = parseFloat(nowTicker.price);
      if(parseFloat(price) < cPrice - cPrice*0.08 || parseFloat(price) > cPrice + cPrice*0.08){
        this.setState({ modalVisible: true })
      }
      else{
        this._confirm();
      }
    }
    else{
      this._confirm();
    }
  };

  _confirm = () => {
    const { amount, price,positonInfo } = this.state;
    const {
      nowTicker,
      orderType,
      dispatch,
      accounInfo,
    } = this.props;
    if(positonInfo && positonInfo.id){
      const data = {
        accountid:accounInfo.id,
        positionid: positonInfo.id,
        price: orderType === MARKET ? (nowTicker.price || "0") : price,
        amount: amount,
        type: order_type[orderType],
      };
      dispatch({type:"trading/closeOrder",payload:data});
      this.setState({ modalVisible: false });
    }   
  };

  _validateSubmit() {
    const { price, amount, avail } = this.state;
    const { orderType, nowTicker, form, symbolInfo } = this.props;
    const side = form === 'buy';
    const Price = Number(price);
    const Amount = Number(amount);
    if ((orderType === LIMIT && !Price) || (orderType === STOP && !Price)) {
      this.setState({ error: 'error1' });
      return false;
    }
    if (!Amount) {
      this.setState({ error: 'error2' });
      return false;
    }
    if (!Number(avail)) {
      this.setState({ error: 'error3' });
      return false;
    }
    // if (orderType === STOP) {
    //   if (!side && Price > nowTicker.price) {
    //     this.setState({ error: 'error4' });
    //     return false;
    //   }
    //   if (side && Price < nowTicker.price) {
    //     this.setState({ error: 'error5' });
    //     return false;
    //   }
    // }
    // if (orderType === LIMIT || orderType === STOP) {
    //   if (side && Amount < Number(symbolInfo.amount_buy_min || 0)) {
    //     this.setState({ error: 'errorBuyMin' });
    //     return false;
    //   }
    //   if (side && Amount > Number(symbolInfo.amount_buy_max || 0)) {
    //     this.setState({ error: 'errorBuyMax' });
    //     return false;
    //   }
    //   if (!side && Amount < Number(symbolInfo.amount_sell_min || 0)) {
    //     this.setState({ error: 'errorSellMin' });
    //     return false;
    //   }
    //   if (!side && Amount > Number(symbolInfo.amount_sell_max || 0)) {
    //     this.setState({ error: 'errorSellMax' });
    //     return false;
    //   }
    // }
    // if (orderType === MARKET) {
    //   const total = this.big('times', Price || 0, Amount || 0);
    //   if (side && total < Number(symbolInfo.volume_buy_min  || 0)) {
    //     this.setState({ error: 'errorLimitBMin' });
    //     return false;
    //   }
    //   if (side && total > Number(symbolInfo.volume_buy_max  || 0)) {
    //     this.setState({ error: 'error1LimitBMax' });
    //     return false;
    //   }
    //   if (!side && total < Number(symbolInfo.volume_sell_min || 0)) {
    //     this.setState({ error: 'errorLimitSMin' });
    //     return false;
    //   }
    //   if (!side && total > Number(symbolInfo.volume_sell_max || 0)) {
    //     this.setState({ error: 'error1LimitSMax' });
    //     return false;
    //   }
    // }
    if (orderType === LIMIT || orderType === MARKET) {
      if (Amount > Number(avail)) {
        this.setState({ error: 'error3' });
        return false;
      }
    }
    this.setState({ error: null });
    return true;
  }
  big(str, number, val, toFix = 8) {
    if (val < 0 || number < 0) return 0;
    const c = new Big(val);
    return c[str](number)
    .round(toFix, 0)
    .toFixed(toFix)
  }
  _validateInput(value, precision) {
    if (!Number(value)) return false;
    let pattern = '^([0-9]+(?:[.][0-9]{0,len})?|\\.[0-9]{0,len})$';
    pattern = new RegExp(pattern.replace('len', precision));
    if (value && pattern.test(value)) return false;
    return true;
  }
  _onAmountChange = e => {
    const { value } = e.target;
    const { symbolInfo } = this.props;
    const orderLimit = this._getOrderLimit();
    if (this._validateInput(value, symbolInfo.digits_amount)) return;   
    this.setState({
      amount: value,
      percent: parseFloat(this.big(
        'div',
        parseFloat(orderLimit) !== 0 ? orderLimit : 1,
        value || 0,
        2
      )),
    });
  };
  _onPriceChange = e => {
    const { value } = e.target;
    const { symbolInfo } = this.props;
    if (this._validateInput(value, symbolInfo.digits_price)) {
      return;
    }
    this.setState({ price: value });
  };
  _getOrderLimit() {
    const { avail } = this.state;
    return avail || 0;
  }
  _getOrderPrice = () => {
    const { nowTicker, orderType } = this.props;
    const { price } = this.state;
    return orderType === MARKET ? nowTicker.price : price;
  };
  _onPercentClick = item => { 
    this.setState({ amount: item.value, percent: item.text });
  };
  _estimate = () => {
    const { symbolInfo } = this.props;
    const getQuantityFixed = symbolInfo.digits_amount;
    const orderLimit = this._getOrderLimit();
    return [
      {
        value: this.big('times', 0.25, orderLimit || 0, getQuantityFixed),
        text: 0.25,
      },
      {
        value: this.big('times', 0.5, orderLimit || 0, getQuantityFixed),
        text: 0.5,
      },
      {
        value: this.big('times', 0.75, orderLimit || 0, getQuantityFixed),
        text: 0.75,
      },
      {
        value: this.big('times', 1, orderLimit || 0, getQuantityFixed),
        text: 1,
      },
    ];
  };

  render() {
    const {
      form,
      orderType,
      nowTicker,
      symbolInfo
    } = this.props;
    const { amount, price, error, avail, percent, modalVisible } = this.state;
    const side = form === 'buy';
    const [currency,baseMarket] = (nowTicker && [nowTicker.currency_quantity, nowTicker.currency_price]) || [];
    const marks = this._estimate();
    const sideColor = side ? '#00C998' : '#FF4E4E';
    const btnDisabled =
    symbolInfo &&
      (side
        ? symbolInfo.status === symbol_status.sell_only ||
        symbolInfo.status === symbol_status.disable
        : symbolInfo.status === symbol_status.buy_only ||
        symbolInfo.status === symbol_status.disable);
    return (
      <div
        className={classnames(styles.order_form)}
      >
        {(orderType === LIMIT || orderType === STOP) &&
          (side ? (
            <div className={styles.order_form_item}>
              <FormattedMessage id="buyPrice" />
              <div className={styles.order_form_item_input}>
                <input
                  type="number"
                  value={price || ''}
                  onChange={this._onPriceChange}
                />
                <span className={styles.currency_type}>{baseMarket}</span>
              </div>
            </div>
          ) : (
            <div className={styles.order_form_item}>
              <FormattedMessage id="sellPrice" />
              <div className={styles.order_form_item_input}>
                <input
                  type="number"
                  value={price || ''}
                  onChange={this._onPriceChange}
                />
                <span className={styles.currency_type}>{baseMarket}</span>
              </div>
            </div>
          ))}
        {orderType === MARKET && (
          <div className={styles.order_form_item}>
            {side ? (
              <FormattedMessage id="buyPrice" />
            ) : (
              <FormattedMessage id="sellPrice" />
            )}
            <div className={styles.order_form_item_input}>
              <span className={styles.order_form_item_input_show}>
                <FormattedMessage id="market_best_price" />
              </span>
            </div>
          </div>
        )}
        {side ? (
          <div
            style={{ marginBottom: '10px' }}
            className={styles.order_form_item}
          >
            <FormattedMessage id="buyNumber" />        
            <div className={styles.order_form_item_input}>
              <input
                type="number"
                value={amount || ''}
                onChange={this._onAmountChange}
              />
              <span className={styles.currency_type}>
                {currency}
              </span>
            </div>       
          </div>
        ) : (
          <div
            style={{ marginBottom: '10px' }}
            className={styles.order_form_item}
          >
            <FormattedMessage id="sellNumber" />
            <div className={styles.order_form_item_input}>
              <input
                type="number"
                value={amount || ''}
                onChange={this._onAmountChange}
              />
              <span className={styles.currency_type}>{currency}</span>
            </div>
            {/* <span className={styles.order_form_item_tips}>
              ≤ 0.00000000 {currency}
            </span> */}
          </div>
        )}
        <div className={styles.percent}>
          {marks.map((item, index) => (
            <span
              style={{
                background:
                  percent === item.text
                    ? side
                      ? '#00C998'
                      : '#FF4E4E'
                    : 'transparent',
                border:
                  percent === item.text
                    ? '1px solid #213153'
                    : '1px solid #3A496A',
              }}
              key={index}
              onClick={() => this._onPercentClick(item)}
            >
              {this.big('times', 100, item.text || 0, 0)}%
            </span>
          ))}
        </div>       
        <div>        
          <span className={styles.order_form_item_lable}>
            <FormattedMessage
              id="availClosed"
              values={{ currency: currency }}
            />
            <span>
              {stringifyVolumn(
                avail,
                symbolInfo.digits_amount
              )}
            </span>
          </span>
        </div>
        {error && (
          <div className={styles.error}>
            <FormattedMessage
              id={error}
              values={{
                price: nowTicker.price,
                amount_buy_min: symbolInfo.amount_buy_min,
                amount_buy_max: symbolInfo.amount_buy_max,
                amount_sell_min: symbolInfo.amount_sell_min,
                amount_sell_max: symbolInfo.amount_sell_max,
                limit_buy_min: symbolInfo.volume_buy_min,
                limit_buy_max: symbolInfo.volume_buy_max,
                limit_sell_min: symbolInfo.volume_sell_min,
                limit_sell_max: symbolInfo.volume_sell_max,
              }}
            />
          </div>
        )}
        <button
            type="button"
            style={{
              backgroundColor: sideColor,
            }}
            onClick={this._handleSubmit}
            disabled={btnDisabled}
          >
            <FormattedMessage
              values={{ currency }}
              id={side ? 'buy_k' : 'sell_m'}
            />
          </button>
          <OrderConfirm visible={modalVisible} hideModal={() => this.setState({modalVisible: false})} confirm={this._confirm}/>
      </div>
    );
  }
}
export default  Order