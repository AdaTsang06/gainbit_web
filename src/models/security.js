
import { getLocalStore } from '../utils/storage';
export default {
  namespace: 'Security',
  state: {
    is_double_check:false
  },

  subscriptions: {
    setup({ dispatch, history}) {  // eslint-disable-line
    }
  },

  effects: {
    *logout({payload},{call,put,select}){

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
