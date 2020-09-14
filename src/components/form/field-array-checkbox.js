import React, { useState }  from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'umi-plugin-locale';
import { Field } from 'redux-form';
import styles from './styles.scss';

const FieldCheckbox = ({input,realRef,label,disabled,type,data,defautValue}) => {
  const [checked=defautValue, setChecked] = useState();
  return <div className={styles.ckInput_field}><input
  ref={realRef}
  {...input}
  disabled={disabled}
  type={type}
  checked={checked}
  onChange={(e) => {
    setChecked(!checked);
    input.onChange(!checked);
  }}
/>
{label}
{data.otherProp && checked && <Field name={data.otherProp} component={({input}) =><input {...input} name="other" className={styles.other_input} />} />}
</div>
}

const FieldArrayCheckbox = (props) => {
  const { name, type, fields, label, onChange, initValue=[],error } = props;
  const [checkValue=initValue, setCheckValue] = useState();
  return <div className={classNames(styles.render_field)}>
    {label}
    <div className={styles.ck_list}>
      {fields.map((item,idx) => (
      <div key={idx} style={{display:"flex"}}>  
        <Field
        name={`${name}_${idx}`}
        type= {type}
        component={FieldCheckbox}
        label={item.label}
        value={item.value}
        onChange={(value) => {
          if(value){
            checkValue.push(item.value)
          }
          else{
            checkValue.splice(checkValue.indexOf(item.value),1);
          }
          onChange(checkValue)
          setCheckValue(checkValue);
        }}
        data={item}
        defautValue={initValue.indexOf(item.value) !== -1}
        />
      </div>
      ))
      }
      <div className={styles.error_tip}>
          {error && <FormattedMessage id={error} />}
      </div>
    </div>
  </div>
}

export default FieldArrayCheckbox;