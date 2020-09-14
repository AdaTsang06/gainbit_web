import { ret } from '@/common/constants';
import { transfer, lock } from '../../services/user';
import { queryBalanceLog, queryTransferLog, queryDepositHistory, queryWithdrawHistory, queryLockLog } from '../../services/history'; 
import { getDepositAddress, withdraw, getWithdrawAddress, getWithdrawMax } from '../../services/balance';
import { createSignatureRequest } from '../../utils/util';
import { getSessionStore, setSessionStore } from '../../utils/storage';
import { asset_status } from '../../common/constant-enum'
const time = 3000;;
export default {
  namespace: 'AcCenter',
  state: {
     financeHistory:{
       data: [],
       count: 0
     },
     depositHistory:{
      data: [],
      count: 0
    },
    withdrawHistory:{
      data: [],
      count: 0
    },
    transferHistory:{
      data: [],
      count: 0
    },
    lockHistory:{
      data: [],
      count: 0
    },
    depositAddress:'',
    withdrawAddress:[],
    warningLevel:0,
    forceCloseLevel:0,
    riskInfo:0,
    showAsset:getSessionStore('showAsset') || asset_status.show,
    dayWithdrawMax:0
  },

  subscriptions: {
    setup({ dispatch, history}) {  // eslint-disable-line 
     
    }
  },

  effects: {
    *getFinancialHistory({payload},{call,put}){
        yield put({type:'Loading/startFetchLoading'})
        const request = createSignatureRequest(payload);
        const res = yield call(queryBalanceLog,request);   
        yield put({type:'Loading/stopFetchLoading'});
        if(res.ret === ret.ok){
          yield put({type:'updateState',payload:{financeHistory:{data:res.infos,count:0}}});
        }
        else{
          yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
        }
    },
    *getDepositHistory({payload},{call,put}){
      yield put({type:'Loading/startFetchLoading'})
      const request = createSignatureRequest(payload);
      const res = yield call(queryDepositHistory,request);   
      yield put({type:'Loading/stopFetchLoading'});
      if(res.ret === ret.ok){
        yield put({type:'updateState',payload:{depositHistory:{data:res.infos,count:0}}});
      }
      else{
        yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
      }
    },
    *getWithdrawHistory({payload},{call,put}){
      yield put({type:'Loading/startFetchLoading'})
      const request = createSignatureRequest(payload);
      const res = yield call(queryWithdrawHistory,request);   
      yield put({type:'Loading/stopFetchLoading'});
      if(res.ret === ret.ok){
        yield put({type:'updateState',payload:{withdrawHistory:{data:res.infos,count:0}}});
      }
      else{
        yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
      }
    },
    *getTransferHistory({payload},{call,put}){
      yield put({type:'Loading/startFetchLoading'})
      const request = createSignatureRequest(payload);
      const res = yield call(queryTransferLog,request);   
      yield put({type:'Loading/stopFetchLoading'});
      if(res.ret === ret.ok){
        yield put({type:'updateState',payload:{transferHistory:{data:res.infos,count:0}}});
      }
      else{
        yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
      }
    },
    *getLockHistory({payload},{call,put}){
      yield put({type:'Loading/startFetchLoading'})
      const request = createSignatureRequest(payload);
      const res = yield call(queryLockLog,request);   
      yield put({type:'Loading/stopFetchLoading'});
      if(res.ret === ret.ok){
        yield put({type:'updateState',payload:{lockHistory:{data:res.infos,count:0}}});
      }
      else{
        yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
      }
    },
    *getDepositAddress({payload},{call,put}){
      yield put({type:'Loading/startFetchLoading'});
      const request = createSignatureRequest(payload);
      const res = yield call(getDepositAddress,request);   
      yield put({type:'Loading/stopFetchLoading'});
       if(res.ret === ret.ok){
        yield put({type:'updateState',payload:{depositAddress: res.address || ''}});
      }
      else{
        yield put({type:'updateState',payload:{depositAddress: ''}});
        yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
      }
    },
    *getWithdrawAddress({payload},{call,put}){
      yield put({type:'Loading/startFetchLoading'});
      const request = createSignatureRequest(payload);
      const res = yield call(getWithdrawAddress,request);   
      yield put({type:'Loading/stopFetchLoading'});
       if(res.ret === ret.ok){
        yield put({type:'updateState',payload:{withdrawAddress: res.infos || []}});
      }
      else{
        yield put({type:'updateState',payload:{withdrawAddress: ''}});
        yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
      }
    },
    *createWithdraw({payload},{call,put}){
      yield put({type:'Loading/startSubmitLoading'});
      const request = createSignatureRequest(payload);
      const res = yield call(withdraw,request);
      yield put({type:'Loading/stopSubmithLoading'})
      if(res.ret === ret.ok){
        return true;
      }
      else{
        yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
        return false;
      }
    },
    *createTransfer({payload},{call,put}){
      yield put({type:'Loading/startSubmitLoading'});
      const request = createSignatureRequest(payload);
      const res = yield call(transfer,request);
      yield put({type:'Loading/stopSubmithLoading'})
      if(res.ret === ret.ok){
        return true;
      }
      else{
        yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
        return false;
      }
     },
     *createLock({payload},{call,put}){
      yield put({type:'Loading/startSubmitLoading'});
      const request = createSignatureRequest(payload);
      const res = yield call(lock,request);
      yield put({type:'Loading/stopSubmithLoading'})
      if(res.ret === ret.ok){
        yield put({type:"Account/updateVipLevel",payload:res.vip_level})
        return true;
      }
      else{
        yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
        return false;
      }
     },
     *createUnLock({payload},{call,put}){
      yield put({type:'Loading/startSubmitLoading'});
      const request = createSignatureRequest(payload);
      const res = yield call(lock,request);
      yield put({type:'Loading/stopSubmithLoading'})
      if(res.ret === ret.ok){
        return true;
      }
      else{
        yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
        return false;
      }
     },
     *toggleShowAsset ({payload},{put}){
        yield put({ type: 'AcCenter/updateState', payload: { showAsset: payload } });
        setSessionStore('showAsset',payload);
     },
     *getWidthdrawMax({payload},{call,put}){//当时最大可提
      yield put({type:'Loading/startFetchLoading'});
      const request = createSignatureRequest(payload);
      const res = yield call(getWithdrawMax,request);   
      yield put({type:'Loading/stopFetchLoading'});
       if(res.ret === ret.ok){
        yield put({type:'updateState',payload:{dayWithdrawMax: res.amount || 0}});
      }
      else{
        yield put({type:'updateState',payload:{dayWithdrawMax: 0}});
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
