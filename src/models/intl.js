
import { getLocale } from 'umi-plugin-locale';
const sLocale = getLocale();
const langArr =  ['en-US', 'zh-CN', 'zh-TW'];
export default {
  namespace: 'Intl',
  state: {
    locale: langArr.indexOf(sLocale) !== -1 ? sLocale : 'zh-CN'
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
