import { queryKycIdInfo, submitKycIdInfo, queryRiskAssessment, submitRiskAssessment,
         queryIdPhoto, submitIdPhoto,downloadPhto,queryKycRandPhoto,submitKycRandPhoto } from '../../../services/user';
import { ret } from '@/common/constants';
import { createSignatureRequest } from '../../../utils/util';
export default {
  namespace: 'KYC',
  state: {
    kycIdInfo: {},
    riskAssessment: {},
    kycIdPhoto:{},
    headPhoto:'',
    backPhoto:'',
    addressPhoto:'',
    randNumber:'',
    randNumberTime: 0,
    handPhoto:''
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line 
    }
  },

  effects: {
    *queryLevelStep1({ payload = {} }, { call, put, select }) {
      const request = createSignatureRequest(payload);
      const res = yield call(queryKycIdInfo, request);
      if (res.ret === ret.ok) {
        yield put({ type: 'updateState', payload: { kycIdInfo: res.info || {} } });
      }
      else {
        yield put({ type: 'global/showErrorMessage', payload: { ret: res.ret, msg: res.msg } });
      }
    },
    *submitLevelStep1({ payload }, { call, put, select }) {
      yield put({ type: 'Loading/startSubmitLoading' });
      const request = createSignatureRequest(payload);
      const res = yield call(submitKycIdInfo, request);
      yield put({ type: 'Loading/stopSubmithLoading' });
      if (res.ret === ret.ok) {
        yield put(require('dva').routerRedux.push('/ac/user-setting/kyc/personal/2'));
      }
      else {
        yield put({ type: 'global/showErrorMessage', payload: { ret: res.ret, msg: res.msg } });
      }
    },
    *queryLevelStep2({ payload = {} }, { call, put, select }) {
      const request = createSignatureRequest(payload);
      const res = yield call(queryRiskAssessment, request);
      if (res.ret === ret.ok) {
        yield put({ type: 'updateState', payload: { riskAssessment: res.info || {} } });
      }
      else {
        yield put({ type: 'global/showErrorMessage', payload: { ret: res.ret, msg: res.msg } });
      }
    },
    *submitLevelStep2({ payload }, { call, put, select }) {
      yield put({ type: 'Loading/startSubmitLoading' });
      const request = createSignatureRequest(payload);
      const res = yield call(submitRiskAssessment, request);
      yield put({ type: 'Loading/stopSubmithLoading' });
      if (res.ret === ret.ok) {
        yield put(require('dva').routerRedux.push('/ac/user-setting/kyc/personal/3'));
      }
      else {
        yield put({ type: 'global/showErrorMessage', payload: { ret: res.ret, msg: res.msg } });
      }
    },
    *queryLevelStep3({ payload = {} }, { call, put, select }) {
      const request = createSignatureRequest(payload);
      const res = yield call(queryIdPhoto, request);
      if (res.ret === ret.ok) {
        const info = res.info || {};
        yield put({ type: 'updateState', payload: { kycIdPhoto: info } });
        if(info.head_image_id){
          yield put({ type: 'queryDowloadImg', payload: { imageid: info.head_image_id, prop:"headPhoto" } });
        }
        if(info.back_image_id){
          yield put({ type: 'queryDowloadImg', payload: { imageid: info.back_image_id, prop:"backPhoto" } });
        }
        if(info.address_image_id ){
          yield put({ type: 'queryDowloadImg', payload: { imageid: info.address_image_id , prop:"addressPhoto" } });
        }
      }
      else {
        yield put({ type: 'global/showErrorMessage', payload: { ret: res.ret, msg: res.msg } });
      }
    },
    *queryDowloadImg({ payload = {} }, { call, put, select }) {
      const request = createSignatureRequest({imageid: payload.imageid});
      const res = yield call(downloadPhto, request);
      if (res.ret === ret.ok) {
        yield put({ type: 'updateState', payload: { [payload.prop]: res.photo || '' } });
      }
      else {
        yield put({ type: 'global/showErrorMessage', payload: { ret: res.ret, msg: res.msg } });
      }
    },
    *submitLevelStep3({ payload }, { call, put, select }) {
      yield put({ type: 'Loading/startSubmitLoading' });
      const request = createSignatureRequest(payload);
      const res = yield call(submitIdPhoto, request);
      yield put({ type: 'Loading/stopSubmithLoading' });
      if (res.ret === ret.ok) {
        yield put(require('dva').routerRedux.push('/ac/user-setting/kyc/personal/4'));
      }
      else {
        yield put({ type: 'global/showErrorMessage', payload: { ret: res.ret, msg: res.msg } });
      }
    },
    *queryLevelStep4({ payload = {} }, { call, put, select }) {
      const request = createSignatureRequest(payload);
      const res = yield call(queryKycRandPhoto, request);
      if (res.ret === ret.ok) {
        yield put({ type: 'updateState', payload: { randNumber: res.rand_number  || '', randNumberTime: res.timestamp || 0} });
        if(res.imageid){
          yield put({ type: 'queryDowloadImg', payload: { imageid: res.imageid , prop:"handPhoto" } });
        }
      }
      else {
        yield put({ type: 'global/showErrorMessage', payload: { ret: res.ret, msg: res.msg } });
      }
    },
    *submitLevelStep4({ payload }, { call, put, select }) {
      yield put({ type: 'Loading/startSubmitLoading' });
      const request = createSignatureRequest(payload);
      const res = yield call(submitKycRandPhoto, request);
      yield put({ type: 'Loading/stopSubmithLoading' });
      if (res.ret === ret.ok) {
        yield put({ type: 'global/showSuccessMessage', payload: 'kyc_submit_success' });
        yield put(require('dva').routerRedux.push('/ac/user-setting/security-setting'));
      }
      else {
        yield put({ type: 'global/showErrorMessage', payload: { ret: res.ret, msg: res.msg } });
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
