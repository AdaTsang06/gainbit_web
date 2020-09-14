import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi-plugin-locale';
import { connect } from 'dva';
import Table from '../../../../../components/table';
import formatDate from '../../../../../utils/format-date';
import {  mainColor, tabColor } from '../../../../../common/color';
import { deliver_type, deliver_type_reverse,dir,deliver_status_reverse,deliver_status } from '../../../../../common/constant-enum';

import styles from '../../../styles.scss';

const getOpenOrdersColumn = (cancelOrder) => {
    let columns =[
    {
      title: <FormattedMessage id="product" />,
      key: 'symbol',
      align: 'left'
    },
    {
      title: <FormattedMessage id="type" />,
      key: 'direction',
      align: 'right',
      render: value =>{
        if(value){
          return <FormattedMessage id={value === dir.buy ? "shuohuo":"jiaohuo"}/>
        }
        return '--'
      }
    },
    {
      title: <FormattedMessage id="postionType" />,
      key: 'type',
      align: 'right',
      render: value =>{
        if(value){
          return <FormattedMessage id={deliver_type_reverse[value]}/>
        }
        return '--'
      }
    },
    {
      title: <FormattedMessage id="request_amount" />,
      key: 'amount',
      align: 'right'
    },
    {
      title: <FormattedMessage id="order_deal" />,
      key: 'exec_volume',
      align: 'right'
    },
    {
      title: <FormattedMessage id="status" />,
      key: 'status',
      align: 'right',
      render: value =>{
        return (
          <span style={{ color: value === deliver_status.deliver_success ? '#3EB87D' : tabColor }}>
            <FormattedMessage id={deliver_status_reverse[value]}/>
          </span>
        )
      } 
    },
    {
      title: <FormattedMessage id="fee" />,
      key: 'fee',
      align: 'right'
    },
    {
      title: <FormattedMessage id="date" />,
      key: 'created_at',
      align: 'right',
      render: Created => <span>{formatDate(Created * 1000, 1)}</span>,
    },
    {
      title: <FormattedMessage id="operation" />,
      key: 'operation',
      align: 'right',
      render: (value,item) => {
        const init = item.status === deliver_status.deliver_init && item.type === deliver_type.deliver_type_user;
        return (
        <div>
          <a
              style={{          
                color: init ? mainColor : tabColor,
                marginLeft: '10px',
                cursor: init ? 'pointer' : 'not-allowed'
              }}
              onClick={() => {
                if(init){
                  cancelOrder(item.id)
                }
              }
              }
          >
              <FormattedMessage id="cancel" />
          </a>
        </div>
      )},
    }];
    return columns;
  };

@connect((state) => ({
    history: state.deliverDeclare.weituoHistory.data,
    count: state.deliverDeclare.weituoHistory.count,
    loading: state.Loading.fetchLoading,
  }))
class Order extends PureComponent {
  render() {
    const { history, count, loading, _paginationCallback, cancelOrder, init } = this.props;
    const columns = getOpenOrdersColumn(cancelOrder);
    return (
      <div className={styles.table_box}>
        <Table
          loading={loading}
          columns={columns}
          placeholder={<FormattedMessage id={`no_record`} />}
          data={history || []}
          init={init}
          pagination={{
            pageCount: 10,
            total: count, 
            paginationCallback: _paginationCallback,
          }}
        />
      </div>
    );
  }
}
export default Order 