
import { placeOrder, queryPlaced, cancelOrder, closeOrder } from '../../services/user';
import { createSignatureRequest } from '../../utils/util';
import { getLocalStore, setLocalStore } from '../../utils/storage';
import { ret } from '../../common/constants';
export default {
  namespace: 'trading',
  state: {
    orders:[],
    userSymScale:getLocalStore('userSymScale') || {}//{用户id:{产品id:倍数}}
  },

  subscriptions: {
    setup({ dispatch, history}) {  // eslint-disable-line
    }
  },

  effects: {
    *placeOrder({payload},{call,put,select}){
        yield put({type:'Loading/startSubmitLoading'})
        const request = createSignatureRequest(payload);
        const res = yield call(placeOrder,request);
        yield put({type:'Loading/stopSubmithLoading'})
        if(res.ret === ret.ok){
          yield put({type:'global/showSuccessMessage',payload:'place_order_success'});
        }
        else{
          yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
        }
    },
    *closeOrder({payload},{call,put,select}){
      yield put({type:'Loading/startSubmitLoading'})
      const request = createSignatureRequest(payload);
      const res = yield call(closeOrder,request);
      yield put({type:'Loading/stopSubmithLoading'})
      if(res.ret === ret.ok){
        yield put({type:'global/showSuccessMessage',payload:'place_order_success'});
      }
      else{
        yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
      }
  },
    *getOrdersBySymbol({payload},{call,put,select}){
        yield put({type:'Loading/startFetchLoading'});
        const request = createSignatureRequest(payload);
        const res = yield call(queryPlaced,request);
        yield put({type:'Loading/stopFetchLoading'});
        if(res.ret === ret.ok){
          yield put({type:'updateState',payload:{orders:res.infos || []}})
        }
        else{
          yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
        }
    },
    *addOrder({payload},{call,put,select}){
      if(!payload) return;
      let state =  yield select(state => {
        return state;
      });
      let market = state.ws.market;
      if(payload.symbolid === market){
          let orders = (state.trading && state.trading.orders) || [];
          yield put({type:'updateState',payload:{orders:[payload,...orders]}});
      }
    },
    *updateOrder({payload},{call,put,select}){
      if(!payload) return;
      let state =  yield select(state => {
        return state;
      });
      let market = state.ws.market;
      if(payload.symbolid === market){
        let orders = (state.trading && state.trading.orders) || [];
        let flag = false;
        for(let i = 0; i < orders.length; i++){
          if(orders[i].id === payload.id){
            if(orders[i].uuid < payload.uuid){
              orders[i] = payload;
              flag = true;
            }        
           break;
          }
       }
       if(flag){
        yield put({type:'updateState',payload:{orders:[...orders]}});
       }
    }
   },
  *cancelOrder({payload,callBack},{call,put,select}){
    yield put({type:'Loading/startSubmitLoading'})
    const request = createSignatureRequest(payload);
    const res = yield call(cancelOrder,request);
    yield put({type:'Loading/stopSubmithLoading'});
    if(res.ret === ret.ok){
      if(callBack){
        callBack();
      }
      yield put({type:'global/showSuccessMessage',payload:'cancle_order_success'});

    }
    else{
      yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
    }
  },
  *removeOrder({orderid},{call,put,select}){
    let orders = yield select(state => {
      return state.trading.orders;
    });
    if(orders){
      let flag = false;
      for(let i = 0; i < orders.length; i++){
          if(orders[i].id === orderid){
          orders.splice(i,1);
          flag = true;
          break;
          }
      }
      if(flag){
        yield put({type:'updateState',payload:{orders:[...orders]}});
      }
    }
  },
  *updateSymScale({payload},{call,put,select}){
      let userSymScale = yield select(state => {
        return state.trading.userSymScale;
      });
      if(payload && payload.userId){
        let obj = {},nUserSymScale = { ...userSymScale};
        if(nUserSymScale[payload.userId]){
          obj = {...nUserSymScale[payload.userId]};
        }
        obj[payload.symbolid] = payload.scale;
        nUserSymScale[payload.userId] = obj;
        setLocalStore('userSymScale',nUserSymScale)
        yield put({type:'updateState',payload:{userSymScale:nUserSymScale}});
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
