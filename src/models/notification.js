export default {
  namespace: 'Notification',
  state: {
    template: null,
    coinType: null,
    order:null,
    isCoin:'',
    tmp_token:''
  },

  subscriptions: {
    setup({ dispatch, history}) {  // eslint-disable-line
      dispatch({type: 'fetchErrorMessage'})
    }
  },

  effects: {
    *changeTemplate({payload = null},{put}){
        yield put({type:'updateState',payload:{template:payload}})
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
