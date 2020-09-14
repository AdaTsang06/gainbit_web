
import { getSessionStore,setSessionStore,removeSessionStore } from '../utils/storage';
import {login, register, sendRegisterCaptcha, changePw, retrievePasswordCaptcha, retrievePassword,
   queryUnreadMsgCount, queryKycStatus, queryInviteInfo } from '../services/user';
import { ret } from '../common/constants';
import { position_status} from '../common/constant-enum';
import { createSignatureRequest, getAccountTypeObj } from '../utils/util'

const routerRedux = require('dva').routerRedux;
export default {
  namespace: 'Account',
  state: {
    loggedIn:getSessionStore('loggedIn') || false,
    forgotPasswordVisible: false,
    isReVerify: false,
    reVerifyEmail: null,
    forgotPasswordInfo: {},
    token:getSessionStore('token') || '',
    userInfo:getSessionStore('userInfo') || {},
    accountInfos:getSessionStore('accountInfos') || [],//账户列表
    balanceInfos:getSessionStore('balanceInfos') || getAccountTypeObj(),//账户类型资产列表 eg.{账户类型:{BTC:{}}}
    currencyInfos:getSessionStore('currencyInfos') || {},//货币列表 eg.{BTC:{},ETH:{}}
    warningLevel: 0,
    forceCloseLevel: 0,
    positionInfos: getSessionStore('positionInfos') || [],
    unreadMsgCount: 0,
    inviteCode:  getSessionStore('inviteCode') || '',
    kycStatusInfo:{},
    inviteInfo:{}
  },

  subscriptions: {
    setup({ dispatch, history}) {  // eslint-disable-line
    }
  },

  effects: {
    *loginRequest({payload},{call,put,select}){
      yield put({type:'Loading/startSubmitLoading'})
      const res = yield call(login,payload);
      yield put({type:'Loading/stopSubmithLoading'})
      if(res.ret === ret.ok){
        let currencyInfos = {};
        if(res.currency_infos){
           for(let i = 0; i < res.currency_infos.length; i++){
             currencyInfos[res.currency_infos[i].name] = res.currency_infos[i];
           }
        }
        let balanceInfos = getAccountTypeObj(),obj;
        if(res.balance_infos){
          for(let i = 0; i < res.account_infos.length; i++){
            obj = {};
            for(let j = 0; j < res.balance_infos.length; j++){
               if(res.account_infos[i].id === res.balance_infos[j].accountid){
                  obj[res.balance_infos[j].name] = res.balance_infos[j];
               }
            }
            balanceInfos[res.account_infos[i].type] = obj;
          }
        } 
        yield put({type:'updateState',payload:{
          loggedIn: true,
          userInfo: res.user_info,
          accountInfos: res.account_infos || [],
          balanceInfos: balanceInfos,
          currencyInfos: currencyInfos || {},
          token: res.token,
          warningLevel: parseFloat(res.warning_level || 0),
          forceCloseLevel:  parseFloat(res.force_close_level || 0),
          positionInfos: res.position_infos || []
        }});
        setSessionStore('loggedIn',true);
        setSessionStore('userInfo',res.user_info);
        setSessionStore('accountInfos',res.account_infos || []);
        setSessionStore('balanceInfos',balanceInfos);
        setSessionStore('currencyInfos',currencyInfos || {});
        setSessionStore('token',res.token);
        setSessionStore('warningLevel', parseFloat(res.warning_level || 0));
        setSessionStore('forceCloseLevel',parseFloat(res.force_close_level || 0));
        setSessionStore('positionInfos', res.position_infos || []);
        yield put({type:'ws/wsLogin'});
        if(!payload.token){
          yield put(routerRedux.push('/ac/account/balance')); 
        }
      }
      else{
        yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
      }
    }
    ,
    *logout({payload},{call,put,select}){
      yield put({type:'updateState',payload:{
        loggedIn:false,
        userInfo:{},
        accountInfos:[],
        balanceInfos:{},
        currencyInfos:{},
        token:''
      }});
      removeSessionStore('loggedIn');
      removeSessionStore('userInfo');
      removeSessionStore('accountInfos');
      removeSessionStore('balanceInfos');
      removeSessionStore('currencyInfos');
      removeSessionStore('token');
      removeSessionStore('warningLevel');
      removeSessionStore('forceCloseLevel');
      removeSessionStore('positionInfos');
      yield put(routerRedux.push('/login')); 
      yield put({ type: 'ws/wsClose' }); 
      yield put({ type: 'ws/wsConnect' });
    },
    *updateInviteCode({payload, callBack},{call,put,select}){
       if(payload){
        yield put({type:'updateState',payload:{inviteCode: payload}});
        setSessionStore('inviteCode',payload);
       }
    },
    *resendMobileCodeRequest({payload, callBack},{call,put,select}){
      const res = yield call(sendRegisterCaptcha,payload);
      if(res.ret === ret.ok){
        callBack();
      }
      else{
        yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
      }
    },
    *registerRequest({payload},{call,put,select}){
      const res = yield call(register,payload);
      if(res.ret === ret.ok){
        yield put({type:'global/showSuccessMessage',payload:'register_success'});
        yield put(routerRedux.push('/login')); 
      }
      else{
        yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
      }
    },
    *updatePosition({payload},{call,put,select}){
      let positionInfos =  yield select(state => {
        return state.Account.positionInfos;
      });
      let flag = false;
      let i = 0;
      for(i = 0; i < positionInfos.length; i++){
        if(positionInfos[i].id === payload.id){
          if(positionInfos[i].uuid < payload.uuid){
            positionInfos[i] = payload;
            flag = true;
          }        
         break;
        }
     }
     if(i === positionInfos.length){
      positionInfos.push(payload);
      flag = true;
     }
     if(flag){
      const p = positionInfos.filter(item => item.status === position_status.opened);
      yield put({type:'updateState',payload:{positionInfos:p}});
      setSessionStore('positionInfos', p);
     }
    },
    *changePassword({payload},{call,put,select}){
      yield put({type:'Loading/startSubmitLoading'});
      const request = createSignatureRequest(payload);
      const res = yield call(changePw,request);
      yield put({type:'Loading/stopSubmithLoading'})
      if(res.ret === ret.ok){
          return true;
      }
      else{
        yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
        return false;
      }
    },
    *retrievePwMobileCode({payload, callBack},{call,put,select}){
      const res = yield call(retrievePasswordCaptcha,payload);
      if(res.ret === ret.ok){
        callBack();
      }
      else{
        yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
      }
    },
    *forgotPasswordRequest({payload},{call,put,select}){
      yield put({type:'Loading/startSubmitLoading'});
      const res = yield call(retrievePassword,payload);
      yield put({type:'Loading/stopSubmithLoading'})
      if(res.ret === ret.ok){
        yield put({type:'Notification/changeTemplate'});
        yield put({type:'global/showSuccessMessage',payload:'reset_password_success'});      
      }
      else{
        yield put({type:'global/showErrorMessage',payload:{ret: res.ret, msg: res.msg}});
      }
    },
    *fetchUnreadMsgCount({payload = {}}, { call, put }) {  // eslint-disable-line
      const request = createSignatureRequest(payload);
      const response = yield call(queryUnreadMsgCount,request);
      if(response.ret === ret.ok){
        yield put({type: 'updateState', payload:{unreadMsgCount: response.count || 0 }});
      }
    },
    *getKycStatus({payload = {}}, { call, put }) {
      const request = createSignatureRequest(payload);
      const response = yield call(queryKycStatus,request);
      if(response.ret === ret.ok){
        let obj = {};
        obj.status = response.status;
        obj.comment = response.comment || '';
        yield put({type: 'updateState', payload:{kycStatusInfo: obj }});
      }
    },
    *getInviteInfo({payload = {}}, { call, put }) {
      const request = createSignatureRequest(payload);
      const response = yield call(queryInviteInfo,request);
      if(response.ret === ret.ok){
        let obj= {};
        obj.count = response.count;
        obj.invite_code = response.invite_code;
        obj.rebate_currency = response.rebate_currency;
        obj.rebate = response.rebate;
        obj.invite_link = response.invite_link;
        yield put({type: 'updateState', payload:{inviteInfo: obj }});
      }
    },
    *updateVipLevel({payload = 0}, { put, select }) {
      const accountInfos = yield select(state =>{
        return state.Account.accountInfos;
      });
      const upAc = accountInfos.map(item => ({...item, vip_level:payload}));
      yield put({type:'updateState',payload:{accountInfos: upAc || []}});
      setSessionStore('accountInfos',upAc || []);
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
