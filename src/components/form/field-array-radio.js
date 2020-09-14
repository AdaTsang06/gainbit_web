import React, { useState } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'umi-plugin-locale';
import { Field } from 'redux-form';
import styles from './styles.scss';

const FieldArrayRadio = (props) => {
  const { name, type, fields, label,onChange, initValue,error } = props;
  const [checkValue=initValue, setCheckValue] = useState();
  return <div className={classNames(styles.render_field)}>
    {label}
    <div className={styles.ck_list}>
      {fields.map((item,idx) => (
      <Field
      key={idx}
      name={`${name}`}
      type= {type}
      component={({input,realRef,label}) => {
        return <div className={styles.ckInput_field}><input
        ref={realRef}
        {...input}
        disabled={item.disabled}
        type={type}
        checked={checkValue === item.value}
        onChange={(e) => {
          setCheckValue(e.target.value);
          onChange(e.target.value);
        }}
        value={item.value}
      />
      {label}
      </div>
      }}
      label={item.label}/>
      ))
      }
      <div className={styles.error_tip}>
          {error && <FormattedMessage id={error} />}
      </div>
    </div>
  </div>
}

export default FieldArrayRadio;