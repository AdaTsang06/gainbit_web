import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-locale';
import ReactTooltip from 'react-tooltip';
import classnames from 'classnames';
import { symbol_type, position_status} from '../../../common/constant-enum'
import { acCurrency }  from '../../../common/constants';
import PositionOrder from '../../token-trading/position-order/order';
import stringifyVolumn from '../../../utils/format';
import {big2} from '../../../utils/calculate';
import { getTotalProfitAndFrozen } from '../../../utils/wallet';
import { sellColor, buyColor } from '../../../common/color';
import styles from './styles.scss';
import { now } from 'moment';

@connect(
  state => ({
    currencyInfos:state.Account.currencyInfos,
    warningLevel: state.Account.warningLevel,
    forceCloseLevel: state.Account.forceCloseLevel,
    positionInfos:state.Account.positionInfos,
    ticker: state.ws.ticker,
    acSymbolsObj: state.global.acSymbolsObj
}))
class TDBalance extends PureComponent {
  _getRiskLevel(riskLevel,forceCloseLevel) {
    const { positionInfos=[] } = this.props;
    const left = riskLevel > 1 ? 0 : (1 - riskLevel > 1 ? 1 : 1 - riskLevel);
    let signCurrStyle =<div>
           <div className={styles.riskLevel} style={{top:'25px',left: riskLevel > forceCloseLevel ? `${left*378 + 40}px` : `${left*378 - 55}px`}}>
              {positionInfos.length ? `${(riskLevel * 100).toFixed(2)}%` : ''}
            </div>
          <div className={styles.riskIco} style={{left: `${left * 100}%` }}/>
          </div>
    return signCurrStyle;
  }
  
