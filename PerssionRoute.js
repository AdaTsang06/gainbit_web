import React from 'react';
import { connect } from 'dva';
@connect(
  state => ({
    loggedIn: state.Account.loggedIn
  }))
 class PermissionRoute extends React.Component{
  componentWillMount() {
    const routerRedux = require('dva').routerRedux;
    if(!this.props.loggedIn){
      this.props.dispatch(routerRedux.push('/login'));
    }
  }

  componentWillReceiveProps(nextProps){
    const routerRedux = require('dva').routerRedux;
    if(!nextProps.loggedIn){
      this.props.dispatch(routerRedux.push('/login'));
    }
  }
  
   render(){
    const { children } = this.props;
    return (
      <div>
        { children }
      </div>
    );
   }
 } 

export default PermissionRoute;
  