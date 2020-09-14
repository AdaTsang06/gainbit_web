/* eslint react/no-multi-comp:0, no-console:0 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { withRouter } from 'react-router-dom';
import { IntlProvider, FormattedMessage } from 'umi-plugin-locale';
import Form from '../../components/form';
import ActionButton from '../../components/action-button';

import SwitchBar from '../../components/switch-bar';
import Order from './order';
import Selects from '../../components/selects';
import TimeRange from '../../components/time-range';
import { dirSel, orderStatusSel, orderTypeSel } from '../../common/search-item';
import styles from './styles.scss';
import common from '../../css/common.scss';
import classnames from 'classnames';
import messages from './messages';
import { account_type } from '../../common/constant-enum';
import { getAccountId, getFormat } from '../../utils/util';

const SHOW_TIME = false;

@withRouter
@connect(
  state => ({
    accountInfos: state.Account.accountInfos,
    locale: state.Intl.locale,
    acSymbolsObj: state.global.acSymbolsObj
  })
)
class MyEntrust extends Component {
  constructor(props) {
    super(props);
    this.state = {
    chose: account_type.accountTypeEx,
    acId:0,
    subChose: 'pending_orders',
    startValue: null,
    endValue: null,
    start: 0,
    end: 0,
    symbolid: '',
    orderStatusNow: orderStatusSel[0].value,
    orderTypeNow: orderTypeSel[0].value,
    dirNow: dirSel[0].value,
    init:true
    };
    this._paginationCallback = this._paginationCallback.bind(this);
  }
  componentWillMount() {
    const { match } = this.props;
    let acType = parseInt(match.params.acType || account_type.accountTypeEx);
    this.setState({acId:this.getAccountId(acType), chose: acType },() => {
      this._entrustSearch();
    })
  }
  
   
  getAccountId = (chose) => {
    const { accountInfos } = this.props;
    return getAccountId(chose,accountInfos);
  }
 
  cancelOrder =  id => {
    this.props.dispatch({type:'orderManage/cancelOrder',payload:{accountid:this.state.acId,orderid:id},
    callBack:() => {
        this._entrustSearch();
    }})
  };

  _handleOrdersChange = item => {  
    let obj = { symbolid: '', start: 0, end: 0, startValue: null, endValue: null, dirNow: dirSel[0].value,orderTypeNow: orderTypeSel[0].value,orderStatusNow: orderStatusSel[0].value}
    switch(item){
      case `acType${account_type.accountTypeEx}`:{
        this.setState({ ...obj, chose: account_type.accountTypeEx, acId: this.getAccountId(account_type.accountTypeEx)},() => {
          this._entrustSearch();
        });
        break;
      }
      case `acType${account_type.accountTypeTd}`:{
        this.setState({ ...obj, chose: account_type.accountTypeTd,acId: this.getAccountId(account_type.accountTypeTd)},()=>{
          this._entrustSearch();
        });    
        break;
      }
    }
  };
  _subHandleOrdersChange = item => {
    this.setState({ symbolid: '', start: 0, end: 0, startValue: null, endValue: null, dirNow: dirSel[0].value,orderTypeNow: orderTypeSel[0].value,orderStatusNow: orderStatusSel[0].value,subChose: item},() => {
      this._entrustSearch();
    });
  };
  _paginationCallback = offset => {
    const { symbolid, dirNow,start, end } = this.state;
    const paramsObj = {
      symbolid: symbolid,
      direction: dirNow && dirNow === '' ? dirSel[0].value : dirNow,
      start_time : start,
      end_time: end,
      skip: offset,
    };
    this.toSearch(paramsObj);
  };
  onChange = (field, value) => {
    let time1 = 0;
    if(value){
       let time = value.format(getFormat(SHOW_TIME)).replace(/-/g,'/');
       time1 = new Date(time).getTime() / 1000;
    }
    if(field === 'startValue'){
      this.setState({start: time1, [field]: value});
    }else if(field === 'endValue'){
      this.setState({end: time1 ? time1 + 24 * 60 * 60 : 0, [field]: value});
    }
  };
  _onDepthChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };
  _entrustSearch = () => {
    const { symbolid, dirNow, start, end } = this.state;
    const paramsObj = {
      symbolid: symbolid,
      direction: dirNow && dirNow === '' ? dirSel[0].value : dirNow,
      start_time: start,
      end_time: end,
      skip: 0
    };
    this.setState({init : true},() => {
      this.setState({init : false})
    });
    this.toSearch(paramsObj);
  };
  
  toSearch = (paramsObj) => {
    const { subChose, orderStatusNow, orderTypeNow, acId } = this.state;
    let dtype ='';
    switch(subChose){
      case 'pending_orders':{
        paramsObj.type = orderTypeNow;
        dtype ='orderManage/getPlaced';
        break;
      }
      case 'order_history':{
        paramsObj.type = orderTypeNow;
        paramsObj.status = orderStatusNow;
        dtype ='orderManage/getHistory';
        break;
      }
      case 'deal_order':{
        dtype ='orderManage/getDeal';
        break;
      }
      case 'position_order':{
        dtype ='orderManage/';
        break;
      }
    }
    for(let key in paramsObj){
      if(!paramsObj[key]) delete paramsObj[key];
    }
    paramsObj.accountid  = acId;
    paramsObj.limit = 10;
    this.props.dispatch({type:dtype,payload:paramsObj}) ;
  }

  showDetail = (id) => {
    const { dispatch } = this.props;
    const { acId } = this.state;
    dispatch({type:'orderManage/getOrderDeal',payload:{orderid: id, accountid: acId}})
  }

  render() {
    const {   
      locale,
      acSymbolsObj,
    } = this.props;
    const {
      chose,
      subChose,
      dirNow,
      orderStatusNow,
      symbolid,
      orderTypeNow,
      init
    } = this.state;   
    const subArr = ['pending_orders', 'order_history','deal_order'];
    const symbolArr = Object.values(acSymbolsObj[chose]) || [];
    const symSelects = symbolArr.map(item => {
          return {value: item.id, name: item.name}
    });
    symSelects.unshift({value:'',name:<FormattedMessage id='all'/>})
    // if(chose === account_type.accountTypeTd){
    //   subArr.unshift('all_position');
    // }
    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div className={classnames(common.container, styles.container)}>
          <div className={styles.myEntrust}>
            <div className={classnames(styles.myEntrust_label,styles.myEntrust_label_ac)}>
             <SwitchBar           
                chose={`acType${chose}`}
                arr={[`acType${account_type.accountTypeEx}`, `acType${account_type.accountTypeTd}`]}
                onClick={item => this._handleOrdersChange(item)}
              />
            </div>
            <div className={styles.myEntrust_label}>
              <SwitchBar              
                chose={subChose}
                arr={subArr}
                onClick={item => this._subHandleOrdersChange(item)}
              />
            </div>
            <Form
                  className={styles.formSearch}
                  onSubmit={this._entrustSearch}
                  action={() => <ActionButton id="submit" />}
                  form="myEntrustForm"
                >
                  <div className={styles.formSearch_item}>
                    <FormattedMessage id="product" />
                    <Selects
                      width={170}
                      name="symbolid"
                      onChange={this._onDepthChange.bind(this, 'symbolid')}
                      arr={symSelects}
                      defaultValue={symbolid}
                    />
                  </div>
                  <div className={styles.formSearch_item}>
                    <FormattedMessage id="side" />
                    <Selects
                      width={140}
                      name="direction"
                      onChange={this._onDepthChange.bind(this, 'dirNow')}
                      arr={dirSel}
                      defaultValue={dirNow}
                    />
                  </div>
                  {subChose === 'order_history' && (<div className={styles.formSearch_item}>
                    <FormattedMessage id="status" />
                    <Selects
                      width={140}
                      name="status"
                      onChange={this._onDepthChange.bind(this, 'orderStatusNow')}
                      arr={orderStatusSel}
                      defaultValue={orderStatusNow}
                    />
                  </div>)}
                  {(subChose === 'pending_orders' || subChose === 'order_history') && (<div className={styles.formSearch_item}>
                    <FormattedMessage id="type" />
                    <Selects
                      width={140}
                      name="type"
                      onChange={this._onDepthChange.bind(this, 'orderTypeNow')}
                      arr={orderTypeSel}
                      defaultValue={orderTypeNow}
                    />
                  </div>)}
                  <div className={styles.formSearch_item}>
                    <FormattedMessage id="dateChoose" />
                    <TimeRange startValue={this.state.startValue} endValue={this.state.endValue} onChange={this.onChange}/>
                  </div>
            </Form>
            <Order
              acType={chose}
              type={subChose}
              cancelOrder={this.cancelOrder}           
              _paginationCallback={this._paginationCallback}
              showDetail={this.showDetail}
              symbolsObj={acSymbolsObj[chose]}
              init={init}
            />
          </div>
        </div>
      </IntlProvider>
    );
  }
}
export default MyEntrust