import React, { Component } from 'react';
import { FormattedMessage } from 'umi-plugin-locale';
import { connect } from 'dva';
import Table from '../../components/table';
import formatDate from '../../utils/format-date';
import { buyColor, sellColor, mainColor, tabColor } from '../../common/color';
import { dir, orderMap, order_status_reverse, order_status, order_type, order_reason, order_reason_reverse, account_type } from '../../common/constant-enum';
import styles from './styles.scss'
const getOpenOrdersColumn = (tabType,cancelOrder,showDetail, symbolsObj ={}) => {
  let columns =[
  {
    title: <FormattedMessage id="product" />,
    key: 'symbol',
    align: 'left'
  },
  {
    title: <FormattedMessage id="side" />,
    key: 'direction',
    align: 'right',
    render: (Side,item) => (
      <div>
        {item.reason > 0 && order_reason_reverse[item.reason] && <FormattedMessage id={order_reason_reverse[item.reason]}/>} &nbsp;
        <span style={{ color: Side === dir.sell ? sellColor : buyColor }}>
          <FormattedMessage id={Side === dir.sell ? 'sell' : 'buy'} />
        </span>
      </div>
    ),
  },
  {
    title: <FormattedMessage id="type" />,
    key: 'type',
    align: 'right',
    render: value => {
    if(orderMap[value]){
      return <FormattedMessage id={orderMap[value]}/>
    }
    return '';
},
  },
  {
    title: <FormattedMessage id="request_price" />,
    key: 'request_price',
    align: 'right',
    render: (value,item) =>{
      let dom = '--';
      if(item.type !== parseInt(order_type.market)){
        dom = item.request_price;
      }
      return dom;
    }
  },
  {
    title: <FormattedMessage id="request_amount" />,
    key: 'request_amount',
    align: 'right',
    render: (value,item) =>{
      let dom = '--';
      if(item.direction !== parseInt(dir.buy) || item.reason !==  order_reason.order_reason_non || item.type !== parseInt(order_type.market)){
        dom = item.request_amount;
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
        dom = item.request_amount;
      }
      return dom;
    }
  },
  {
    title: <FormattedMessage id="avg_price" />,
    key: 'execute_price',
    align: 'right'
  },
  {
    title: <FormattedMessage id="filled_amount" />,
    key: 'execute_amount',
    align: 'right',
    render:(value, item) => {
      let dom = value;
      if(item.reason ===  order_reason.order_reason_non && item.type === parseInt(order_type.market) && item.direction === parseInt(dir.buy)){
        dom = item.buy_market_amount;
      }
      return dom;
    }
  },
  {
    title: <FormattedMessage id="order_deal" />,
    key: 'execute_volume',
    align: 'right'
  },
  {
    title: <FormattedMessage id="status" />,
    key: 'status',
    align: 'right',
    render: value =>{
      if(value && order_status_reverse[value]){
         return (
        <span style={{ color: value === order_status.filled ? '#3EB87D' : tabColor }}>
          <FormattedMessage id={order_status_reverse[value]}/>
        </span>
        )
      }
     return '';
    } 
  },
  {
    title: <FormattedMessage id="date" />,
    key: 'created_at',
    align: 'right',
    render: Created => <span>{formatDate(Created * 1000, 1)}</span>,
  },
  {
    title:tabType === 'pending_orders'?'':<FormattedMessage id="operation" />,
    key: 'showDetail',
    align: 'right',
    render: (value,item) => {
      return (
      <div>
        <a
          style={{
            width: '60px',
            height: '25px',
            lineHeight: '25px',
            display: 'inline-block',
            color: parseFloat(item.execute_amount) > 0 ? mainColor : tabColor,
          }}
          onClick={() => 
            {
              if(parseFloat(item.execute_amount) > 0){
                showDetail(item.id)
              }
            }
          }
        >
          <FormattedMessage id="detail" values={{ arrow: '▼' }} />
        </a>
      </div>
    )},
  }];
  if(tabType === 'pending_orders'){
    columns.push({
      title: <FormattedMessage id="operation" />,
      key: 'opt',
      align: 'left',
      render: (value,item) => {
        return (
        <div>
           <a
              style={{          
                color:item.reason !== order_reason.force_close_position ? mainColor : tabColor,
              }}
              onClick={() => {
                if(item.reason !== order_reason.force_close_position)
                cancelOrder(item.id);
              }}
            >
              <FormattedMessage id="cancel" />
          </a>
        </div>
      )},
    })
  }
  return columns;
};
const getOpenOrdersChildColumn = (tabType, symbolsObj ={}, acType) => {
  let columns = [
  {
    title: <FormattedMessage id="execute_price" />,
    key: 'execute_price',
    align: 'right',
  },
  {
    title: <FormattedMessage id="filled_amount" />,
    key: 'execute_amount',
    align: 'right'
  },
  {
    title: <FormattedMessage id="order_deal" />,
    key: 'execute_volume',
    align: 'right'
  },
  {
    title: <FormattedMessage id="fee" />,
    key: 'fee',
    align: 'right',
    render: (fee, item) =>{
      if(acType === account_type.accountTypeEx){
        let obj = symbolsObj[item.symbolid] || {};
        return <span>{ fee }&nbsp;{ item.direction === dir.buy ? obj.currency_quantity :  obj.currency_price}</span>;
      }
     else{
        return <span>{ fee }</span>
     }
    }
  },
  {
    title: <FormattedMessage id="fee_discount" />,
    key: 'fee_discount',
    align: 'right',
    render: (fee_discount, item) =>{
      if(acType === account_type.accountTypeEx){
        let obj = symbolsObj[item.symbolid] || {};
        return <span>{ fee_discount }&nbsp;{ item.direction === dir.buy ? obj.currency_quantity :  obj.currency_price}</span>;
      }
     else{
        return <span>{ fee_discount }</span>
     }
    }
  },
  {
    title: <FormattedMessage id="date" />,
    key: 'created_at',
    align: 'right',
    render: Created => <span>{formatDate(Created * 1000, 1)}</span>,
  },
  ];
  if(tabType === 'deal_order'){
    columns.splice(0,0,{
      title: <FormattedMessage id="product" />,
      key: 'symbol',
      align: 'left'
    },{
      title: <FormattedMessage id="side" />,
      key: 'direction',
      align: 'right',
      render: (Side,item) => (
        <div>
          {item.reason > 0 && order_reason_reverse[item.reason] && <FormattedMessage id={order_reason_reverse[item.reason]}/>} &nbsp;
          <span style={{ color: Side === dir.sell ? sellColor : buyColor }}>
            <FormattedMessage id={Side === dir.sell ? 'sell' : 'buy'} />
          </span>
        </div>
      ),
    });
  }
  else{
    for(let i =0 ; i < 6;i++){
      columns.unshift({
        title: '',
        key: i,
        align: 'left'
      });      
    }
    columns.push({
      title: '',
      key: 7,
      align: 'right'
    })
  }
  return columns;
  };

