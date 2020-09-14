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
  placeholder,
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
      style={{ justifyContent: 'space-between' }}
      className={classNames(styles.render_field, {
        [styles.render_error_field]: isPassed === false,
      })}
    >
      {label}
      <div className={styles.input_field}>
        <textarea
          ref={realRef}
          {...input}
          placeholder={placeholder}
          disabled={disabled}
          type={type}
        />
        <div className={styles.tip} style={{ bottom: '-14px', top: 'auto' }}>
          {asyncValidating && <FormattedMessage id="check" />}
          {showError && <FormattedMessage id={error} />}
          {/* {!active && !error && touched && valid && !asyncValidating && <FormattedMessage id="succeed" />} */}
        </div>
      </div>
    </div>
  );
};

export default filedComponent;
