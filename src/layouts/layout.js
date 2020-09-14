import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import Header from './header-gainbit';
//import Footer from './footer';

@connect(
  state => ({
    locale: state.Intl.locale,
    kFullScreen: state.global.kFullScreen
  })
)
class Layout1 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentWillMount() {

  }
  render() {
    const {
      locale,
      children,
      location,
      kFullScreen
    } = this.props;
    //const shouldShowFooter = (location.pathname !== '/exchange-ex' && location.pathname !== '/exchange-td' && location.pathname !== '/exchange-td/closePosition');
    const { pathname } = location;
    return (
        <Fragment>
          {!kFullScreen && <Header pathname={pathname} {...locale} />}
          {children}
          {/* {shouldShowFooter && <Footer locale={locale} pathname={pathname} />} */}
        </Fragment>
    );
  }
}

export default withRouter(Layout1);