@connect(
  state => ({
    orders:state.orderManage.orders.data,
    count: state.orderManage.orders.count,
    orderDetail: state.orderManage.orderDetail,
    loading: state.Loading.fetchLoading,
    barType: state.orderManage.barType
  })
)
class Order extends Component {
  state = {
    orders:[],
    orderDetail:[]
  }
  componentWillReceiveProps(nextProps){
    const { type, orders, orderDetail, barType} = nextProps;
    if(this.props.orders !== orders && (barType === type)){
      this.setState( { orders })
    }
    if(this.props.orderDetail !== orderDetail){
      this.setState( { orderDetail })
    }
  }

  getTableColumns = (type) =>{
    let columns = [], childcolumns = [];
    const  { cancelOrder, showDetail,symbolsObj, acType } = this.props;
    switch(type){
      case 'pending_orders':{
        columns = getOpenOrdersColumn('pending_orders', cancelOrder, showDetail, symbolsObj);
        childcolumns = getOpenOrdersChildColumn('',symbolsObj, acType);
        break;
      }
      case 'order_history':{
        columns = getOpenOrdersColumn('order_history', cancelOrder, showDetail, symbolsObj);
        childcolumns = getOpenOrdersChildColumn('',symbolsObj, acType);
        break;
      }
      case 'deal_order':{
        columns = getOpenOrdersChildColumn('deal_order',symbolsObj, acType);
        break;
      }
    }
    return {columns, childcolumns}
  }
  render() {
    const {
      count,
      type,
      _paginationCallback,
      loading,
      init
    } = this.props;
    const { orders,orderDetail } = this.state;
    let obj = this.getTableColumns(type);
    return (
      <div className={styles.table_box}>
        {obj.columns.length > 0 && obj.childcolumns.length >0 && <Table
        placeholder={<FormattedMessage id="no_record" />}
        minWidth={700}
        columns={obj.columns}
        data={orders || []}
        pagination={{
          pageCount: 10,
          total: count,
          paginationCallback: (offset) =>{ 
            this.setState({orderDetail:[]})
            _paginationCallback(offset);
          },
        }}
        child={orderDetail}
        childcolumns={obj.childcolumns}
        loading={loading}
        init={init}
      />}
      {obj.columns.length > 0 && obj.childcolumns.length === 0 && <Table
        placeholder={<FormattedMessage id="no_record" />}
        minWidth={700}
        columns={obj.columns}
        data={orders || []}
        pagination={{
          pageCount: 10,
          total: count,
          paginationCallback: _paginationCallback,
        }}
        loading={loading}
        init={init}
      />}
      </div>
      
    );
  }
}
export default Order