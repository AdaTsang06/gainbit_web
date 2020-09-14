import { ret } from '@/common/constants';
import { queryDeliverSummary, deliver, queryDeliver, cancelDeliver, queryDeliverDeal, queryDeferFee } from '../../../services/delivery'; 
import { createSignatureRequest } from '../../../utils/util';
import { deliver_status } from '../../../common/constant-enum';

export default {
    namespace: 'deliverDeclare',
    state: {
       settleHistory:{
         data: [],
         count: 0
       },
       weituoHistory:{
        data: [],
        count: 0
       },
       dealHistory:{
        data: [],
        count: 0
       },
       diyanFeeHistory:{
        data: [],
        count: 0
       },
    },
  
    subscriptions: {
      setup({ dispatch, history}) {  // eslint-disable-line 
       
      }
    },
  
    effects: {
      *queryDeliverSummary({payload},{call,put,select}){
          yield put({type:'Loading/startFetchLoading'})
          const request = createSignatureRequest(payload);
          const res = yield call(queryDeliverSummary,request);   
          yield put({type:'Loading/stopFetchLoading'});
          if(res.ret === ret.ok){
            yield put({type:'updateState',payload:{settleHistory:{data:res.infos,count:0}}});
          }
          else{
            yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
          }
      },
      *createDeliver({payload},{call,put,select}){
        yield put({type:'Loading/startSubmitLoading'})
        const request = createSignatureRequest(payload);
        const res = yield call(deliver,request);   
        yield put({type:'Loading/stopSubmithLoading'});
        if(res.ret === ret.ok){
          yield put({type:'queryDeliverSummary'});
          return true;
        }
        else{
          yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
        }
      },
      *queryDeliver({payload},{call,put,select}){
        yield put({type:'Loading/startFetchLoading'})
        const request = createSignatureRequest(payload);
        const res = yield call(queryDeliver,request);   
        yield put({type:'Loading/stopFetchLoading'});
        if(res.ret === ret.ok){
          yield put({type:'updateState',payload:{weituoHistory:{data:res.infos,count:0}}});
        }
        else{
          yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
        }
    },
    *cancelOrder({payload},{call,put,select}){
      const request = createSignatureRequest(payload);
      const res = yield call(cancelDeliver,request);
      if(res.ret === ret.ok){
        const weituoHistory = yield select((state =>{
          return state.deliverDeclare.weituoHistory;
        }));
        if(weituoHistory){
          let data = weituoHistory.data || [];
          for(let i =0 ; i < data.length; i++){
            if(payload.deliverid === data[i].id){
              data[i].status = deliver_status.deliver_cancel;
              break;
            }
          }
          yield put({type:'updateState',payload:{weituoHistory:{data:[...data],count:0}}});
        }
      }
      else{
        yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
      }
    },
    *queryDeliverDeal({payload},{call,put,select}){
      yield put({type:'Loading/startFetchLoading'})
      const request = createSignatureRequest(payload);
      const res = yield call(queryDeliverDeal,request);   
      yield put({type:'Loading/stopFetchLoading'});
      if(res.ret === ret.ok){
        yield put({type:'updateState',payload:{dealHistory:{data:res.infos,count:0}}});
      }
      else{
        yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
      }
  },
  *queryDiYanFee({payload},{call,put,select}){
      yield put({type:'Loading/startFetchLoading'})
      const request = createSignatureRequest(payload);
      const res = yield call(queryDeferFee,request);   
      yield put({type:'Loading/stopFetchLoading'});
      if(res.ret === ret.ok){
        yield put({type:'updateState',payload:{diyanFeeHistory:{data:res.infos,count:0}}});
      }
      else{
        yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
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
  