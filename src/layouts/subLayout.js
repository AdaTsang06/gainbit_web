import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import HeaderSUb from './headerSub';

@connect(
  state => ({
    locale: state.Intl.locale,
    kFullScreen: state.global.kFullScreen
  })
)
class Layout2 extends PureComponent {
  constructor(props) {
    super(props);
  }
  componentWillMount() {

  }
  render() {
    const {
      locale,
      children,
      location,
    } = this.props;
    const { pathname } = location;
    return (
        <Fragment>
          <HeaderSUb pathname={pathname} {...locale} />
          {children}
        </Fragment>
    );
  }
}

export default withRouter(Layout2);
