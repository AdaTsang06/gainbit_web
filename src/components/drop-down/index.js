import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import styles from './styles.scss';

@withRouter
class DropDown extends PureComponent {
  render() {
    const { children, value, width, dropColor } = this.props;
    return (
      <div className={styles.dropdown}>
        <h6
          style={{
            marginLeft:'40px',
            color:dropColor || "#fff"
          }}
        >
          {value}
        </h6>
        <div style={{width:  width ? width : '160px'}}>{children}</div>
      </div>
    );
  }
}
export default  DropDown