import React, { PureComponent } from 'react';
import FreeScrollBar from 'react-free-scrollbar';
import { withRouter } from 'react-router-dom';
import styles from './styles.scss';

@withRouter
class PopUp extends PureComponent {
  render() {
    const { children, width,visible } = this.props;
    return (
      <div className={styles.dropdown} style={{ width:  width ? width : '100%',display: visible ? 'block': 'none' }}>
        <FreeScrollBar>
          {children}
        </FreeScrollBar>
      </div>
    );
  }
}
export default  PopUp