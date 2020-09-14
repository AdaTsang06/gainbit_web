import React from 'react';
import { FormattedMessage } from 'umi-plugin-locale';
import classNames from 'classnames';
import styles from './styles.scss';

export const filedComponent = ({
  input,
  label,
  type,
  isPassed,
  meta: { asyncValidating, error, touched },
  realRef,
  disabled,
  onBlurShowError,
}) => {
  let showError = null;
  if (onBlurShowError) {
    showError = touched && error;
  } else {
    showError = touched && error;
  }
  return (
    <div
      // style={{ justifyContent: 'flex-end' }}
      className={classNames(styles.render_field, {
        [styles.render_error_field]: isPassed === false,
      })}
    >
      <div className={styles.ckInput_field}>
        <input
          ref={realRef}
          {...input}
          disabled={disabled}
          type={type}
        />
        {label}
        <div className={styles.tip} style={{ top: '16px' }}>
          {asyncValidating && <FormattedMessage id="check" />}
          {showError && <FormattedMessage id={error} />}
          {/* {!active && !error && touched && valid && !asyncValidating && <FormattedMessage id="succeed" />} */}
        </div>
      </div>
    </div>
  );
};

export default filedComponent;
