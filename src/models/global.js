
import { ret } from '../common/constants';
import { getSymTypeObj } from '../utils/util';
import { getErrorMessage, getSymbols, incrBalance, queryNotices, getRate} from '../services/global';

const time = 3000;
let cDispatch = null;
export default {
  namespace: 'global',
  state: {
      errorMessages:[],
      errorMsgs: [],
      successMsgs: [],
      symbolsObj:{},//产品分类产品id列表
      acSymbolsObj:getSymTypeObj(),//产品分类产品列表
      kFullScreen:false,
      tipsList: {},
      noticeList:[],
      rates:{}
  },

  subscriptions: {
    setup({ dispatch, history}) {  // eslint-disable-line 
      cDispatch = dispatch;
      dispatch({type: 'fetchErrorMessage'});
      dispatch({type: 'fetchSymbols'});
    }
  },

  effects: {
    *fetchErrorMessage({ payload }, { call, put }) {  // eslint-disable-line
      const response = yield call(getErrorMessage);
      if(response.ret === ret.ok){
        yield put({type: 'updateState', payload:{errorMessages:response.infos || []}});
      }
    },
    *showErrorMessage({ payload }, { select, call, put }){    
      const errorMessages = yield select(state => {
        return state.global.errorMessages;
      });
      let error = null,msg = payload.msg;
      errorMessages.some(item =>{
        if(item.error_code === payload.ret){
           error = item;
        }
      });
      if(error){
        msg = error.message;
      }
      else{
        msg = "Requetst Error";
      }
      //message.error(msg);
      cDispatch({type:'addErrorMsg',payload:msg})
      setTimeout(() => {
        cDispatch({type:'removeErrorMsg'});
       },time);
      if(payload.ret === ret.not_login || payload.ret === ret.sign_error){
        yield put({type:'Account/logout'});
      }
    },
    *showSuccessMessage({ payload }, { select, call, put }){   
      // const locale = yield select(state =>{
      //   return state.Intl.locale;
      // });
      // message.success(sucMessage[locale][payload]);
      cDispatch({type:'addSuccessMsg',payload})
      setTimeout(() => {
        cDispatch({type:'removeSuccessMsg'});
       },time);
    },
    *fetchSymbols({ payload }, { call, put }) {  // eslint-disable-line
      const response = yield call(getSymbols);
      if(response.ret === ret.ok){
        if(response.infos && response.infos.length){
          let acSyms = getSymTypeObj(),syms = {},info;
          for(let i =0;i < response.infos.length;i++){
            info = response.infos[i];
            acSyms[info.type][ info.id] = info; //按产品类型，id存取 
            if(!syms[info.type]){
              syms[info.type] = [];

            }          
            syms[info.type].push(info.id)       
          }
          yield put({type: 'updateState', payload:{acSymbolsObj: acSyms, symbolsObj: syms}});
          yield put({type: 'ws/wsConnect'})
        }
      }
    },
    *testIncBalance({ payload }, { call, put }){
      yield call(incrBalance,payload);
    },
    *addSuccessMsg({ payload }, { call, put,select }){  
      let successMsgs = yield select(state =>{
         return state.global.successMsgs;
       });
       successMsgs.unshift(payload)
       yield put({type:'updateState',payload:{successMsgs:[...successMsgs]}});
    },
    *removeSuccessMsg({ payload }, { call, put,select }){
      let successMsgs = yield select(state =>{
        return state.global.successMsgs;
      });
      successMsgs.shift();
      yield put({type:'updateState',payload:{successMsgs:[...successMsgs]}});
   },
   *addErrorMsg({ payload }, { call, put,select }){  
    let errorMsgs = yield select(state =>{
       return state.global.errorMsgs;
     });
     errorMsgs.unshift(payload)
     yield put({type:'updateState',payload:{errorMsgs:[...errorMsgs]}});
  },
  *removeErrorMsg({ payload }, { call, put,select }){
    let errorMsgs = yield select(state =>{
      return state.global.errorMsgs;
    });
    errorMsgs.shift();
    yield put({type:'updateState',payload:{errorMsgs:[...errorMsgs]}});
 },
 *fetchNotices({ payload }, { call, put }) {  // eslint-disable-line
    const response = yield call(queryNotices,payload);
    if(response.ret === ret.ok){
      yield put({type: 'updateState', payload:{noticeList: response.infos || []}});
    }
  },
  *fetchRates({},{ call, put }){
    const response = yield call(getRate);
    if(response.ret === ret.ok){
      if(response.infos && response.infos.length){
        let obj = {},info;
        for(let i =0; i < response.infos.length;i++){
           info = response.infos[i];
           if(info && info.src && info.dst){
             obj[`${info.src}/${info.dst}`] = info.rate;
           }
        }
        yield put({type: 'updateState', payload:{rates: obj }});
      }
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
