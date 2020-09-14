import { reducer as formReducer } from 'redux-form'
export const dva = {
    config:{
       extraReducers: {
        form: formReducer,
      }, 
    }
  };