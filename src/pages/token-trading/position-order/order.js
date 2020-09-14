import React, { Component } from 'react';
import { FormattedMessage } from 'umi-plugin-locale';
import { connect } from 'dva';
import Table from '@/components/table';
import stringifyVolumn from '@/utils/format';
import { dir } from '../../../common/constant-enum';
import { buyColor, sellColor } from '@/common/color';
import styles from '../trading-order/styles.scss'
import { tabColor, mainColor } from '../../../common/color';
@connect(state =>({
  currencyInfos:state.Account.currencyInfos
}))
class PositionOrder extends Component {
  _getColumns = () => {
    const {
      currencyInfos,
      symbolsObj,
      ticker,
      opt=false
    } = this.props;
    let columns = [
      {
        title: <FormattedMessage id="product" />,
        key: 'symbol',
        align: 'left',
      },
      {
        title: <FormattedMessage id="direction" />,
        key: 'direction',
        align: 'right',
        render: (Side, item) => (
          <span style={{ color: Side === dir.sell ? sellColor : buyColor }}>
           <FormattedMessage id={Side === dir.sell ?  (opt? 'sell':'sell_side') : (opt?'buy':'buy_side')} />
          </span>
         ),
      },
      {
        title: <FormattedMessage id="openPrice" />,
        key: 'open_price',
        align: 'left',
        render: (text, item) => (
          <span>{stringifyVolumn(text || 0,symbolsObj[item.symbolid] && symbolsObj[item.symbolid].digits_price)}</span>
        ),
      },
      {
        title: <FormattedMessage id="available" />,
        key: 'amount_available',
        align: 'right',
        render: (value, item) => {
          const digits = symbolsObj[item.symbolid] && symbolsObj[item.symbolid].digits_amount;
          return <span>{stringifyVolumn(value || 0, digits)}</span>;
        },
      },
      {
        title: <FormattedMessage id="cPositon" />,
        key: 'amount',
        align: 'right',
        render: (text, item) => (
          <span>{stringifyVolumn(text || 0,symbolsObj[item.symbolid] && symbolsObj[item.symbolid].digits_amount)}</span>
        ),
      },
      {
        title: <FormattedMessage id="pFrozen" />,
        key: 'frozen',
        align: 'right',
        render: (text, item) => {
          let currencyInfo = currencyInfos && symbolsObj[item.symbolid] && currencyInfos[symbolsObj[item.symbolid].currency_price] || {}
          return <span>{stringifyVolumn(text || 0,currencyInfo.digits)}</span>
        },
      },
      {
        title: <FormattedMessage id="profit" />,
        key: 'profit',
        align: 'right',
        render: (text, item) => {
          const price = parseFloat(ticker[item.symbolid] && ticker[item.symbolid].price) || 0;
          const direction = item.direction === dir.sell ? -1 : 1;
          const t = (price - parseFloat(item.open_price)) * (parseFloat(item.amount || 0)-parseFloat(item.amount_deliver || 0)) * direction;
          let currencyInfo = currencyInfos && symbolsObj[item.symbolid] && currencyInfos[symbolsObj[item.symbolid].currency_price] || {}
          return <span style={{ color: t > 0 ? buyColor : (t < 0  ? sellColor :tabColor)}}>{stringifyVolumn(t || 0, currencyInfo.digits)}</span>
        }
      },
      {
        title: <FormattedMessage id="nowPrice" />,
        key: 'nowPrice',
        align:'right',
        render: (text, item) => (
          <span>{stringifyVolumn(ticker[item.symbolid] && ticker[item.symbolid].price,symbolsObj[item.symbolid] && symbolsObj[item.symbolid].digits_price)}</span>
        ),
      }
    ];
    if(opt){
      columns.push({
        title: <FormattedMessage id="operation" />,
        align: 'right',
        key: 'opt',
        render: (value, item) => {      
          let avai = parseFloat(item.amount_available || 0);  
          return (
              <div className={styles.opt_link}>                          
                  <a     
                    style={{color: avai > 0 ? mainColor : tabColor }}        
                    onClick={() => {
                      if(avai > 0){
                        this.props.dispatch({type:'ws/changeQuoteRequest',payload:item.symbolid});
                        this.props.dispatch(require('dva').routerRedux.push('/exchange-td/closePosition'));
                      }                 
                    }}
                  >
                    <FormattedMessage id="closePosition" />
                  </a>                                                          
              </div>
            );         
        }
      })
    }
    return columns;
  };
 
  render() {
    const {
      positions,
    } = this.props;
  
    const columns = this._getColumns();
    return (
      <Table
        placeholder={<FormattedMessage id="no_record" />}
        minWidth={700}
        columns={columns}
        data={positions}
      />
    );
  }
}
export default  PositionOrder