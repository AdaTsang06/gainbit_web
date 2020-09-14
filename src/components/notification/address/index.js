import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Field } from 'redux-form';
import { FormattedMessage} from 'umi-plugin-locale';
import Form, { FieldInput } from '@/components/form';
import { coinType } from '@/common/coin-type';
import Action from '../action';

@connect(
  state => ({
    type: state.Notification.coinType,
    loading: state.Loading.submitLoading,
  })
)
class Address extends PureComponent {
  _validateWithdraw = values => {
    const errors = {};
    if (!values.address) {
      errors.address = 'required';
    }
    if (!values.label) {
      errors.label = 'required';
    }
    return errors;
  };
  _createAddressSubmit = values => {
    const { type } = this.props;
    this.props.dispatch({type:'Address/createCryptoWithdrawAddress',payload:{
      coin_type: coinType(type),
      ...values,
    }})
  };
  removeTemplate = () =>{
    this.props.dispatch({type:'Notification/changeTemplate'})
  }
  render() {
    const {  loading } = this.props;
    return (
      <Form
        action={<Action loading={loading} cancel={this.removeTemplate} />}
        onSubmit={this._createAddressSubmit}
        validate={this._validateWithdraw}
        form="cryptoWithdraw"
      >
        <Field
          name="address"
          type="text"
          component={FieldInput}
          label={<FormattedMessage id="withdrawal_address" />}
        />
        <Field
          name="label"
          type="text"
          component={FieldInput}
          label={<FormattedMessage id="note" />}
        />
      </Form>
    );
  }
}
export default Address;