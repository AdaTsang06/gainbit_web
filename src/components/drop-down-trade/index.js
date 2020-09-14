import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import styles from './styles.scss';

@withRouter
class DropDown extends PureComponent {
  render() {
    const { children, value } = this.props;
    return (
      <div className={styles.dropdown}>
        <h6>{value}</h6>
        <div className={styles.dropdown_body}>{children}</div>
      </div>
    );
  }
}
export default  DropDown