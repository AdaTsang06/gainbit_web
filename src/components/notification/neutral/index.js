import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Field, change, formValueSelector } from 'redux-form';
import { FormattedMessage } from 'umi-plugin-locale';
import { withRouter } from 'react-router-dom';
import Form, { FieldInput } from '@/components/form';
import Selects from '@/components/selects';
import stringifyVolumn from '../../../utils/format';
import styles from './styles.scss';
import { account_type, dir, position_status  } from '../../../common/constant-enum';
import { deliverTypeSel } from '../../../common/search-item';

@withRouter
@connect(
  (state) => ({
    amount: formValueSelector('settleForm')(state, 'amount'),
    loading: state.Loading.submitLoading,
    acSymbolsObj: state.global.acSymbolsObj,
    settleHistory: state.neutralDeclare.settleHistory.data,
    balanceInfos: state.Account.balanceInfos
  }),
  dispatch => ({
    _updateAmount: (value) => dispatch(change('settleForm', 'amount', value)),
    _createNeutral: values => dispatch({type:'neutralDeclare/createNeutral',payload:values}),
    _removeTemplate: () => dispatch({type: 'Notification/changeTemplate'}),
  })
)
 class NeutralForm extends PureComponent {
  state = {
    currentSettle: {},
    direction:dir.buy,
    products:[],
    symbol:0
  };

  componentWillMount() {
   const { settleHistory,symbolid,acSymbolsObj } = this.props;
   this.getSettle(settleHistory,symbolid);
   this.setState({products:this.getProducts(acSymbolsObj[account_type.accountTypeTd])});
  }

  componentWillReceiveProps(nextProps){
    const { settleHistory,symbolid,acSymbolsObj } = nextProps;
    if(this.props.settleHistory !== settleHistory || this.props.symbolid !== symbolid){
        this.getSettle(settleHistory,symbolid);
    }
    if(this.props.acSymbolsObj !== acSymbolsObj){
      this.setState({products:this.getProducts(acSymbolsObj[account_type.accountTypeTd])});
    }
  }

  getSettle = (settleHistory,symbolid) => {
    if(settleHistory && settleHistory.length > 0){
      let pos = {};
      for(let i = 0; i < settleHistory.length; i++){
          if(settleHistory[i].symbolid === symbolid){
             pos = settleHistory[i];
          }
      }
      this.setState({currentSettle: pos,symbol:symbolid, direction: parseFloat(pos.defer_amount || 0) > 0 ? dir.sell : dir.buy});
    }
  }

  getProducts = (symbols ={}) => {
    return Object.values(symbols).map(item => {
      return {name:item.name,value:item.id};
    })
  }
  _getMax = () => {
     const { balanceInfos,acSymbolsObj } = this.props;
     const { currentSettle={} } = this.state;
     const symbol = acSymbolsObj[account_type.accountTypeTd][currentSettle.symbolid] || {};
     const balances = balanceInfos[account_type.accountTypeEx] || {};
     const deferAmount = parseFloat(currentSettle.defer_amount || 0);
     const currency = deferAmount > 0 ? symbol.currency_quantity : symbol.currency_price;
     const balance = balances[currency] || {};
     let avail = 0;
     if(deferAmount > 0){
       avail = parseFloat(balance.amount_available || 0);
     }
     else if(deferAmount < 0){
       if(parseFloat(currentSettle.settle_price || 0) !== 0){
        avail = (parseFloat(balance.amount_available || 0)/parseFloat(currentSettle.settle_price)) || 0;
       }
     }
     return avail.toFixed(symbol.digits_amount || 8);
  };
  _validate = values => {
    const errors = {};
    const amount = Number(values.amount || 0);
    if (amount <= 0) {
      errors.amount = 'must_>_0';
    }
    if (amount > parseFloat(this._getMax())) {
      errors.amount = 'must_<_available_weituo';
    }
    return errors;
  };
  _onAmountChange = value => {
    const { acSymbolsObj } = this.props;
    const { symbol } = this.state;
    const obj = acSymbolsObj[account_type.accountTypeTd][symbol] || {};
    const digits = obj.digits_amount || 8;
    const precision = value.split('.')[1];
    const len = digits;
    if (isNaN(value)) {
      return null;
    }
    if (precision && precision.length > len) {
      return value.split('.')[0]+'.'+precision.substring(0,len);
    }
    return value;
  };
  _tranferAll = () => {
    const avail = this._getMax();
    this.props._updateAmount(avail);
  };
  _createNeutralRequest = ({ amount }) => {
    const {  _createNeutral ,_removeTemplate} = this.props;
    const { symbol} = this.state;
    _createNeutral({
      symbolid: symbol || 0,
      amount: Number(amount).toString(),
    }).then((result) => {
      if(result){
        _removeTemplate();
      }
    });
  };

  proudctOnChange = (value) => {
    this.getSettle(this.props.settleHistory,value);
  }
  render() {
    const {
      loading,
      _removeTemplate,
      acSymbolsObj,
    } = this.props;
    const { direction,products,symbol } = this.state;
    const avail = parseFloat(this._getMax());
    const obj = acSymbolsObj[account_type.accountTypeTd][symbol] || {};
    const dirArr = deliverTypeSel.slice(1,3);
    const action = (
      <div className="confirm_modal_action">
        <button type='button' onClick={_removeTemplate}>
          <FormattedMessage id="cancle" />
        </button>
        <button disabled={loading}>
          <FormattedMessage id="confirm" />
        </button>
    </div>
    );
    return (
      <div className={styles.crypto}>
        <Form
          ref={e => {
            this.form = e;
          }}
          onSubmit={this._createNeutralRequest}
          validate={this._validate}
          form='settleForm'
          actionAlign="flex-end"
          action={action}
        >
           <div className={styles.crypto_amount_lable}>
            <FormattedMessage id="product" />
          </div>
          <div className={styles.crypto_form_item}>         
             <Selects
                name="symbol"
                onChange={this.proudctOnChange}
                arr={products}
                defaultValue={symbol}
                options={{align:"left"}}
            />
          </div>    
          <div className={styles.crypto_amount_lable}>
            <FormattedMessage id="tradeType" />
          </div>
          <div className={styles.crypto_form_item}>         
             <Selects
                width={140}
                name="direction"
                arr={dirArr}
                defaultValue={direction}
                options={{align:"left"}}
                disabled ={ true }
            />
          </div>        
          <div className={styles.crypto_amount_lable}>
            <FormattedMessage
              id="weituoNum"
            />
          </div>
          <div className={styles.crypto_amount_item}>
            <FormattedMessage           
              id="weituoNumReqiure"
            >
              {msg => (
                <Field
                  name="amount"
                  type="text"
                  normalize={this._onAmountChange}
                  disabled={!(avail > 0)}
                  component={FieldInput}
                  placeholder={msg}
                />
              )}
            </FormattedMessage>
            <a
              onClick={this._tranferAll}
              className={styles.crypto_amount_action}
            >
              <FormattedMessage id="All" />
            </a>
          </div>
          <div className={styles.crypto_form_item}>
            <FormattedMessage id="aWeituoNum" />
            <a>
              {stringifyVolumn(avail, obj.digits_amount || 8)} {obj.currency_quantity}
            </a>
          </div>        
        </Form>
      </div>
    );
  }
}
export default NeutralForm