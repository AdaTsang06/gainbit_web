import React, { Component } from 'react';
import { FormattedMessage } from 'umi-plugin-locale';
import Table from '@/components/table';
// import formatDate from '@/utils/format-date';
// import stringifyVolumn from '@/utils/format';
import { buyColor, sellColor, tabColor, acTabColor } from '@/common/color';
import { order_type, dir, orderMap, order_status_reverse,  order_reason, order_reason_reverse, account_type } from '../../../common/constant-enum';
import styles from './styles.scss';

const getOpenOrdersColumn = (
  symbolInfo,
  cancelOrder
) => {
  // const getQuantityFixed =  symbolInfo.digits_amount;
  // const getPriceFixed = symbolInfo.digits_price;
  return [
  // {
  //   title: <FormattedMessage id="date" />,
  //   key: 'created_at',
  //   align: 'left',
  //   render: Created => <span>{formatDate(Created * 1000, 1)}</span>,
  // },
  {
    title: <FormattedMessage id="side" />,
    key: 'direction',
    align: 'left',
    render: (Side, item) => (
      <div>
        {item.reason > 0 && <FormattedMessage id={order_reason_reverse[item.reason]}/>} &nbsp;
        <span style={{ color: Side === dir.sell ? sellColor : buyColor }}>
          <FormattedMessage id={Side === dir.sell ? 'sell_side' : 'buy_side'} />
        </span>
      </div>
    ),
  },
  {
    title: <FormattedMessage id="type" />,
    key: 'type',
    align: 'right',
    render: value => <FormattedMessage id={orderMap[value]}/>,
  },
  {
    title: <FormattedMessage id="request_price" />,
    key: 'request_price',
    align: 'right',
    render: (Price, item) => {
      const { type } = item;
      return (
        <span>
          {type === order_type.market ? (
           '--'
          ) : (
            `${Price} ${symbolInfo.currency_price}`
          )}
        </span>
      );
    },
  },
  {
    title: <FormattedMessage id="request_amount" />,
    key: 'request_amount',
    align: 'right',
    render: (value,item) =>{
      let dom = '--';
      if(item.direction !== parseInt(dir.buy) || item.reason !==  order_reason.order_reason_non || item.type !== parseInt(order_type.market)){
        dom = `${item.request_amount} ${symbolInfo.currency_quantity}`;
      }
      return dom;
    }
  },
  {
    title: <FormattedMessage id="request_e" />,
    key: 'request_e',
    align: 'right',
    render: (value,item) =>{
      let dom = '--';
      if(item.reason ===  order_reason.order_reason_non && item.type === parseInt(order_type.market) && item.direction === parseInt(dir.buy)){
        dom = `${item.request_amount} ${symbolInfo.currency_price}`;
      }
      return dom;
    }
  },
  {
    title: <FormattedMessage id="avg_price" />,
    key: 'execute_price',
    align: 'right',
    render: (value, item) => {
      return (
        <span>
          {/* {`${stringifyVolumn(value, getPriceFixed)} ${symbolInfo.currency_price}`} */}
          {`${value} ${symbolInfo.currency_price}`}
        </span>
      );
    },
  },
  {
    title: <FormattedMessage id="filled_amount" />,
    key: 'execute_amount',
    align: 'right',
    render: (value, item) => {
      let dom = value;
      if(item.reason ===  order_reason.order_reason_non && item.type === parseInt(order_type.market) && item.direction === parseInt(dir.buy)){
        dom = item.buy_market_amount;
      }
      return (
        <span>
          {/* {`${stringifyVolumn(dom, getQuantityFixed)} ${symbolInfo.currency_quantity}`} */}
          {`${dom} ${symbolInfo.currency_quantity}`}
        </span>
      );
    },
  },
  // {
  //   title: <FormattedMessage id="order_deal" />,
  //   key: 'execute_volume',
  //   align: 'right',
  //   render: (value, item) => {
  //     return (
  //       <span>
  //         {`${stringifyVolumn(value, getPriceFixed)} ${symbolInfo.currency_price}`}
  //       </span>
  //     );
  //   },
  // },
  // {
  //   title: <FormattedMessage id="status" />,
  //   key: 'status',
  //   align: 'right',
  //   render: value => (
  //     <span style={{ color: value === 2 ? '#3EB87D' : tabColor }}>
  //       <FormattedMessage id={order_status_reverse[value]}/>
  //     </span>
  //   ),
  // },
  {
    title: <FormattedMessage id="operation" />,
    key: 'operating',
    align: 'right',
    render: (key, item) => (
      <div className={styles.opt_link}>
        <a
          style={
            {
              color:item.reason !== order_reason.force_close_position ? acTabColor : tabColor
            }
            }
          onClick={() => {
            if(item.reason !== order_reason.force_close_position)
            cancelOrder(item.id);
          }
          }
        >
          <FormattedMessage id="cancel" />
        </a>
      </div>
    ),
  },
]};

class Order extends Component {
 
  render() {
    const {
      symbolInfo,
      cancelOrder,
      orders,
    } = this.props;
    let data = orders.sort((a, b) => {
      if (a.Timestamp > b.Timestamp) return -1;
      if (a.Timestamp < b.Timestamp) return 1;
      return 0;
    });
    const columns = getOpenOrdersColumn(
      symbolInfo,
      cancelOrder
    );
    return (
      <Table
        placeholder={<FormattedMessage id="no_record" />}
        minWidth={700}
        columns={columns}
        data={data}
      />
    );
  }
}
export default  Order