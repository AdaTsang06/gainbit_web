import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import classnames from 'classnames';
import Notification from '@/components/notification';
import Error from '@/components/error';
import Success from '@/components/success';
import '../css/common.scss';
import styles from './index.scss';
import DocumentTitle from 'react-document-title';


@connect(
  state => ({
    notificationShow: state.Notification.template,
    errorMsgs: state.global.errorMsgs,
    successMsgs: state.global.successMsgs
  })
)
class LayoutComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isScroll: false,
    };
  }
  componentWillMount() {

  }
  render() {
    const { isScroll } = this.state;
    const {
      children,
      notificationShow,
      errorMsgs,
      successMsgs,
    } = this.props;
    const layout = classnames(styles.layout, { [styles.scroll]: isScroll });
    return (
      <DocumentTitle title="GainBit">
        <div className={layout} id="layoutContainer">
          {children}
          {notificationShow && <Notification />}
          <div className={styles.error_container}>
            {[...new Set(errorMsgs)].map((item, index) => (
              <Error msg={item} key={index} />
            ))}
            {successMsgs.map((item, index) => (
              <Success msg={item} key={index} />
            ))}
          </div>
        </div>
    </DocumentTitle>
    );
  }
}

export default withRouter(LayoutComponent);
