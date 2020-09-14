import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Big from 'big.js';
import { FormattedMessage } from 'umi-plugin-locale';
import classnames from 'classnames';
import {  Link } from 'react-router-dom';
import SwitchBar from '@/components/switch-bar';
import ExBalance from './ex';
import TDBalance from './td';
import { symbol_type, account_type, asset_status, kyc_status } from '../../../common/constant-enum'
import { acCurrency }  from '../../../common/constants';
import stringifyVolumn from '@/utils/format';
import { getSymbolStartPrice, getPrice } from '../../../utils/wallet';
import styles from './styles.scss';
import common from '@/css/common.scss';
import eyeCloseIn from '@/assets/eye-close-in.png';
import eyeOpenIn from '@/assets/eye-open-in.png';
import { getSessionStore } from '../../../utils/storage'
@connect(
 state => ({
    accountInfos:state.Account.accountInfos,
    balanceInfos:state.Account.balanceInfos,
    currencyInfos:state.Account.currencyInfos,
    symPairPriceObj: state.ws.symPairPriceObj,
    showAsset: state.AcCenter.showAsset,
    acSymbolsObj: state.global.acSymbolsObj,
    userInfo:state.Account.userInfo,
    rates:state.global.rates
  }),
  dispatch => ({
    _showDepositModal: coin =>{
       let vb = '50000';
       if(coin.indexOf('USD') === -1 ){
          vb = '50';
       }
       dispatch({
         type:'global/testIncBalance',
         payload:{mobile:getSessionStore('userInfo').mobile,name:coin,change:vb,type:'ex'}
       })
       dispatch({
        type: 'Notification/changeTemplate',
        payload: { type: 'deposit', coin: coin },
      })
    },
    _showAllWithdrawModal: coin =>
      dispatch({
        type: 'Notification/changeTemplate',
        payload: { type: 'withdraw', coin: coin },
      }),
    _showTransferModal: () => {
      dispatch({ type: 'Notification/changeTemplate', payload: {type:'transfer'} })
    } ,
    _showLockModal: coin =>
      dispatch({
        type: 'Notification/changeTemplate',
        payload: { type: 'lock', coin: coin },
    }),
    _showUnLockModal: coin =>
      dispatch({
        type: 'Notification/changeTemplate',
        payload: { type: 'unLock', coin: coin },
    }),
    toggleShowAsset: (isShow) => {
      dispatch({ type: 'AcCenter/toggleShowAsset', payload: isShow })
    },
    _getRates: () => {
      dispatch({type:'global/fetchRates'});
    }
  })
)
class Balance extends PureComponent {
  state ={
    chose:account_type.accountTypeEx, 
  };
  componentWillMount(){
    this.props._getRates();
  }
  render() {
    const {
      _showDepositModal,
      _showAllWithdrawModal,
      _showLockModal,
      _showUnLockModal,
      balanceInfos,
      currencyInfos,
      _showTransferModal,
      showAsset,
      toggleShowAsset,
      userInfo,
    } = this.props;
    const { chose } = this.state;
    let totalObj = this._getTotal();
    const nowAcUSDGAssets = totalObj[chose];
    const totalUSDGAssets = this._getAcTotal(totalObj);
    const currentBalanceInfos = balanceInfos[chose] || {}; 
    const currencyInfo = currencyInfos[acCurrency] || {};
    const isShowAsset = showAsset === asset_status.show;
    return (
      <div className={classnames(common.container, styles.container)}>
        <div className={styles.balance}>
          <div className={styles.balance_title} style={{border:'none'}}>
            <div className={styles.balance_title_left}>
              <div className={styles.balance_title_sub}> <FormattedMessage id="acTotalDesc" /></div>
              <span className={styles.balance_amount}> 
                {isShowAsset ? stringifyVolumn(totalUSDGAssets, currencyInfo.digits) : '*****'} {acCurrency}
                <img src={ isShowAsset ? eyeOpenIn : eyeCloseIn  } onClick={() => {
                  toggleShowAsset(isShowAsset ? asset_status.hidden : asset_status.show);
                }}/>         
              </span>   
            </div>
            <div className={styles.balance_title_right}>
              <a className={styles.balance_title_recLink} onClick={() =>{_showTransferModal()}}> <FormattedMessage id="transfer"/></a>
              <Link className={styles.balance_title_recLink} to="/ac/deliverDeclare"> <FormattedMessage id="jiaoshouApply"/></Link>
              {userInfo.is_neutral && <Link className={styles.balance_title_recLink} to="/ac/neutralDeclare"> <FormattedMessage id="zlcApply"/></Link>}
              <Link to="/ac/account/transferHistory" className={styles.balance_title_recLink}> <FormattedMessage id="transferRec"/></Link>
            </div>
          </div>
          <div className={styles.SwitchBarBOx}>
            <SwitchBar
                chose={`acType${chose}`}
                arr={[`acType${account_type.accountTypeEx}`, `acType${account_type.accountTypeTd}`]}
                onClick={item => this._handleAcChange(item)}
            />
          </div>
          { chose=== account_type.accountTypeEx &&
           <ExBalance 
            currencyInfos={currencyInfos}  
            nowAcUSDGAssets={ nowAcUSDGAssets} 
            currentBalanceInfos = {currentBalanceInfos} 
            _showDepositModal={_showDepositModal}
            _showAllWithdrawModal={_showAllWithdrawModal}
            _showUnLockModal={_showUnLockModal}
            _showLockModal={_showLockModal}
            isShowAsset={isShowAsset}
            />
          }
          { chose=== account_type.accountTypeTd &&
           <TDBalance 
            nowAcUSDGAssets={ nowAcUSDGAssets} 
            isShowAsset={isShowAsset}
            />            
          }
        </div>
      </div>
    );
  }

