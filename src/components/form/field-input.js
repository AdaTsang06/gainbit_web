import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi-plugin-locale';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { mainColor } from '../../common/color';
import styles from './styles.scss';
import eyeClose from '@/assets/eye-close.png';
import eyeCloseIn from '@/assets/eye-close-in.png';
import eyeOpen from '@/assets/eye-open.png';
import eyeOpenIn from '@/assets/eye-open-in.png';

@withRouter
class filedInput extends PureComponent {
  state = {
    myType: false,
  };
  _eyeToggle = name => {
    const { myType } = this.state;
    let input = document.getElementsByName(name)[0];
    let type = input && input.getAttribute('type');
    type === 'password'
      ? input && input.setAttribute('type', 'text')
      : input && input.setAttribute('type', 'password');
    let state = !myType;
    this.setState({ myType: state });
  };
  render() {
    const {
      input,
      label,
      type,
      isPassed,
      meta: { asyncValidating, error, touched },
      realRef,
      placeholder,
      disabled,
      action,
      onBlurShowError,
      autofocus,
      // eyeToggle,
      match: { path },
    } = this.props;
    const { myType } = this.state;
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
          <input
            ref={realRef}
            {...input}
            placeholder={placeholder}
            disabled={disabled}
            type={type}
            autoFocus={autofocus}
            style={{ border: showError && error && '1px solid #DC5230' }}         
          />
          {type === 'password' && (
            <p
              className={styles.eye}
              onClick={() => this._eyeToggle(input.name)}
            >
              {path === '/login' || path === '/register' || path === '/' ? (
                <img src={myType ? eyeOpen : eyeClose} />
              ) : (
                <img src={myType ? eyeOpenIn : eyeCloseIn} />
              )}
            </p>
          )}
          {action}
          <div className={styles.tip}>
            {asyncValidating && <FormattedMessage id="check" />}
            {showError && error && <FormattedMessage id={error} />}
          </div>
        </div>
      </div>
    );
  }
}

 export default filedInput;
