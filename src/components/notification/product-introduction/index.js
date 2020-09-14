/* eslint-disabled */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi-plugin-locale';
import FreeScrollBar from 'react-free-scrollbar';
import { symbol_type } from '../../../common/constant-enum'
import close from '@/assets/close.png';
import styles from './styles.scss';
import { symbol } from 'prop-types';

@connect(
  state => ({
    order: state.Notification.order,
    locale: state.Intl.locale
  })
)
class ProductIntroduction extends PureComponent {
  removeTemplate = () =>{
    this.props.dispatch({type:'Notification/changeTemplate'})
  }
  render() {
    const { symbolInfo, locale } = this.props;
    return (<div className={styles.confirm} style={{ width: '100%' }}>
          <div className={styles.confirm_header}>
            <span>
              {symbolInfo.name}
            </span>
            <span
              className={styles.confirm_header_close}
              onClick={this.removeTemplate}
            >
              <img src={close} alt="close" />
            </span>
          </div>
          <div
            className={styles.confirm_body}
            style={{width: '400px', height: '330px',padding: '30px 0 30px 30px' }}
          >
            <FreeScrollBar>
            <ul>
              <li>
                <FormattedMessage id="tradeSymbol"/>
                {symbolInfo.currency_quantity}
              </li>
              <li>
                <FormattedMessage id="tradeCode"/>
                {symbolInfo.name}
              </li>
              <li>
                <FormattedMessage id="tradeStyle"/>
                { symbolInfo.type === symbol_type.ex ? <FormattedMessage id="exchange"/> : <FormattedMessage id="exchange-td"/>}
              </li>
              <li>
                <FormattedMessage id="singleMinBuyVol"/>
                {symbolInfo.amount_buy_min}
              </li>
              <li>
                <FormattedMessage id="singleMinSellVol"/>
                {symbolInfo.amount_sell_min}
              </li>
              <li>
                <FormattedMessage id="singleMaxBuyVol"/>
                {symbolInfo.amount_buy_max}
              </li>
              <li>
                <FormattedMessage id="singleMaxSellVol"/>
                {symbolInfo.amount_sell_max}
              </li>
              <li>
                <FormattedMessage id="singleMinBuyAmt"/>
                {symbolInfo.volume_buy_min}
              </li>
              <li>
                <FormattedMessage id="singleMinSellAmt"/>
                {symbolInfo.volume_sell_min}
              </li>
              <li>
                <FormattedMessage id="singleMaxBuyAmt"/>
                {symbolInfo.volume_buy_max}
              </li>
              <li>
                <FormattedMessage id="singleMaxSellAmt"/>
                {symbolInfo.volume_sell_max}
              </li>
              {symbolInfo.type === symbol_type.ex && <Fragment><li>
                <FormattedMessage id="orderFee"/>
                {symbolInfo.maker_fee_percent}{formatMessage({id:"wangFen"})}
              </li>
              <li>
                <FormattedMessage id="closeFee"/>
                {symbolInfo.taker_fee_percent}{formatMessage({id:"wangFen"})}
              </li>
               </Fragment>
              } 
              {
                symbolInfo.type === symbol_type.td && <Fragment>
                <li>
                <FormattedMessage id="marginTimes"/>
                {(symbolInfo.levers || []).map(item => item+' ')}
                </li>
                <li style={{color:"rgba(155,172,210,0.5)"}}>
                  {formatMessage({id:"openCloseFee"})}{formatMessage({id:"wangFen"})}
                </li>
                <li>
                  <FormattedMessage id="openBuyFee"/>
                  {symbolInfo.open_buy_fee_percent}
                </li>
                <li>
                  <FormattedMessage id="openSellFee"/>
                  {symbolInfo.open_sell_fee_percent}
                </li>
                <li>
                  <FormattedMessage id="closeBuyFee"/>
                  {symbolInfo.close_buy_fee_percent}
                </li>
                <li>
                  <FormattedMessage id="closeSellFee"/>
                  {symbolInfo.close_sell_fee_percent}
                </li>
                <li style={{color:"rgba(155,172,210,0.5)"}}>
                  {formatMessage({id:"deliverFee"})}{formatMessage({id:"wangFen"})}
                </li>
                <li>
                  <FormattedMessage id="buyFeePercent"/>
                  {symbolInfo.deliver_buy_fee_percent}
                </li>
                <li>
                  <FormattedMessage id="sellFeePercent"/>
                  {symbolInfo.deliver_sell_fee_percent}
                </li>
                <li>
                  <FormattedMessage id="reverseBuyFeePercent"/>
                  {symbolInfo.deliver_reverse_buy_fee_percent}
                </li> 
                <li>
                  <FormattedMessage id="reverseSellFeePercent"/>
                  {symbolInfo.deliver_reverse_sell_fee_percent}
                </li> 
                <li>
                  <FormattedMessage id="neutralBuyFeePercent"/>
                  {symbolInfo.neutral_buy_fee_percent}
                </li> 
                <li>
                  <FormattedMessage id="neutralSellFeePercent"/>
                  {symbolInfo.neutral_sell_fee_percent}
                </li>   
                <li>
                  <FormattedMessage id="deferFee"/>
                  {symbolInfo.defer_fee_percent}
                </li>          
                </Fragment>
              }                                                                      
            </ul>           
            </FreeScrollBar>
          </div>
        </div>
    );
  }
}
export default ProductIntroduction