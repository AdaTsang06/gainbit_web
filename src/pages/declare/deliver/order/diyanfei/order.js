import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi-plugin-locale';
import { connect } from 'dva';
import Table from '../../../../../components/table';
import formatDate from '../../../../../utils/format-date';
import { deliver_type_reverse } from '../../../../../common/constant-enum';

import styles from '../../../styles.scss';

const getOpenOrdersColumn = () => {
    let columns =[
    {
      title: <FormattedMessage id="product" />,
      key: 'symbol',
      align: 'left'
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
      title: <FormattedMessage id="jie" />,
      key: 'fee',
      align: 'right'
    },
    {
      title: <FormattedMessage id="zhizangliang" />,
      key: 'amount',
      align: 'right'
    },
    {
      title: <FormattedMessage id="settlePrice" />,
      key: 'settle_price',
      align: 'right'
    },
    {
      title: <FormattedMessage id="date" />,
      key: 'created_at',
      align: 'right',
      render: Created => <span>{formatDate(Created * 1000, 1)}</span>,
    },
  ];
    return columns;
  };

@connect((state) => ({
    history: state.deliverDeclare.diyanFeeHistory.data,
    count: state.deliverDeclare.diyanFeeHistory.count,
    loading: state.Loading.fetchLoading,
  }))
class Order extends PureComponent {
  render() {
    const { history, count, loading, _paginationCallback,init } = this.props;
    const columns = getOpenOrdersColumn();
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