
import {wsUrl} from '../common/env';
import { getSymTypeObj } from '../utils/util';
import { wsLoginReq, wsheartResp } from '../utils/ws';
import { setSessionStore, getSessionStore, setLocalStore,getLocalStore } from '../utils/storage';

let socket = null;
const interval = 30000;
let timer = null;
let storeDispatch = null;
let closeTimer = null;

const onError = (ws, store) => () => {
    console.log('Error: ', ws);
    const { dispatch } = store;
    store.dispatch({type:'updateState',payload:{conectWS:false}})
    setTimeout(() => {
      if(!(socket && socket.readyState === 1)){
        dispatch({ type: 'wsConnect' });
      }
    }, 5000);
  };

const onClose = (ws,store) => () => {
  console.log('ws close')
  const { dispatch } = store;
  if(closeTimer){
    clearTimeout(closeTimer);
  }
  closeTimer = setTimeout(() => {
    if(!(socket && socket.readyState === 1)){
      dispatch({ type: 'wsConnect' });
    }
  }, 30000);
};
  
const onOpen = (ws, store) => () => {
    if (ws && ws.readyState === 1) {
      store.dispatch({type:'updateState',payload:{conectWS:true}})
      if(getSessionStore('token')){
        store.dispatch({type:'Account/loginRequest',payload:{token: getSessionStore('token')}});
      }
      store.dispatch({type:'changeQuoteRequest', payload:getLocalStore('market')});
    } else {
      onError(ws, store)();
    }
};

const onMessage = (ws,store) => evt=>{
    const msg = JSON.parse(evt.data);
    const { dispatch} = store;    
    switch(msg.action){
        case 'ws_login_rsp':{
            if(msg.ret){
              dispatch({type:'global/showErrorMessage',payload:{ret:msg.ret}})
            }
            break;
        }
        case 'ws_heartbeat_req':{
            ws.send(wsheartResp())
            if (timer) {
                clearTimeout(timer);
              }
              timer = setTimeout(() => {
                if(!(socket && socket.readyState === 1)){
                  dispatch({ type: 'wsConnect'});
                }
              }, interval);
            break;
        }
        case 'ws_tick_push':{// 行情
          dispatch({type:'echoTicker',payload:msg.infos});
          break;
        } 
        case 'ws_sub_orderbook_rsp':{//订阅回应
          break;
        } 
        case 'ws_unsub_orderbook_rsp':{//取消订阅回应
          break;
        } 
        case 'ws_orderbook_push':{// orderbook，前10条
          dispatch({type:'fullOrderBook',payload:msg})
          break;
        } 
        case 'ws_deal_push':{// 成交记录
          dispatch({type:'getTradesResponse',payload:{symbolid:msg.symbolid,infos:msg.infos || []}})
          break;
        } 
        case 'ws_balance_update':{// 资产变化通知
          dispatch({type:'changeBalanceInfos',payload:msg.info})
          break;
        }
        case 'ws_order_add':{// 下单通知
          dispatch({type:'trading/addOrder',payload:msg.info});
          break;
        }
        case 'ws_order_update':{// 订单更新通知
          dispatch({type:'trading/updateOrder',payload:msg.info});
          break;
        }
        case 'ws_order_cancel':{// 取消订单通知
          dispatch({type:'trading/removeOrder',orderid:msg.orderid});
          break;
        }
        case 'ws_deal_add':{                  
          break;
        }
        case 'ws_position_update':{// 更新仓位通知 
          dispatch({type:'Account/updatePosition',payload:msg.info});
          break;
        }
        case 'ws_deal_add':{                  
          break;
        }
        default:{}
    }
}
  
