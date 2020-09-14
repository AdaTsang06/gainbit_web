import React from 'react';
import { FormattedMessage } from 'umi-plugin-locale';
import classNames from 'classnames';
import Select from '../select';
import styles from './styles.scss';

export const filedComponent = ({
  input,
  label,
  locale,
  arr,
  width = 220,
  isPassed,
  meta: { asyncValidating, error, touched },
  realRef,
  placeholder,
  disabled,
  options,
  extra,
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
        {
          <Select
            ref={realRef}
            {...input}
            width={width}
            placeholder={placeholder}
            disabled={disabled}
            defaultValue={input.value}
            arr={arr}
            locale={locale}
            options={options}
            extra={extra}
          />
        }
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