  _handleAcChange = item => {
    let chose = '';
    switch(item){
      case `acType${account_type.accountTypeEx}`:{
        chose = account_type.accountTypeEx;
        break;
      }
      case `acType${account_type.accountTypeTd}`:{
        chose = account_type.accountTypeTd;
        break;
      }
    }
    if(chose){
      this.setState({ chose});
    }
  }

  //账户的USDG列表
  _getTotal() {
    const { balanceInfos } = this.props;
    let total = {},ta=0,tf=0,balances,price;
    let keys = Object.keys(balanceInfos);
    if(keys){
      for(let i = 0 ; i < keys.length; i++){
        ta = 0 ;
        tf = 0;
        total[keys[i]] = {};
        balances = Object.values(balanceInfos[keys[i]] || {});
        for(let j = 0; j < balances.length; j++){  
         price = this.getCurrencyPairPrice(balances[j].name,acCurrency,keys[i]); 
         ta +=  parseFloat(new Big(parseFloat(balances[j].amount || 0)).times(price));
         tf +=  parseFloat(new Big(parseFloat(balances[j].frozen_order || 0)+parseFloat(balances[j].frozen_deliver || 0)+parseFloat(balances[j].frozen_withdraw || 0)).times(price));
        }
        total[keys[i]].amount = ta;//单账户总余额
        total[keys[i]].frozen = tf;//单账户总冻结
      }
    }
    return total;
  }
  //用户总资产
  _getAcTotal(totalObj){
    let total =0;
    if(totalObj){
      total = Object.keys(totalObj || {}).reduce((t, key) =>{
        return t += totalObj[key].amount;
      }, 0)
    }
    return total;
  }

  getCurrencyPairPrice = (pair = acCurrency ,currency = acCurrency,type) => {
    const { symPairPriceObj,acSymbolsObj,rates = {} } = this.props;
    let price = 1;
    if(pair !== currency){
        let sysType=0;
        switch(parseInt(type)){
          case account_type.accountTypeEx:{
            sysType = symbol_type.ex;
            break;
          }
          case account_type.accountTypeTd:{
            sysType = symbol_type.td;
            break;
          }
        } 
        price = getPrice(pair,currency,symPairPriceObj[sysType] || {});//得到行情价
        if(price === -1 ){
          price = getPrice(pair,currency,rates);//得汇率价
          if(price === -1){
            price = getSymbolStartPrice(pair, currency, Object.values(acSymbolsObj[sysType] || {}));//得到初始价
          }          
        }
     }
    return price;
  }
}
export default  Balance 