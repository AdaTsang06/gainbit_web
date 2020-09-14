export default {
  namespace: 'Loading',
  state: {
      fetchLoading: false,
      submitLoading: false,
  },

  subscriptions: {
    setup({ dispatch, history}) {  // eslint-disable-line
      dispatch({type: 'fetchErrorMessage'})
    }
  },

  effects: {
    *startFetchLoading({payload},{put}){
        yield put({type:'updateState',payload:{fetchLoading:true}})
    },
    *stopFetchLoading({payload},{put}){
      yield put({type:'updateState',payload:{fetchLoading:false}})
    },
    *startSubmitLoading({payload},{put}){
      yield put({type:'updateState',payload:{submitLoading:true}})
   },
   *stopSubmithLoading({payload},{put}){
    yield put({type:'updateState',payload:{submitLoading:false}})
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
