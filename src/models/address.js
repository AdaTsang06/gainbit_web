
export default {
  namespace: 'Address',
  state: {
    history: {},
    count: {},
    address: {},
    depositBankCode: '',
    withdraw: {
      // sn: '',
      tmp_token: '',
    },
    credit: {},
    birth: {},
  },

  subscriptions: {
    setup({ dispatch, history}) {  // eslint-disable-line
    }
  },

  effects: {
   
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
