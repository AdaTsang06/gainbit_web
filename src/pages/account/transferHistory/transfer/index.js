import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { transfer_dir_reverse } from '@/common/constant-enum.js';
import { FormattedMessage } from 'umi-plugin-locale';
import Table from '@/components/table';
import formatDate from '@/utils/format-date';
import styles from '../styles.scss';

const columns = [
  {
    title: <FormattedMessage id="direction" />,
    key: 'direction',
    align: 'left',
    render: value => {
      return <FormattedMessage id={transfer_dir_reverse[value]}/>;
    },
  },
  {
    title: <FormattedMessage id="amount_change_all" />,
    key: 'amount',
    align: 'right'
  },
  {
    title: <FormattedMessage id="time" />,
    key: 'created_at',
    align: 'right',
    render: time => formatDate(time * 1000, 1),
  },
];

@connect((state, { api }) => ({
  history: state.AcCenter.transferHistory.data,
  count: state.AcCenter.transferHistory.count,
  loading: state.Loading.fetchLoading,
}))
class TransferHistory extends PureComponent { 
   render() {
    const { history, count, loading, _paginationCallback,init } = this.props;
    return (
      <div className={styles.crypto}>
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
export default TransferHistory 