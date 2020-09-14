import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'dva';
import LoginForm from './login-form';
import Layout from '../layout';

@withRouter
@connect(
  state => ({
    loggedIn: state.Account.loggedIn,
    locale: state.Intl.locale
  })
)
class Login extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      clearForm: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ visible: true });
    if (nextProps.loggedIn) {
      const { history, location } = this.props;
      history.push({
        pathname: location.prevPath || '/',
      });
    }
  }
  componentWillUnmount() {
  }

  _hideModal = () => {
    const { visible } = this.state;
    this.setState({ clearForm: true });
    if (visible) {
      this.setState({ visible: false });
    }
  };
  render() {
    const { clearForm } = this.state;
    return (
      <Layout>
          <LoginForm clearForm={clearForm} />
      </Layout>  
    );
  }
}
export default Login;