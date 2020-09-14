import React from 'react';
import FreeScrollBar from 'react-free-scrollbar';
import Form, { FieldInput, FieldTextarea } from '../../form';
import { Field } from 'redux-form';
import { FormattedMessage } from 'umi-plugin-locale';
import { withRouter } from 'react-router-dom';
import { connect } from 'dva';
import { getFiatType } from '@/common/fiat-type';
import Action from '@/components/notification/action';
import styles from './styles.scss';

@withRouter
@connect(
  (state, { name }) => ({
    address: state.Address.address[`withdraw_${name}`],
    loading: state.Loading.submitLoading,
  })
)
class  AddBank extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { history } = this.props;
    const { address } = nextProps;
    if (address !== this.props.address) {
      history.goBack();
    }
  }
  _validate = values => {
    const errors = {};
    const requires = [
      // 'bank_swift_code',
      'bank_name',
      'bank_address',
      'beneficiary_name',
      'bank_account',
      'beneficiary_address',
    ];
    requires.forEach(key => {
      if (!values[key] || !values[key].replace(/^\s*|\s*$/g, '')) {
        errors[key] = 'required';
      }
    });
    return errors;
  };
  createFiatWithdrawAddress = ()=> {

  }
  _submit = values => {
    const { name } = this.props;
    if (
      values.bank_swift_code &&
      !values.bank_swift_code.replace(/^\s*|\s*$/g, '')
    ) {
      debugger;
      delete values.bank_swift_code;
    }

    this.createFiatWithdrawAddress({ ...values, fiat_type: getFiatType(name) });
  };
  removeTemplate = () =>{
    this.props.dispatch({type:'Notification/changeTemplate'})
  }
  render() {
    const { loading } = this.props;
    const action = () => (
      <Action
        loading={loading}
        cancel={this.removeTemplate}
        submit={this._submit}
      />
    );
    return (
      <div className={styles.address_form}>
        <FreeScrollBar>
          <div className={styles.navigator}>
            <FormattedMessage id="add_bank_account_title_tips" />
          </div>
          <Form
            actionAlign="flex-end"
            action={action}
            onSubmit={this._submit}
            validate={this._validate}
            form="cryptoAddress"
          >
            <div className={styles.form_section}>
              <div className={styles.form_section_header}>
                <FormattedMessage id="beneficiary_information" />
              </div>
              <Field
                name="beneficiary_name"
                type="text"
                component={FieldInput}
                label={<FormattedMessage id="beneficiary_name" />}
              />
              <Field
                name="bank_account"
                type="text"
                component={FieldInput}
                label={<FormattedMessage id="account_number" />}
              />
              <Field
                name="beneficiary_address"
                type="textarea"
                component={FieldTextarea}
                label={<FormattedMessage id="beneficiary_address" />}
              />
            </div>
            <div className={styles.form_section}>
              <div className={styles.form_section_header}>
                <FormattedMessage id="bank_information" />
              </div>
              <div className={styles.swift_code_item}>
                <Field
                  name="bank_swift_code"
                  type="text"
                  component={FieldInput}
                  label={<FormattedMessage id="swift_code" />}
                />
                <div className={styles.swift_code_tip}>
                  <FormattedMessage id="swift_code_tip" />
                </div>
              </div>
              <Field
                name="bank_name"
                type="text"
                component={FieldInput}
                label={<FormattedMessage id="withdrawal_bank" />}
              />
              <Field
                name="bank_address"
                type="textarea"
                component={FieldTextarea}
                label={<FormattedMessage id="bank_address" />}
              />
            </div>
            <div className={styles.form_section}>
              <div className={styles.form_section_header}>
                <FormattedMessage id="intermediary_bank_information" />
              </div>
              <Field
                name="via_bank_swift_code"
                type="text"
                component={FieldInput}
                label={<FormattedMessage id="swift_code" />}
              />
              <Field
                name="via_bank_name"
                type="text"
                component={FieldInput}
                label={<FormattedMessage id="withdrawal_bank" />}
              />
              <Field
                name="via_bank_address"
                type="textarea"
                component={FieldTextarea}
                label={<FormattedMessage id="bank_address" />}
              />
            </div>
          </Form>
        </FreeScrollBar>
      </div>
    );
  }
}
export default AddBank;