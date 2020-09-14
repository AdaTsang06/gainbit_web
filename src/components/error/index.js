import React, { PureComponent } from 'react';
import styles from './styles.scss';

export default class Error extends PureComponent {
  render() {
    const { msg, style } = this.props;
    return (
        <div className={styles.error} style={style}>
          {msg}
        </div>
    );
  }
}
