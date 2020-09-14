import React from 'react';
import { FormattedMessage } from 'umi-plugin-locale';
import { Link } from 'react-router-dom';
import styles from './styles.scss';

const Unlogin = () => (
  <em className={styles.unlogin}>
    <FormattedMessage
      id="unlogin"
      values={{
        login: (
          <Link to="/login">
            <FormattedMessage id="login" />
          </Link>
        ),
        signup: (
          <Link to="/signUp">
            <FormattedMessage id="signup" />
          </Link>
        ),
      }}
    />
  </em>
);

export default Unlogin;
