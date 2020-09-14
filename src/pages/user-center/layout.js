import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import common from '@/css/common.scss';
import styles from './styles.scss';

@withRouter
class Layout extends PureComponent {
  state = {
    chose: 'login',
  };
  componentDidMount() {
    this._setChose();
  }
  _setChose = () => {
    const { location } = this.props;
    this.setState({ chose: location.pathname.split('/')[1] });
  };
  _onSwitchBarClick = chose => {
    const { history } = this.props;
    history.push(`/${chose}`);
  };

  render() {
    const { children } = this.props;
    
    // const { chose } = this.state;
    return (
      <div className={classnames(styles.container)}>
        {/*<div>
          <img src={bg} alt="bg" />
        </div>*/}
        <div>
          {/*<SwitchBar
              style={{ height: '50px', borderBottom: '1px solid #cbcbcb' }}
              itemStyle={tabStyle}
              chose={chose}
              normalColor="#8e8e8e"
              arr={['login', 'register']}
              onClick={this._onSwitchBarClick}
            />*/}
          {children}
        </div>
      </div>
    );
  }
}

export default Layout;