  render() {       
    const {
      currencyInfos,
      nowAcUSDGAssets ={frozen:0},
      positionInfos=[],
      warningLevel, 
      forceCloseLevel,
      acSymbolsObj,
      ticker,
      isShowAsset      
    } = this.props;
    const currencyInfo = currencyInfos[acCurrency] || {};
    const totalProfitFrozen = getTotalProfitAndFrozen(positionInfos, ticker, currencyInfos);
    const profit = totalProfitFrozen.profit;//盈亏
    const frozen = parseFloat(nowAcUSDGAssets.frozen.toFixed(currencyInfo.digits));//冻结
    const profitAmout = big2('plus',  profit || 0, nowAcUSDGAssets.amount || 0, currencyInfo.digits);//净值
    let riskLevel = (positionInfos.length > 0 && totalProfitFrozen.margin && parseFloat(profitAmout)/(totalProfitFrozen.margin.toFixed(currencyInfo.digits))) || 1;
    const avail = big2('minus',  frozen || 0, profitAmout || 0, currencyInfo.digits);//可用
    const oFrozen = big2('minus',  (totalProfitFrozen.margin || 0).toFixed(currencyInfo.digits), frozen || 0, currencyInfo.digits);
    const swidth = warningLevel >= forceCloseLevel ? (1 - warningLevel) * 100 : (forceCloseLevel < 1 ? (1 - forceCloseLevel) * 100 : 0 );
    const wwidth = warningLevel >= forceCloseLevel ? (warningLevel - forceCloseLevel) * 100 : 0 ;
    const fwidth = forceCloseLevel < 1 ? forceCloseLevel * 100 : 100;
    if(!nowAcUSDGAssets.amount){
      riskLevel = 1;
    }
    let balanceTitleRight = (
      <div className={styles.balance_title_risk}>
        <div className={styles.balance_title_risk_header}>
          <FormattedMessage id="account_risks" />
          <a data-tip data-for="risks-tip">
            <span className={styles.balance_title_risk_add}>?</span>
          </a>
          <ReactTooltip
            place="left"
            id="risks-tip"
            type="dark"
            offset={{ left: 10 }}
            effect="solid"
          >
            <div className={styles.tooltip}>
              <FormattedMessage id="risk_tip1" />
            </div>
            <div className={styles.tooltip}>
              <FormattedMessage id="risk_tip2" />
            </div>
            <div className={styles.tooltip}>
              <FormattedMessage id="risk_tip3" values={{ warningLevel: warningLevel > forceCloseLevel ? warningLevel * 100 : forceCloseLevel * 100}} />
            </div>
            {warningLevel > forceCloseLevel && <div className={styles.tooltip}>
              <FormattedMessage id="risk_tip4" values={{ warningLevel: warningLevel * 100 }} />
            </div>}
            <div className={styles.tooltip}>
              <FormattedMessage id="risk_tip5" values={{ forceCloseLevel: forceCloseLevel * 100 }} />
            </div>
          </ReactTooltip>
        </div>
        <div className={styles.balance_sign}>
          {this._getRiskLevel(riskLevel,forceCloseLevel)}         
        </div>
        <div className={styles.balance_risk_visible}>
          {swidth > 0 && <div className={styles.balance_safety} style={{width: `${swidth}%` }}></div>}
          {wwidth > 0 && <div className={styles.balance_warn} style={{width: `${wwidth}%` }}></div>}
          <div className={styles.balance_strflat} style={{width: `${fwidth}%`}}></div>
        </div>
        <div className={styles.balance_risk_desc}>
         {swidth > 0 && <div style={{width: `${swidth}%` }}><FormattedMessage id="account_risks_safety"/></div>}
         {wwidth > 0 && <div style={{width: `${wwidth}%` }}><FormattedMessage id="account_risks_warn"/></div>}
         <div style={{width: `${fwidth}%`}}><FormattedMessage id="account_risks_strflat"/></div>
        </div>
      </div>
    );
    const positions = positionInfos.filter(item => {
      return item.status === position_status.opened;
    })
    return (
        <div>        
          <div className={styles.balance_title} style={{marginTop:'10px',paddingBottom:'22px'}}>
              <div>
                <div  className={styles.balance_title_sub}>
                  <FormattedMessage id="asset_worth" />
                </div>        
                <span className={styles.balance_amount1}> {isShowAsset ? stringifyVolumn(profitAmout || 0, currencyInfo.digits) : '*****'} {acCurrency}</span>           
              </div>
              <div>
                <div  className={styles.balance_title_sub}>
                  <FormattedMessage id="guarantee" />
                </div>        
                <span className={styles.balance_amount2}> {isShowAsset ? stringifyVolumn( totalProfitFrozen.margin || 0, currencyInfo.digits) : '*****'} {acCurrency}</span>           
              </div>
              <div>
                <div  className={styles.balance_title_sub}>
                  <FormattedMessage id="ofrozen" />
                </div>        
                <span className={styles.balance_amount2}> {isShowAsset ? stringifyVolumn( oFrozen || 0, currencyInfo.digits) : '*****'} {acCurrency}</span>           
              </div>
              <div>
                <div  className={styles.balance_title_sub}>
                  <FormattedMessage id="available" />
                </div>        
                <span className={styles.balance_amount2}> {isShowAsset ? stringifyVolumn(avail || 0, currencyInfo.digits) : '*****'} {acCurrency}</span>           
              </div>
              <div>
                <div  className={styles.balance_title_sub}>
                  <FormattedMessage id="profit" />
                </div>        
                <span className={styles.balance_amount2}> <span style={{ color:profit > 0 ? buyColor : (profit < 0 ? sellColor :'')}}>{isShowAsset ? stringifyVolumn( profit || 0, currencyInfo.digits) : '*****'}</span> {acCurrency}</span>           
              </div>
              { balanceTitleRight}        
          </div>
          <div className={classnames(
              styles.balance_section,
              styles.balance_section_first
            )}>         
            <PositionOrder ticker={ticker} positions={positions} symbolsObj={acSymbolsObj[symbol_type.td]} opt={true}/>
          </div>
        </div>
    );
  }
}
export default  TDBalance 