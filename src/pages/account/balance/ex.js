import React, { PureComponent, Fragment } from 'react';
import { FormattedMessage } from 'umi-plugin-locale';
import {  Link } from 'react-router-dom';
import { account_type, spot_status } from '../../../common/constant-enum'
import { acCurrency }  from '../../../common/constants';
import Table from '@/components/table';
import stringifyVolumn from '@/utils/format';
import {big2} from '../../../utils/calculate';
import styles from './styles.scss';
import classnames from 'classnames';
import { mainColor, tabColor } from '../../../common/color';

class ExBalance extends PureComponent {
  _getColumns = (isShowAsset) => {
    const {
      _showDepositModal,
      _showAllWithdrawModal,
      _showLockModal,
      _showUnLockModal
    } = this.props;
    let columnsItem;
    let columns = [
      {
        title: <FormattedMessage id="coin_type" />,
        key: 'name',
        align: 'left',
      },
      {
        title: <FormattedMessage id="total_balance" />,
        key: 'amount',
        align: 'right',
        render: (text, item) => (
          <span>{isShowAsset ? stringifyVolumn(text || 0, item.digits) : '*****'}</span>
        ),
      },
      {
        title: <FormattedMessage id="available" />,
        key: 'amount_available',
        align: 'right',
        render: (value, item) => {
          let digits = item.digits;
          return <span>{isShowAsset ? stringifyVolumn(value || 0, digits) : '*****'}</span>;
        },
      },
      {
        title: <FormattedMessage id="frozen" />,
        key: 'frozen',
        align: 'right',
        render: (text, item) => {
          let digits = item.digits;
          let frozen = big2('plus', parseFloat(item.frozen_order || 0), (parseFloat(item.frozen_deliver) || 0) + (parseFloat(item.frozen_withdraw) || 0), digits);
          return <span>{isShowAsset ? stringifyVolumn( frozen|| 0, digits) : '*****'}</span>;
        },
      },
      {
        title: <FormattedMessage id="lock" />,
        key: 'lock',
        align: 'right',
        render: (text, item) => {
          let digits = item.digits;
          return <span>{isShowAsset ? stringifyVolumn( text|| 0, digits) : '*****'}</span>;
        },
      },
    ];
    columnsItem = {
        title: <FormattedMessage id="operation" />,
        align: 'right',
        key: 'opt',
        render: (value, item) => { 
          const isDeposit = (item.status === spot_status.deposit_withdraw) || (item.status === spot_status.deposit_only);
          const isWithdraw = (item.status === spot_status.deposit_withdraw) || (item.status === spot_status.withdraw_only);
          return (
              <div className={styles.link}>     
                  {
                    (item.name || "").toUpperCase() === "GCT" && <Fragment>
                      <a 
                    style={{color: mainColor, cursor: 'pointer' }}             
                    onClick={() =>{
                      if(isDeposit){
                        _showLockModal(item.name);
                      }
                    } 
                  }
                  >
                    <FormattedMessage id="lock" />
                  </a>                                     
                 <a    
                    style={{color: isWithdraw ? mainColor : tabColor, cursor: isWithdraw ? 'pointer' : 'not-allowed'}}                          
                    onClick={() =>{
                      if(isWithdraw){
                        _showUnLockModal(item.name);
                      }
                     } }
                  >
                    <FormattedMessage id="unLock" />
                  </a>  
                    </Fragment>
                  }                     
                 <a 
                    style={{color: isDeposit ? mainColor : tabColor, cursor: isDeposit ? 'pointer' : 'not-allowed'}}             
                    onClick={() =>{
                      if(isDeposit){
                        _showDepositModal(item.name);
                      }
                    } 
                  }
                  >
                    <FormattedMessage id="deposit" />
                  </a>                                     
                 <a    
                    style={{color: isWithdraw ? mainColor : tabColor, cursor: isWithdraw ? 'pointer' : 'not-allowed'}}                          
                    onClick={() =>{
                      if(isWithdraw){
                        _showAllWithdrawModal(item.name);
                      }
                     } }
                  >
                    <FormattedMessage id="withdraw" />
                  </a>                                         
              </div>
            );
          
        },
    };
    columns.push(columnsItem);
    return columns;
  };

  getAssetList = () => {
    let assets = [],obj;
    const { currentBalanceInfos, currencyInfos } = this.props;
    let currencys = Object.values(currencyInfos);
    for(let i = 0; i < currencys.length; i++){
       obj = { ...currencys[i]};
       if(currentBalanceInfos[obj.name]){
        obj.amount =  currentBalanceInfos[obj.name].amount;
        obj.amount_available =  currentBalanceInfos[obj.name].amount_available
        obj.frozen_order = currentBalanceInfos[obj.name].frozen_order;//挂单冻结
        obj.frozen_deliver = currentBalanceInfos[obj.name].frozen_deliver;//交收冻结
        obj.frozen_withdraw = currentBalanceInfos[obj.name].frozen_withdraw;//取款冻结
        obj.lock = currentBalanceInfos[obj.name].lock;
       }
       assets.push(obj);
    }
    return assets;
  }
  render() {
    const {
      currencyInfos,
      nowAcUSDGAssets ={},
      isShowAsset,
    } = this.props;
    const currencyInfo = currencyInfos[acCurrency] || {};
    
    return (
        <div>        
          <div className={styles.balance_title} style={{paddingBottom:'24px'}}>
            <div>
              <div  className={styles.balance_title_sub}>
                <FormattedMessage id={`acType${account_type.accountTypeEx}`} />
                <FormattedMessage id="est_total_balance" />
              </div>        
              <span className={styles.balance_amount1}> {isShowAsset ? stringifyVolumn(nowAcUSDGAssets.amount || 0, currencyInfo.digits) : '*****'} {acCurrency}</span>           
            </div>
            <div className={styles.balance_title_right}>
              <Link to="/ac/account/coinsHistory" className={styles.balance_title_recLink}>
                  <FormattedMessage id="depoistWithdrawRec"/>
              </Link>
            </div>        
          </div>
          <div
            className={classnames(
              styles.balance_section,
              styles.balance_section_first
            )}
          >
            <Table
              placeholder={<FormattedMessage id="no_record" />}
              columns={this._getColumns(isShowAsset)}
              data={this.getAssetList()}
            />
          </div>
        </div>
    );
  }
}
export default  ExBalance 