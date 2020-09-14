import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi-plugin-locale';
import { connect } from 'dva';
import Table from '../../../../components/table';
import { message_status_reverse } from '../../../../common/constant-enum';

import styles from '../../styles.scss';

const getOpenOrdersColumn = () => {
    let columns =[
    {
      title: <FormattedMessage id="content" />,
      key: 'msg',
      align: 'left'
    },
    {
      title: <FormattedMessage id="status" />,
      key: 'status',
      align: 'right',
      render:(val) => {
        return val && message_status_reverse[val] ? <FormattedMessage id={message_status_reverse[val]}/> : ''
      }
    }
  ];
    return columns;
  };

@connect((state) => ({
    history: state.Messages.messagesRecs.data,
    count: state.Messages.messagesRecs.count,
    loading: state.Loading.fetchLoading,
  }))
class Order extends PureComponent {
  render() {
    const { history, count, loading, _paginationCallback, rowOnClickHandler } = this.props;
    const columns = getOpenOrdersColumn();
    return (
      <div className={styles.table_box}>
        <Table
          loading={loading}
          columns={columns}
          placeholder={<FormattedMessage id={`no_record`} />}
          data={history || []}
          pagination={{
            pageCount: 10,
            total: count, 
            paginationCallback: _paginationCallback,
          }}
          rowOnClickHandler = {rowOnClickHandler}
        />
      </div>
    );
  }
}
export default Order 