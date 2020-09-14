
import { createSignatureRequest } from '../../utils/util';
import { ret } from '../../common/constants';
import { feedback } from '../../services/user';

export default {
  namespace: 'Retroaction',
  state: {
  },

  subscriptions: {
    setup({ dispatch, history}) {  // eslint-disable-line
    }
  },

  effects: {
    *submitRetroaction({payload},{ call, put }){
        yield put({type:'Loading/startSubmitLoading'});
        const request = createSignatureRequest(payload);
        const res = yield call(feedback,request);
        yield put({type:'Loading/stopSubmithLoading'})
        if(res.ret === ret.ok){
          yield put({type:'global/showSuccessMessage',payload:'submit_success'});
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
