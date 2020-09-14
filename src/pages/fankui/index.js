import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Form, { FieldInput, FieldTextarea } from '@/components/form';
import { Field } from 'redux-form';
import { FormattedMessage,formatMessage } from 'umi-plugin-locale';
import styles from './styles.scss';

@connect()
class FanKui extends PureComponent {
  state = {
  };
  
  _submit = values => {
    let obj = {...values};
    for (let key in obj) {
      if (!obj[key]) delete obj[key];
    }
    this.props.dispatch({type: "Retroaction/submitRetroaction", payload:obj })
  };
  _validate = values => {
    const requiredProps = [
      'content'
    ];
    return this._handleInputError(values, requiredProps);
  };
  _handleInputError = (values, props) => {
    const errors = {};
    props.forEach(key => {
      if (Object.keys(values).indexOf(key) === -1 || !values[key]) {
        errors[key] = 'required';
      }
      let value = values[key];
      if (value) {      
      }
    });
    return errors;
  };

  render() {
    const {loading } = this.props;
    const action = (
      <button disabled={loading} type="submit" className='submit_button'>
        <FormattedMessage id="submit" />
      </button>
    );
    return (
      <div className={styles.container}>
        <div className={styles.fankuiBox}>
            <Form
            className={styles.kyc_form}
            actionAlign="flex-end"
            action={action}
            onSubmit={this._submit}
            validate={this._validate}
            form="basicInfo"
            >               
            <Field
                name="contact"
                type="text"
                placeholder={formatMessage({id:"contact_require"})}
                component={FieldInput}
                label={<FormattedMessage id="contact"/>}
            />  
            <Field
                name="content"
                type="textarea"
                component={FieldTextarea}
                placeholder={formatMessage({id:"content_require"})}
                label={<FormattedMessage id="content" />}
            />    
            </Form> 
        </div>  
      
      </div>  
     
    );
  }
}
export default FanKui;