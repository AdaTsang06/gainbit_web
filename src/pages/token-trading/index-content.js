import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { IntlProvider, FormattedMessage, now } from 'umi-plugin-locale';
import { Link, withRouter } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import classnames from 'classnames';
import Market from './market';
import History from './history';
import Chart from './chart';
import PlaceOrderEx from './place-order/index-ex';
import PlaceOrderTd from './place-order/index-td';

import OrderBook from './order-book';
import TradingOrder from './trading-order';
import PositionOrder from './position-order';
import styles from './styles.scss';
import { buyColor, sellColor, textColor, contentBg } from '@/common/color';
import { symbol_type, account_type, position_status, dir } from '../../common/constant-enum';
import DropDown from '@/components/drop-down-trade';
import messages from './messages';
import SwitchBar from '@/components/switch-bar';
import nodata from '@/assets/nodata.png';
import questionSm from '@/assets/question_sm.png';

@withRouter
@connect(
  state => ({
    tradeHistory: state.ws.tradeHistory,
    market: state.ws.market,
    ticker: state.ws.ticker,
    balanceInfos: state.Account.balanceInfos,
    isLogin: state.Account.loggedIn,
    locale: state.Intl.locale,
    orders: state.trading.orders,
    acSymbolsObj: state.global.acSymbolsObj,
    accountInfos: state.Account.accountInfos,    
    positionInfos: state.Account.positionInfos,
    currencyInfos: state.Account.currencyInfos,
    kFullScreen: state.global.kFullScreen,
    symbolsObj: state.global.symbolsObj
  }),
  dispatch => ({
    getQuoteRequest: symbolId => {
      dispatch({type:'ws/changeQuoteRequest',payload:symbolId})
    },
    cancelOrder: (param,callBack) => dispatch({type:'trading/cancelOrder',payload:param,callBack}),
    cancelAllOrders: symbol => dispatch({ type: 'CANCEL_ALL_ORDERS', payload:symbol }),
    _showProductIntroduction: symbolInfo =>
      dispatch({
        type: 'Notification/changeTemplate',
        payload: {
          type: 'product-introduction',
          symbolInfo: symbolInfo,
        },
      }),
    updateFullScreen: full => {
      dispatch({type: 'global/updateState', payload:{kFullScreen: full}})
    }   
  })
)
class TokenTrading extends PureComponent {
  state = {
    buyClickPrice: '',
    sellClickPrice:'',
    clickAmount: '',
    replaceValue: null,
    nowTicker: {},
    chose:'pending_orders',
    optType:'',
    positions:[]
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.ticker !== this.props.ticker ||
      nextProps.market !== this.props.market || 
      nextProps.acSymbolsObj !== this.props.acSymbolsObj) {

      this.setState({
        nowTicker: this._getNowTickInfo(
          nextProps.ticker,
          nextProps.market,
          nextProps.acSymbolsObj[nextProps.exchangeType === account_type.accountTypeTd ? symbol_type.td : symbol_type.ex]
        ),
      });
    }
    if(this.props.positionInfos !== nextProps.positionInfos || this.props.market !==  nextProps.market){
      const positions = nextProps.positionInfos.filter(item => {
        return item.symbolid === nextProps.market && item.status === position_status.opened
      })
      this.setState({positions})
    }

  }
  componentWillMount() {
    const { ticker, market, acSymbolsObj,getQuoteRequest, exchangeType,match,symbolsObj, positionInfos } = this.props;
    const syType = exchangeType === account_type.accountTypeTd ? symbol_type.td : symbol_type.ex;
    let optType = match.params.optType || '';
    if(acSymbolsObj[syType][market]){
      getQuoteRequest(market);
      this.setState({
        nowTicker: this._getNowTickInfo(ticker, market, acSymbolsObj[syType]),
        optType, 
        chose: optType==='closePosition'? 'positon_orders': 'pending_orders'
      });
    }
    else{
      let keys= symbolsObj[syType];
      if(keys && keys.length){
        getQuoteRequest(keys[0]);
      }
    }
    if(positionInfos && positionInfos.length){
       const positions = positionInfos.filter(item => {
         return item.symbolid === market && item.status === position_status.opened
       })
       this.setState({positions});
    }
   
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    const node = document.getElementsByClassName('kf5-support-chat')[0];
    if (node) {
      node.style.display = 'none';
    }
  }

  componentWillUnmount(){
    const { updateFullScreen } = this.props;
    updateFullScreen(false);
  }

  _callbakOrderInfo = obj => {
    if (obj.prop === 'price') {
      if(obj.type === dir.buy){
        this.setState({ buyClickPrice: obj.Price },() => {
          this.setState({ buyClickPrice: ''})
        });
      }
      else if(obj.type === dir.sell){
        this.setState({ sellClickPrice: obj.Price }, () => {
          this.setState({ sellClickPrice: ''})
        });
      }
      else{
        this.setState({ buyClickPrice: obj.Price, sellClickPrice:obj.Price },() => {
          this.setState({ buyClickPrice: '', sellClickPrice: ''})
        });
      }
    }
    if (obj.prop === 'size') {
      this.setState({ clickAmount: obj.Size, buyClickPrice: obj.Price, sellClickPrice:obj.Price },() => {
        this.setState({ buyClickPrice: '', sellClickPrice: ''})
      });
    }
  };
  _getNowTickInfo = (ticker, market,symbolsObj) => {
    if(symbolsObj && symbolsObj[market]){
      let nowSymbol = symbolsObj[market],
      nowTicker = ticker[market];
      return {...nowSymbol,...nowTicker}
    }
  };

  _handleOrdersChange = (item) => {
    this.setState({ chose: item })
  }
  toggleFullScreen = () => {
    const { kFullScreen, updateFullScreen } = this.props;
    updateFullScreen(!kFullScreen);
  }
  render() {
    const {
      market,
      balanceInfos,
      isLogin,
      locale,
      orders,
      tradeHistory,
      getQuoteRequest,
      ticker,
      cancelOrder,
      cancelAllOrders,
      acSymbolsObj,
      _showProductIntroduction,
      accountInfos,
      exchangeType,
      positionInfos,
      currencyInfos,
      kFullScreen
    } = this.props;
    const { buyClickPrice, sellClickPrice, clickAmount, replaceValue, nowTicker={},chose,optType, positions } = this.state;
    const symbolType = exchangeType === account_type.accountTypeTd ? symbol_type.td : symbol_type.ex;
    const marketInfo =(acSymbolsObj && acSymbolsObj[symbolType] && acSymbolsObj[symbolType][market]) || {};
    const bInfo = balanceInfos[exchangeType];
    const acc = accountInfos.filter(item => item.type === exchangeType)[0] || {};
    var sysName =  nowTicker.name; 
    const titleText =sysName ? `${nowTicker.price||''} ${sysName}`: '--';
    const isDown = nowTicker.change_amount;
    const color = !Number(isDown)
      ? textColor
      : isDown > 0
        ? buyColor
        : sellColor;
    const title = (
      chose=== 'pending_orders' ? <span className={styles.placeOrderLink}>
        <Link to={`/ac/orderManage/${exchangeType}`}>
          <FormattedMessage id="more" />
        </Link>
      </span> :''
    );
    let recArr = ['pending_orders'];
    if(exchangeType === account_type.accountTypeTd){
      recArr.push('positon_orders')
    }
    let tradeDatas = [];
    if(market === (tradeHistory.symbolid || 0)){
      tradeDatas = tradeHistory.infos || [];
    }
    return (
      <DocumentTitle title={titleText}>
        <IntlProvider locale={locale} messages={messages[locale]}>
          <div className={classnames(styles.trading, kFullScreen ? styles.fullScreen : '')}>
            <div className={styles.trading_header} style={{display:kFullScreen ? 'none' : 'flex'}}>
              <div className={styles.trading_header_item}>
                <span className={styles.pair}>
                  <FormattedMessage id="now_product" />
                  <DropDown
                    value={sysName ? sysName :'--'}
                  >
                    {acSymbolsObj && (
                      <Market
                        market={market}
                        ticker={ticker}
                        marketList={acSymbolsObj[symbolType]}
                        sortArr={this.props.symbolsObj[symbolType]}
                        getQuoteRequest={getQuoteRequest}
                      />
                    )}
                  </DropDown>
                </span>
              </div>
              <div className={styles.trading_header_item}>
                <FormattedMessage id="last_price" />
                <span>{nowTicker.price || '--'}</span>
              </div>
              <div className={styles.trading_header_item}>
                <FormattedMessage id="24h_change" />
                <span>
                  <span style={{ marginRight: '10px' }}>
                    {nowTicker.change_amount || '--'}
                  </span>
                  <span style={{ color }}>
                    {isDown > 0 ? '+' : ''}
                    {nowTicker.change_percent || '--'}
                  </span>
                </span>
              </div>
              <div className={styles.trading_header_item}>
                <FormattedMessage id="24h_highest" />
                <span>{nowTicker.high || '--'}</span>
              </div>
              <div className={styles.trading_header_item}>
                <FormattedMessage id="24h_lowest" />
                <span>{nowTicker.low || '--'}</span>
              </div>
              <div className={styles.trading_header_item}>
                <FormattedMessage id="24h_volume" />
                <span>
                  {nowTicker.volume || '--'}&nbsp;
                  <span style={{ fontSize: '12px' }}>
                    { nowTicker.currency_quantity }
                  </span>
                </span>
              </div>
              <div
                className={styles.trading_header_introduction}
                onClick={() => _showProductIntroduction(marketInfo)}
              >
                <FormattedMessage id="product_property" />
                <img src={questionSm} />
              </div>
            </div>
            <div className={classnames(styles.trading_content,kFullScreen ? styles.fullScreen : '')}>
              <section className={classnames(styles.middle,kFullScreen ? styles.fullWidth : '')}>
                <Chart market={market} symbolName={nowTicker.name} locale={locale} kFullScreen={kFullScreen} toggleFullScreen={this.toggleFullScreen}/>
                <div style={{display:kFullScreen ? 'none' : 'block'}}>
                  <SwitchBar
                    style={{
                      padding: '0 20px',
                      backgroundColor: contentBg,
                    }}
                    chose={chose}
                    arr={recArr}
                    title={title}
                    activeTabColor={textColor}
                    onClick={item => this._handleOrdersChange(item)}
                  />
                  {isLogin ? (
                    chose==='pending_orders' ? <TradingOrder
                      market={market}
                      symbolInfo={marketInfo}
                      cancelOrder={cancelOrder}
                      cancelAllOrders={cancelAllOrders}
                      orders={orders}
                      replaceOrder={value =>
                        this.setState({ replaceValue: value })
                      }
                      accountInfo={acc}
                    /> :<PositionOrder ticker={ticker} positions={positions} symbolsObj={acSymbolsObj[symbolType]}/>
                  ) : (
                    <div className={styles.trading_order_nodata}>
                      <img src={nodata} />
                      <FormattedMessage
                        id="recent_trade_nodata"
                        values={{
                          login: (
                            <Link
                              to="/login"
                              className={styles.trading_order_nodata_a}
                            >
                              <FormattedMessage id="recent_trade_nodata_login" />
                            </Link>
                          ),
                          register: (
                            <Link
                              to="/register"
                              className={styles.trading_order_nodata_a}
                            >
                              <FormattedMessage id="recent_trade_nodata_register" />
                            </Link>
                          ),
                        }}
                      />
                    </div>
                  )}
                </div>
              </section>

              <section className={styles.right} style={{display:kFullScreen ? 'none' : 'block'}}>
                <div className={styles.right_top}>
                  <OrderBook
                    callbackOrderInfo={this._callbakOrderInfo}
                    market={market}
                    nowTicker={nowTicker}
                  />
                  <div style={{ marginLeft: '3px' }}>
                    <SwitchBar
                      style={{
                        padding: '0 20px',
                        backgroundColor: contentBg,
                      }}
                      arr={['record']}
                      chose={'record'}
                      activeTabColor={textColor}
                    />
                    <History
                      currency_quantity={nowTicker.currency_quantity}
                      currency_price={nowTicker.currency_price}
                      data={tradeDatas}
                    />
                  </div>
                </div>

                {exchangeType === account_type.accountTypeTd ?<PlaceOrderTd
                  isLogin={isLogin}
                  market={market}
                  balanceInfo={bInfo}
                  accounInfo={acc}
                  buyClickPrice={buyClickPrice}
                  sellClickPrice={sellClickPrice}
                  clickAmount={clickAmount}
                  replaceValue={replaceValue}
                  cancelReplaceOrder={() =>
                    this.setState({ replaceValue: null })
                  }
                  nowTicker={nowTicker}
                  symbolInfo={marketInfo}
                  exchangeType={exchangeType}
                  positions={positions}     
                  optType={optType}   
                  currencyInfos={currencyInfos}    
                  ticker={ticker}
                  positionInfos={positionInfos}
                /> : <PlaceOrderEx
                isLogin={isLogin}
                market={market}
                balanceInfo={bInfo}
                accounInfo={acc}
                buyClickPrice={buyClickPrice}
                sellClickPrice={sellClickPrice}
                clickAmount={clickAmount}
                replaceValue={replaceValue}
                cancelReplaceOrder={() =>
                  this.setState({ replaceValue: null })
                }
                nowTicker={nowTicker}
                symbolInfo={marketInfo}
                exchangeType={exchangeType}
                currencyInfos={currencyInfos}
              />}
              </section>
            </div>
          </div>
        </IntlProvider>
      </DocumentTitle>
    );
  }
}
export default  TokenTrading