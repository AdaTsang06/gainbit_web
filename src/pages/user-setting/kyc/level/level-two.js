import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Form, { FieldArrayRadio, FieldArrayCheckbox } from '@/components/form';
import { change } from 'redux-form';
import { FormattedMessage } from 'umi-plugin-locale';
import { occupation, income, incomeSource, openAcReason } from "../../../../common/kycItem";
import styles from './styles.scss';


@connect(state => ({
  loading: state.Loading.submitLoading,
  riskAssessment: state.KYC.riskAssessment
}))
class LevelTwo extends PureComponent {
  state={
    errors:{}
  }
  componentWillMount(){
    this.props.dispatch({type:"KYC/queryLevelStep2"})
  }
  componentWillReceiveProps(nextProps){
    const { riskAssessment } =  nextProps;
    if(riskAssessment !== this.props.riskAssessment){
      Object.keys(riskAssessment).map(key => 
        {
          if(key !== 'capital_source'){
            this.props.dispatch(change('riskInfoForm',key, riskAssessment[key]));
          }
          else{
            this.props.dispatch(change('riskInfoForm',key, riskAssessment[key].split(',')));
          }
        }
       )
    }
  }
  _submit = values => {
    const errors = this._validate(values);
    if(errors && Object.keys(errors).length){
      return;
    }
    let obj = {
      profession: values.profession,
      annual_income: values.annual_income,
      capital_source: values.capital_source.join(),
      open_account_reason: values.open_account_reason,
      capital_source_comment: values.capital_source_comment || ''
    };
    this.props.dispatch({type:'KYC/submitLevelStep2', payload:obj});

  };
  _validate = values => {
    const requiredProps = [
      'profession',
      'annual_income',
      'capital_source',
      'open_account_reason'
    ];
    const errors = this._handleInputError(values, requiredProps);
    this.setState({errors})
    return errors;
    ;
  };
  _handleInputError = (values={}, props) => {
    const errors = {};
    props.forEach(key => {
      if (Object.keys(values).indexOf(key) === -1 || !values[key]) {
        errors[key] = 'required';
      }
      let value = values[key];
      if (value) {
        if (key === 'capital_source' && value.length <= 0) {
          errors[key] = 'required';
        }
        if (key === 'capital_source' && values[key].indexOf('4') !== -1 && !values.capital_source_comment) {
          errors[key] = 'otherRequire';
        }
      }
    });
    return errors;
  };

  render() {
    const { errors } = this.state;
    const {  loading, dispatch, riskAssessment } = this.props;
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
          //validate={this._validate}
          onSubmit={this._submit}
          form="riskInfoForm"
          initialValues={riskAssessment}
        >
          <div>           
            <FieldArrayRadio 
            name="profession" 
            type="radio" 
            label={<FormattedMessage id="occupation" />} 
            fields={occupation}
            onChange={(value) => {
              dispatch(change('riskInfoForm', 'profession', value));
            }}
            initValue={riskAssessment['profession']}
            error={errors.profession}
            />
            <FieldArrayRadio 
            name="annual_income" 
            type="radio" 
            label={<FormattedMessage id="income" />} 
            fields={income}
            onChange={(value) => {
              dispatch(change('riskInfoForm', 'annual_income', value));
            }}
            initValue={riskAssessment['annual_income']}
            error={errors.annual_income}
            />
            <FieldArrayCheckbox 
            name="capital_source" 
            type="checkbox" 
            label={<FormattedMessage id="incomeSource" />} 
            fields={incomeSource}
            onChange={(value) => {
              dispatch(change('riskInfoForm', 'capital_source', value));
            }}
            initValue={(riskAssessment['capital_source'] && riskAssessment['capital_source'].split(',')) || []}
            otherInitValue={riskAssessment['capital_source_comment']}
            error={errors.capital_source}
            />
            <FieldArrayRadio 
            name="open_account_reason" 
            type="radio" 
            label={<FormattedMessage id="openAcReason" />} 
            fields={openAcReason}
            onChange={(value) => {
              dispatch(change('riskInfoForm', 'open_account_reason', value));
            }}
            initValue={riskAssessment['open_account_reason']}
            error={errors.open_account_reason}
            />
          </div>        
        </Form>
      </Fragment>
    );
  }
}
export default  LevelTwo;