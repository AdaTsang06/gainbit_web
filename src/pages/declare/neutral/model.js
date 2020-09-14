import { ret } from '@/common/constants';
import { queryDeliverSummary, neutral, queryNeutral, cancelNeutral, queryNeutralDeal,queryNeutralDeferFee } from '../../../services/delivery'; 
import { createSignatureRequest } from '../../../utils/util';
import { neutral_status } from '../../../common/constant-enum';
export default {
    namespace: 'neutralDeclare',
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
      *createNeutral({payload},{call,put,select}){
        yield put({type:'Loading/startSubmitLoading'})
        const request = createSignatureRequest(payload);
        const res = yield call(neutral,request);   
        yield put({type:'Loading/stopSubmithLoading'});
        if(res.ret === ret.ok){
          yield put({type:'queryDeliverSummary'});
          return true;
        }
        else{
          yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
        }
      },
      *queryNeutral({payload},{call,put,select}){
        yield put({type:'Loading/startFetchLoading'})
        const request = createSignatureRequest(payload);
        const res = yield call(queryNeutral,request);   
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
      const res = yield call(cancelNeutral,request);
      if(res.ret === ret.ok){
        const weituoHistory = yield select((state =>{
          return state.neutralDeclare.weituoHistory;
        }));
        if(weituoHistory){
          let data = weituoHistory.data || [];
          for(let i =0 ; i < data.length; i++){
            if(payload.neutralid === data[i].id){
              data[i].status = neutral_status.neutral_cancel;
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
    *queryNeutralDeal({payload},{call,put,select}){
      yield put({type:'Loading/startFetchLoading'})
      const request = createSignatureRequest(payload);
      const res = yield call(queryNeutralDeal,request);   
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
    const res = yield call(queryNeutralDeferFee,request);   
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
  