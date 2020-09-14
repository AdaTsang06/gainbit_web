import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Field, change, formValueSelector } from 'redux-form';
import { FormattedMessage } from 'umi-plugin-locale';
import { withRouter } from 'react-router-dom';
import Form, { FieldInput } from 'components/form';
import styles from './styles.scss';

const selector = formValueSelector('verifyWithdraw');

@withRouter
@connect(
  state => ({
    amount: selector(state, 'amount'),
    loading: state.Loading.submitLoading,
    isVerified: state.Address.withdraw.isVerified,
  }),
  dispatch => ({
    _verifyWithdraw: values => dispatch({type:'verifyWithdraw',payload:values}),
    _updateAmount: value => dispatch(change('verifyWithdraw', 'amount', value)),
  })
)
 class Verify extends PureComponent {
  _validate = values => {
    const errors = {};
    if (!values.email_code) {
      errors.email_code = 'required';
    }
    if (!values.code) {
      errors.code = 'required';
    }
    return errors;
  };
  _createVerifyRequest = values => {
    const { location } = this.props;
    const tmp_token = new URLSearchParams(location.search).get('tmp_token');
    const { code } = values;
    const params = code.length === 8 ? { code: code } : { code: code };
    this.props._verifyWithdraw({
      ...params,
      captcha: values.email_code,
      tmp_token,
    });
  };
  render() {
    const { loading } = this.props;
    const action = (
      <button disabled={loading} type="submit" className='submit_button'>
        <FormattedMessage id="submit" />
      </button>
    );
    return (
      <div className={styles.crypto}>
        <Form
          ref={e => {
            this.form = e;
          }}
          onSubmit={this._createVerifyRequest}
          validate={this._validate}
          form="verifyWithdraw"
          actionAlign="flex-start"
          action={action}
        >
          <div className={styles.crypto_amount_item}>
            <Field
              name="email_code"
              type="text"
              component={FieldInput}
              label={<FormattedMessage id="email_code" />}
            />
          </div>
          <div className={styles.crypto_amount_item}>
            <Field
              name="code"
              type="text"
              component={FieldInput}
              label={<FormattedMessage id="code" />}
            />
          </div>
        </Form>
      </div>
    );
  }
}
export default  Verify