export default {
  namespace: 'ws',
  state: {
    conectWS:false,
    ticker: {}, //产品行情 eg.{产品id:{}}
    symPairPriceObj:getSymTypeObj(),//按产品类型存放的产品价 eg.{产品类型:{currency_quantity/currency_price:{}}}
    market:getLocalStore('market') || 1,//订阅的产品
    orderBook: {
      symbolid:0,
      1: [],
      2: [],
    },//委托队列
    tradeHistory: {},//成交记录
  },

  subscriptions: {
    setup({ dispatch, history}) {  // eslint-disable-line
      storeDispatch = dispatch;
    }
  },

  effects: {
    *wsConnect({ payload }, { select, call, put }){
        let store = {dispatch: storeDispatch};
        if (socket != null) {
            socket.close();
            socket = null;
        }
        try {
            socket = new WebSocket(wsUrl);
        } catch (e) {
          onError(socket, store)();
        }
        if(socket){
          socket.onmessage = onMessage(socket, store);
          socket.onerror = onError(socket, store);
          socket.onopen = onOpen(socket, store);
          socket.onclose = onClose(socket, store);
        }
    },
    *wsLogin({ payload }, { select, call, put }){
      if(socket && socket.readyState === 1){
        if(getSessionStore('userInfo')){
          socket.send(wsLoginReq());
        }
      }
      else{
        //yield put({ type: 'wsConnect'});
      }
    },
    *wsClose({ payload }, { select, call, put }){
      if (socket != null) {
          socket.close();
          socket = null;
        }
      if (timer) {
        clearTimeout(timer);
      }
      if(closeTimer){
        clearTimeout(closeTimer);
      }
    },
    *echoTicker({ payload }, { select, call, put }){
      if(payload && payload.length){
        const state = yield select(state =>{
          return state;
        });
        const symbolsObj = {};
        const acSymbolsObj = state.global.acSymbolsObj;
        if(acSymbolsObj){
          Object.keys(acSymbolsObj).map(key => {
            if(acSymbolsObj[key]){
              Object.assign(symbolsObj,acSymbolsObj[key]);
            }
          })
        }
        let ticker = {...state.ws.ticker},symPairPriceObj={},tObj,sObj;
        Object.keys(state.ws.symPairPriceObj).map(key => {
          symPairPriceObj[key] = {...state.ws.symPairPriceObj[key]}
        })
        for(let i = 0;i < payload.length; i++){
          tObj = payload[i] || {};
          ticker[tObj.symbolid] = tObj;//按产品id存取
          sObj = symbolsObj[tObj.symbolid] || {};
          symPairPriceObj[sObj.type][`${sObj.currency_quantity}/${sObj.currency_price}`] = tObj.price;//按产品类型存放的产品价
        }
        //console.log(ticker,symPairPriceObj)
        yield put({type:'updateState',payload:{ticker,symPairPriceObj}});
      }
    },
    *changeQuoteRequest({ payload }, { select, call, put }){
      yield put({type:'updateState',payload:{market:payload}});
      setLocalStore('market', payload);
      if(socket && socket.readyState === 1){
          let obj = {action:'ws_sub_orderbook_req',symbolid:payload,num_of_deal:50};
          socket.send(JSON.stringify(obj));
      }
      else{
        yield put({ type: 'wsConnect'});
      }
    },
    *fullOrderBook({ payload }, { select, call, put }){
      let orderBook = {};
      orderBook.symbolid = payload.symbolid;
      orderBook[1] = payload.buys || [];
      orderBook[2] = payload.sells || [];
      yield put({type:'updateState',payload:{orderBook}});
    },
    *getTradesResponse({ payload }, { put }){
        yield put({type:'updateState',payload:{tradeHistory:payload || {}}});
    },
    *changeBalanceInfos({ payload }, { select, call, put }){
       const accountModel = yield select(state =>{
         return state.Account;
       }),accountInfos = accountModel.accountInfos;
       let balanceInfos = {...accountModel.balanceInfos}, type = 0;
       for(let i = 0; i < accountInfos.length;i++){
         if(payload.accountid === accountInfos[i].id){
            type = accountInfos[i].type;
            break;
         }
       }       
       let currentBalances = {};
       if(balanceInfos[type]){
         currentBalances = {...balanceInfos[type]};
       }
       let obj = currentBalances[payload.name];
       if(!obj || obj.uuid < payload.uuid){
       currentBalances[payload.name] = payload;
       balanceInfos[type] = currentBalances;
       yield put({type:'Account/updateState', payload:{balanceInfos}});
       setSessionStore('balanceInfos',balanceInfos);
      }
    }
    
  },

  reducers: {
    updateState(state, action) {
      return {
        ...state, 
        ...action.payload
      }
    }
  }

};
