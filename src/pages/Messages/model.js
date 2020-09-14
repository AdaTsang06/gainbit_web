import { ret } from '@/common/constants';
import { queryMessages, setMessagesRead } from '../../services/user'
import { createSignatureRequest } from '../../utils/util';
export default {
  namespace: 'Messages',
  state: {
     messagesRecs:{
       data: [],
       count: 0
     },
     noticeRecs:{
      data: [],
      count: 0
    },
  },

  subscriptions: {
    setup({ dispatch, history}) {  // eslint-disable-line 
     
    }
  },

  effects: {
    *getMessages({payload},{call,put,select}){
        yield put({type:'Loading/startFetchLoading'})
        const request = createSignatureRequest(payload);
        const res = yield call(queryMessages,request);   
        yield put({type:'Loading/stopFetchLoading'});
        if(res.ret === ret.ok){
          yield put({type:'updateState',payload:{messagesRecs:{data:res.infos,count:0},barType:'order_history'}});
        }
        else{
          yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
        }
    },
    *setRead({payload},{call,put,select}){
      yield put({type:'Loading/startFetchLoading'})
      const request = createSignatureRequest(payload);
      const res = yield call(setMessagesRead,request);   
      yield put({type:'Loading/stopFetchLoading'});
      if(res.ret === ret.ok){
        return true;
      }
      else{
        yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
        return false;
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
