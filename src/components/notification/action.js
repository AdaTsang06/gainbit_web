import React, { Fragment } from 'react';
import { FormattedMessage } from 'umi-plugin-locale';
import classnames from 'classnames';
import styles from './styles.scss';

const Action = ({ loading, cancel, submit, onlyOne }) => (
  <Fragment>
    <button
      onClick={submit}
      disabled={loading}
      type="submit"
      className={classnames('submit_button', {
        submit_button_loading: loading,
      })}
      style={{ marginLeft: onlyOne && '23%' }}
    >
      <FormattedMessage id="submit" />
    </button>
    {!onlyOne && (
      <button onClick={cancel} className={styles.cancel_button}>
        <FormattedMessage id="cancel" />
      </button>
    )}
  </Fragment>
);

export default Action;
