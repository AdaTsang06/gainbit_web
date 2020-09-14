import { ret } from '@/common/constants';
import { queryPlaced, queryHistorical, queryDealByOrder, queryDeal} from '../../services/history'; 
import { cancelOrder } from '../../services/user';
import { createSignatureRequest } from '../../utils/util';
const time = 3000;;
export default {
  namespace: 'orderManage',
  state: {
     orders:{
       data: [],
       count: 0
     },
     orderDetail:[],
     barType:''
  },

  subscriptions: {
    setup({ dispatch, history}) {  // eslint-disable-line 
     
    }
  },

  effects: {
    *getPlaced({payload},{call,put,select}){//当前委托
        yield put({type:'Loading/startFetchLoading'})
        const request = createSignatureRequest(payload);
        const res = yield call(queryPlaced,request);   
        yield put({type:'Loading/stopFetchLoading'});
        if(res.ret === ret.ok){
          yield put({type:'updateState',payload:{orders:{data:res.infos,count:0},barType:'pending_orders'}});
        }
        else{
          yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
        }
    },
    *getHistory({payload},{call,put,select}){//历史委托
        yield put({type:'Loading/startFetchLoading'})
        const request = createSignatureRequest(payload);
        const res = yield call(queryHistorical,request);   
        yield put({type:'Loading/stopFetchLoading'});
        if(res.ret === ret.ok){
          yield put({type:'updateState',payload:{orders:{data:res.infos,count:0},barType:'order_history'}});
        }
        else{
          yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
        }
    },
    *getDeal({payload},{call,put,select}){//成交
        yield put({type:'Loading/startFetchLoading'})
        const request = createSignatureRequest(payload);
        const res = yield call(queryDeal,request);   
        yield put({type:'Loading/stopFetchLoading'});
        if(res.ret === ret.ok){
          yield put({type:'updateState',payload:{orders:{data:res.infos,count:0},barType:'deal_order',orderDetail:[]}});
        }
        else{
          yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
        }
    },
    *getOrderDeal({payload},{call,put,select}){//成交
        yield put({type:'Loading/startFetchLoading'})
        const request = createSignatureRequest(payload);
        const res = yield call(queryDealByOrder,request);   
        yield put({type:'Loading/stopFetchLoading'});
        if(res.ret === ret.ok){
          yield put({type:'updateState',payload:{orderDetail: res.infos || []}});
        }
        else{
          yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
        }
    },
    *cancelOrder({payload,callBack},{call,put,select}){
      yield put({type:'Loading/startSubmitLoading'})
      const request = createSignatureRequest(payload);
      const res = yield call(cancelOrder,request);
      yield put({type:'Loading/stopSubmithLoading'});
      if(res.ret === ret.ok){
        if(callBack){
          callBack()
        }
        yield put({type:'global/showSuccessMessage',payload:'cancle_order_success'});
  
      }
      else{
        yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
      }
    },
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
