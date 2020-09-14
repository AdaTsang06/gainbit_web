import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-locale';
import classnames from 'classnames';
import Big from 'big.js';
import OrderConfirm from './orderConfirm';
import stringifyVolumn from '@/utils/format';
import { acCurrency } from '../../../common/constants';
import { getTotalProfitAndFrozen } from '../../../utils/wallet';
import { LIMIT, MARKET, STOP, dir, order_type,symbol_status, account_type } from '../../../common/constant-enum';
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
    modalVisible:false,
    isCached: false
  };
  componentWillMount() {
    const {
      balanceInfo,
      form,
      nowTicker,
      scale,
      exchangeType,
      currencyInfos,
      ticker,
      positionInfos,
      _orderBook,
      market
    } = this.props;
    if (balanceInfo) {
      this._getBalance(balanceInfo, form, nowTicker, scale,exchangeType,currencyInfos,ticker,positionInfos);
    }
    this.setInitPrice(market, form === 'buy', _orderBook);
  }
  componentWillReceiveProps(nextProps) {
    const {
      balanceInfo,
      market,
      form,
      nowTicker,
      orderType,
      buyClickPrice,
      sellClickPrice,
      clickAmount,
      replaceValue,
      scale,
      exchangeType,
      currencyInfos,
      ticker,
      positionInfos,
      _orderBook
    } = nextProps;
    const side = form === 'buy';
    const checkSide = side ? dir.buy : dir.sell;
    const checkIndex = replaceValue && replaceValue.side === checkSide;
    if (market !== this.props.market || balanceInfo !== this.props.balanceInfo || scale !== this.props.scale 
      || this.props.currencyInfos !== currencyInfos) {
      this._getBalance(balanceInfo, form, nowTicker, scale,exchangeType,currencyInfos, ticker,positionInfos);
    }
    if(exchangeType === account_type.accountTypeTd){
      if (this.props.ticker !== ticker || this.props.positionInfos !== positionInfos) {
        this._getBalance(balanceInfo, form, nowTicker, scale,exchangeType,currencyInfos, ticker,positionInfos);
      }
    }
    if(!this.state.isCached && _orderBook !== this.props._orderBook){
      this.setInitPrice(market, side, _orderBook);
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
    }
    if (orderType !== this.props.orderType) {
      this.setState({ error: null, amount: '', percent: 0, });
    }
    if (
      replaceValue !== this.props.replaceValue &&
      replaceValue &&
      checkIndex
    ) {
      this.setState({
        price: replaceValue.price,
        amount: replaceValue.old_quantity,
      });
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

  setInitPrice = (market, side,_orderBook) => {
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
  _getBalance = (balanceInfo, form, nowTicker, scale, exchangeType,currencyInfos={}, ticker,
    positionInfos) => {
    const [cb,cf] = [nowTicker.currency_quantity, nowTicker.currency_price];
    const currency = (exchangeType === account_type.accountTypeTd || form === 'buy') ? cf : cb
    const currencyInfo = currencyInfos[currency] || {};
    const balance = (balanceInfo && balanceInfo[currency]) || {};
    let avail = balance.amount_available || 0;
    if(exchangeType === account_type.accountTypeTd){
      const profit = getTotalProfitAndFrozen(positionInfos, ticker, currencyInfos).profit;//浮动盈亏
      avail = this.big('plus', profit || 0, parseFloat(avail || 0) , currencyInfo.digits);
    }
    this.setState({ avail: avail * scale });
  };


  _handleSubmit = () => {
    const { price } = this.state;
    const {
      nowTicker,
      isLogin,
      history,
      replaceValue,
      orderType
    } = this.props;
    if (!isLogin) {
      history.push('/login');
      return;
    }
    if (!replaceValue) {
      if (!this._validateSubmit()) {
        setTimeout(() => {
          this.setState({ error: null });
        }, 3000);
        return;
      }
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
    const { amount, price } = this.state;
    const {
      form,
      nowTicker,
      orderType,
      market,
      replaceValue,
      dispatch,
      scale,
      accounInfo
    } = this.props;
    const data = {
      accountid:accounInfo.id,
      symbolid: market,
      price: orderType === MARKET ? (nowTicker.price || "0") : price,
      amount: amount,
      type: order_type[orderType],
      direction: dir[form],
      lever: scale
    };
    if (replaceValue) {
      data.order_id = replaceValue.order_id;
      data.old_quantity = replaceValue.old_quantity;
      this.props.cancelReplaceOrder();
    }
    dispatch({type:"trading/placeOrder",payload:data})
    this.setState({ modalVisible: false });
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
    if (orderType === LIMIT) {
      const total = this.big('times', Price || 0, Amount || 0);
      if (side) {
        if (Number(total) > Number(avail)) {
          this.setState({ error: 'error3' });
          return false;
        }
      } else if (Amount > Number(avail)) {
        this.setState({ error: 'error3' });
        return false;
      }
    }
    this.setState({ error: null });
    return true;
  }
  big(str, number, val, toFix = 8) {
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
    const { symbolInfo,orderType,form, currencyInfos, exchangeType } = this.props;
    const currencyInfo = currencyInfos[symbolInfo.currency_price ];
    const digits = (currencyInfo && currencyInfo.digits) || symbolInfo.digits_price;
    const { price } = this.state;
    const orderLimit = this._getOrderLimit();
    const isExBuy = exchangeType === account_type.accountTypeEx && orderType=== MARKET && form === 'buy';
    if (this._validateInput(value, isExBuy ?digits:symbolInfo.digits_amount)) return;
    let amount = value || 1;
    if(isExBuy){
      amount = (amount / (price || 1)).toFixed(digits);
   }
    this.setState({
      amount: value,
      percent: parseFloat(this.big(
        'div',
        parseFloat(orderLimit) !== 0 ? parseFloat(orderLimit) : 1,
        amount || 0,
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
    const { form, exchangeType } = this.props;
    const { avail } = this.state;
    const orderPrice = this._getOrderPrice();
    const side = form === 'buy';
    return exchangeType=== account_type.accountTypeTd || side
      ? this.big(
          'div',
          (parseFloat(orderPrice) != 0 && orderPrice) || 1,
          avail || 0
        )
      : this.big('times', 1, avail || 0);
  }
  _getOrderPrice = () => {
    const { nowTicker, orderType } = this.props;
    const { price } = this.state;
    return orderType === MARKET ? nowTicker.price : price;
  };
  _onPercentClick = item => {
    const { orderType, form, symbolInfo,currencyInfos, exchangeType } = this.props;
    const { avail } = this.state;
    let amount = item.value;
    const currencyInfo = currencyInfos[symbolInfo.currency_price ];
    const digits = (currencyInfo && currencyInfo.digits) || symbolInfo.digits_price;
    if(exchangeType === account_type.accountTypeEx && orderType=== MARKET && form === 'buy'){
       amount = (avail * item.text).toFixed(digits);
    }
    this.setState({ amount: amount, percent: item.text });
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
  _cancelReplaceOrder = () => {
    const { nowTicker, cancelReplaceOrder } = this.props;
    this.setState({ price: nowTicker.price, amount: '', percent: 0 });
    cancelReplaceOrder();
  };
  render() {
    const {
      form,
      orderType,
      nowTicker,
      replaceValue,
      scale,
      exchangeType,
      symbolInfo,
      currencyInfos,
      isLogin
    } = this.props;  
    const [currency,baseMarket] = (nowTicker && [nowTicker.currency_quantity, nowTicker.currency_price]) || [];
    const bCurrencyInfo = currencyInfos[baseMarket] || {};
    const getBaseMarketFixed = bCurrencyInfo.digits;
    const cCurrencyInfo = currencyInfos[currency] || {};
    const getcFixed = cCurrencyInfo.digits;
    const { amount, price, error, avail, percent,modalVisible } = this.state;
    const side = form === 'buy';
    const orderPrice = this._getOrderPrice();
    const orderTotal = new Big(orderPrice || 0)
      .times(amount || 0)
      .toFixed(getBaseMarketFixed);
    const marks = this._estimate();
    const checkSide = side ? dir.buy : dir.sell;
    const checkZIndex = replaceValue && replaceValue.side === checkSide;
    const sideColor = side ? '#00C998' : '#FF4E4E';
    const isTdAccount = exchangeType=== account_type.accountTypeTd;
    const btnDisabled =
    symbolInfo &&
      (side
        ? symbolInfo.status === symbol_status.sell_only ||
        symbolInfo.status === symbol_status.disable
        : symbolInfo.status === symbol_status.buy_only ||
        symbolInfo.status === symbol_status.disable);
    return (
      <div
        className={classnames(styles.order_form, {
          [styles.replace_show]: checkZIndex,
        })}
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
              {/* <span className={styles.order_form_item_tips}>≈ ￥45878.38</span> */}
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
            {!isTdAccount && orderType === MARKET ? (
              <FormattedMessage id="buyPrice2" />
            ) : (
              <FormattedMessage id="buyNumber" />
            )}
            <div className={styles.order_form_item_input}>
              <input
                type="number"
                value={amount || ''}
                onChange={this._onAmountChange}
              />
              <span className={styles.currency_type}>
                {!isTdAccount && orderType === MARKET ? acCurrency : currency}
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
        {isLogin && <div>
          {(isTdAccount || orderType !== MARKET) && <span className={styles.order_form_item_lable}>
            <FormattedMessage
              id="totalOrder"
              values={{ currency: baseMarket }}
            />
            <span>{stringifyVolumn(orderTotal, getBaseMarketFixed)}</span>
          </span>}
          <span className={styles.order_form_item_lable}>
            <FormattedMessage
              id="availOrder"
              values={{ currency: isTdAccount || side ? baseMarket : currency }}
            />
            <span>
              {stringifyVolumn(
                avail/scale,
                isTdAccount || side ? getBaseMarketFixed : getcFixed
              )}
            </span>
          </span>
        </div>}
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
        {!checkZIndex ? (
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
              id={side ? (isTdAccount ?'buy_m':'buy') : (isTdAccount ? 'sell_k':'sell')}
            />
          </button>
        ) : (
          <div className={styles.replace_action}>
            <button type="button" onClick={this._cancelReplaceOrder}>
              <FormattedMessage id="cancel_replace" />
            </button>
            <button
              style={{
                border: side ? 'solid 1px #00C998' : 'solid 1px #FF4E4E',
                backgroundColor: side ? '#00C998' : '#FF4E4E',
              }}
              type="button"
              onClick={this._handleSubmit}
            >
              <FormattedMessage values={{ currency }} id="replace_order" />
            </button>
          </div>
        )}
        <OrderConfirm visible={modalVisible} hideModal={() => this.setState({modalVisible: false})} confirm={this._confirm}/>
      </div>
    );
  }
}
export default  Order