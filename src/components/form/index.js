import React, { PureComponent, Fragment } from 'react';
import { reduxForm } from 'redux-form';
import { FormattedMessage } from 'umi-plugin-locale';
import FieldInput from './field-input';
import renderDatePicker from './field-datepicker';
import FieldCheckbox from './field-checkbox';
import FieldSelect from './field-select';
import FieldTextarea from './field-textarea';
import FieldArrayCheckbox from './field-array-checkbox';
import FieldArrayRadio from './field-array-radio';

import styles from './styles.scss';

@reduxForm()
class Form extends PureComponent {
  render() {
    const {
      handleSubmit,
      children,
      className = null,
      submitting,
      action: Action,
      multipleSubmit,
      callbackSubmit,
      actionAlign = 'center',
      pristine,
    } = this.props; //  reset,
    const checkAction =
      typeof Action === 'object' ? Action : <Action disabled={submitting} />;
    return (
      <form className={className} onSubmit={handleSubmit} autoComplete="off">
        {children}
        <div style={{ justifyContent: actionAlign }} className={styles.action}>
          {multipleSubmit}
          {checkAction || (
            <Fragment>
              <button
                className={styles.button}
                type="submit"
                disabled={submitting || pristine}
                onClick={callbackSubmit}
              >
                {submitting ? (
                  'Loading...'
                ) : (
                  <FormattedMessage id="login_button" />
                )}
              </button>          
            </Fragment>
          )}
        </div>
      </form>
    );
  }
}

export {
  FieldInput,
  renderDatePicker,
  FieldCheckbox,
  FieldSelect,
  FieldTextarea,
  FieldArrayCheckbox,
  FieldArrayRadio,
  Form,
};

export default Form;
