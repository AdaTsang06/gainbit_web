import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Form, { FieldSelect, FieldInput } from '@/components/form';
import { Field,change } from 'redux-form';
import { FormattedMessage } from 'umi-plugin-locale';
import { cardType } from '../../../../common/search-item';
//import Agreement from './agreement';
import countryData from '@/common/country.json';
import styles from './styles.scss';


@connect(state => ({
  loading: state.Loading.submitLoading,
  kycIdInfo: state.KYC.kycIdInfo
}))
class LevelOne extends PureComponent {
  componentWillMount(){
    this.props.dispatch({type:"KYC/queryLevelStep1"})
  }
  componentWillReceiveProps(nextProps){
    const { kycIdInfo } =  nextProps;
    if(kycIdInfo !== this.props.kycIdInfo){
      Object.keys(kycIdInfo).map(key => this.props.dispatch(change('basicInfo',key, kycIdInfo[key])))
    }
  }
  _submit = values => {
    let obj = {...values,id_type:parseInt(values.id_type),country_code:values.country_code.toLowerCase()};
    //delete obj.user_sign2;
    this.props.dispatch({type:'KYC/submitLevelStep1', payload:obj});
  };
  _validate = values => {
    const requiredProps = [
      'country_code',
      'id_type',
      'name',
      'id_number',
      //'user_sign2',
      'email'
    ];
    return this._handleInputError(values, requiredProps);
  };
  _handleInputError = (values, props) => {
    //const idReg = /^[a-zA-Z0-9\\-]+$/;
    //const nameReg = /^[a-zA-Z\u4e00-\u9fa5]+$/;
    const errors = {};
    props.forEach(key => {
      if (Object.keys(values).indexOf(key) === -1 || !values[key]) {
        errors[key] = 'required';
      }
      let value = values[key];
      if (value) {
        // if (key === 'id_number' && !idReg.test(value)) {
        //   errors[key] = 'content_error';
        // }
        // if (key === 'name') {
        //   value = value.replace(/\s+/g, '');
        //   if (!nameReg.test(value)) {
        //     errors[key] = 'content_error';
        //   }
        // }
        if (key === 'email' && !(/\S+@\S+\.\S+/.test(value))) {
          errors[key] = 'content_error';
        }        
      }
      // if (!values.user_sign2) {
      //   errors.user_sign2 = 'must_agree';
      // }
    });
    return errors;
  };

  _handleCountryData = () => {
    const { locale } = this.props;
    const data = countryData[locale];
    return Object.keys(data)
      .filter(key => key !== 'US')
      .map(key => ({
        name: data[key].name,
        value: key.toLowerCase(),
      }));
  };
  
  render() {
    const countryList = this._handleCountryData();
    const { locale, loading, kycIdInfo } = this.props;
    const action = (
      <button disabled={loading} type="submit" className='submit_button'>
        <FormattedMessage id="nextStep" />
      </button>
    );
    return (
      <Fragment>
        <Form
          className={styles.kyc_form}
          actionAlign="flex-end"
          action={action}
          onSubmit={this._submit}
          validate={this._validate}
          form="basicInfo"
          initialValues={kycIdInfo}
        >
          <Field
            locale={locale}
            arr={countryList}
            name="country_code"
            type="select"
            component={FieldSelect}
            options={{ align: 'left' }}
            label={<FormattedMessage id="country" />}
          />
          <Field
            arr={cardType}
            name="id_type"
            type="select"
            component={FieldSelect}
            options={{ align: 'left' }}
            label={<FormattedMessage id="id_type" />}
          />
          <Field
            name="name"
            type="text"
            component={FieldInput}
            label={<FormattedMessage id="name" />}
          />                  
          <Field
            name="id_number"
            type="text"
            component={FieldInput}
            label={<FormattedMessage id="id_number" />}
          />      
          <Field
            name="email"
            type="text"
            component={FieldInput}
            label={<FormattedMessage id="email" />}
          />    
          {/* <Field
            name="user_sign2"
            type="checkbox"
            component={FieldCheckbox}
            label={
              <Fragment>
                <FormattedMessage id="user_sign" />
                <Agreement level={2} />
              </Fragment>
            }
          /> */}
        </Form>
      </Fragment>
    );
  }
}
export default LevelOne;