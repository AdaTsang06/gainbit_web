import React from 'react';
import { FormattedMessage, IntlProvider } from 'umi-plugin-locale';
import classNames from 'classnames';
import Select from '../select';
import styles from './styles.scss';

export const filedComponent = ({
  input,
  label,
  type,
  locale,
  messages,
  arr,
  width = 220,
  isPassed,
  meta: { asyncValidating, error, touched },
  realRef,
  placeholder,
  disabled,
  onBlurShowError,
}) => {
  let node = null;
  switch (type) {
    case 'textarea':
      node = (
        <textarea
          ref={realRef}
          {...input}
          placeholder={placeholder}
          disabled={disabled}
          type={type}
        />
      );
      break;
    case 'select':
      node = locale ? (
        <IntlProvider locale={locale} messages={messages[locale]}>
          <Select
            ref={realRef}
            {...input}
            width={width}
            placeholder={placeholder}
            disabled={disabled}
            defaultValue={input.value}
            arr={arr}
          />
        </IntlProvider>
      ) : (
        <Select
          ref={realRef}
          {...input}
          width={width}
          placeholder={placeholder}
          disabled={disabled}
          defaultValue={input.value}
          arr={arr}
        />
      );
      break;
    default:
      node = (
        <input
          ref={realRef}
          {...input}
          placeholder={placeholder}
          disabled={disabled}
          type={type}
        />
      );
  }

  let showError = null;
  if (onBlurShowError) {
    showError = touched && error;
  } else {
    showError = touched && error;
  }

  return (
    <div
      style={{
        justifyContent: type === 'checkbox' ? 'flex-end' : 'space-between',
      }}
      className={classNames({
        [styles.render_field]: true,
        [styles.render_error_field]: isPassed === false,
      })}
    >
      {type !== 'checkbox' && label}
      <div className={styles.input_field}>
        {node}
        {type === 'checkbox' && label}
        <div className={styles.tip}>
          {asyncValidating && <FormattedMessage id="check" />}
          {showError && <FormattedMessage id={error} />}
          {/* {!active && !error && touched && valid && !asyncValidating && <FormattedMessage id="succeed" />} */}
        </div>
      </div>
    </div>
  );
};

export default filedComponent;
