import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi-plugin-locale';
import classnames from 'classnames';
import styles from './index.scss';
import common from '@/css/common.scss';
const regUpper = /^[A-Z]+$/;

class HeaderSub extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const { pathname } = this.props;
    const cPath = regUpper.test(pathname.split('/')[pathname.split('/').length - 1])
    ? pathname
        .split('/')
        .slice(0, -1)
        .join('/')
    : pathname.split('/')[pathname.split('/').length - 1];
    return (
      <div>
        <div className={classnames(styles.header_sub)}>
          <FormattedMessage
            id={cPath}
            values={{ icon: '' }}
          />
        </div>
        {/* 面包屑 */}
        <div className={classnames(styles.header_subNav)}>
          <div className={classnames(common.container)}>
            <span className={classnames(styles.header_subNav_breadCrumb)}>
              {/* <Link to={'/home'}> */}
                <FormattedMessage id="home" />&nbsp;>&nbsp;
              {/* </Link> */}
            </span>
            <span className={classnames(styles.header_subNav_breadCrumb)}>
              <FormattedMessage id="userCenter" />&nbsp;>&nbsp;
            </span>
            <FormattedMessage
            id={cPath}
            className={classnames(
              styles.header_subNav_breadCrumb,
              styles.header_subNav_breadCrumb_active
            )}
            values={{ icon: '' }}
          />
          </div>
        </div>
      </div>
    );
  }
}
export default  HeaderSub