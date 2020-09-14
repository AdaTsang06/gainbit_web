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
    positionInfos:state.Account.positionInfos,
    acSymbolsObj: state.global.acSymbolsObj
  }),
  dispatch => ({
    _updateAmount: (value) => dispatch(change('settleForm', 'amount', value)),
    _createDeliver: values => dispatch({type:'deliverDeclare/createDeliver',payload:values}),
    _removeTemplate: () => dispatch({type: 'Notification/changeTemplate'}),
  })
)
 class SettleForm extends PureComponent {
  state = {
    currentPositions: {},
    direction:dir.buy,
    products:[],
    symbol:0
  };

  componentWillMount() {
   const { positionInfos,symbolid,acSymbolsObj } = this.props;
   this.getPositon(positionInfos,symbolid);
   this.setState({products:this.getProducts(acSymbolsObj[account_type.accountTypeTd])});
  }

  componentWillReceiveProps(nextProps){
    const { positionInfos,symbolid,acSymbolsObj } = nextProps;
    if(this.props.positionInfos !== positionInfos || this.props.symbolid !== symbolid){
        this.getPositon(positionInfos,symbolid);
    }
    if(this.props.acSymbolsObj !== acSymbolsObj){
      this.setState({products:this.getProducts(acSymbolsObj[account_type.accountTypeTd])});
    }
  }

  getPositon = (positionInfos,symbolid) => {
    if(positionInfos && positionInfos.length > 0){
      let pos = {};
      for(let i = 0; i < positionInfos.length; i++){
          if(positionInfos[i].symbolid === symbolid && positionInfos[i].status === position_status.opened){
             pos[positionInfos[i].direction] = positionInfos[i];
          }
      }
      this.setState({currentPositions: pos,symbol:symbolid});
    }
    else{
      this.setState({symbol:symbolid});
    }
  }

  getProducts = (symbols ={}) => {
    return Object.values(symbols).map(item => {
      return {name:item.name,value:item.id};
    })
  }
  _getMax = () => {
    const { acSymbolsObj } = this.props;
    const { direction, currentPositions,symbol } = this.state;
    const obj = currentPositions[direction] || {};
    const avail = parseFloat(obj.amount_available || 0);
    const sobj = acSymbolsObj[account_type.accountTypeTd][symbol] || {};
    return avail.toFixed(sobj.digits_amount || 8);
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
    this.props._updateAmount(this._getMax());
  };
  _createDeliverRequest = ({ amount }) => {
    const {  _createDeliver ,_removeTemplate} = this.props;
    const { direction, currentPositions} = this.state;
    _createDeliver({
      positionid: currentPositions[direction] && currentPositions[direction].id || 0,
      amount: Number(amount).toString(),
    }).then((result) => {
      if(result){
        _removeTemplate();
      }
    });
  };

  onChange = (value) => {
   this.setState({direction:value});
  }
  proudctOnChange = (value) => {
    this.getPositon(this.props.positionInfos,value);
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
          onSubmit={this._createDeliverRequest}
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
                onChange={this.onChange}
                arr={dirArr}
                defaultValue={direction}
                options={{align:"left"}}
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
export default SettleForm