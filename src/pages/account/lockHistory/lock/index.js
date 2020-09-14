import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { lockTypeReverse } from '@/common/constant-enum.js';
import { FormattedMessage } from 'umi-plugin-locale';
import Table from '@/components/table';
import formatDate from '@/utils/format-date';
import styles from '../styles.scss';

const columns = [
  {
    title: <FormattedMessage id="amount_change_all" />,
    key: 'amount_change',
    align: 'left'
  },
  {
    title: <FormattedMessage id="operation" />,
    key: 'type',
    align: 'right',
    render: value => {
      return lockTypeReverse[value] ? <FormattedMessage id={lockTypeReverse[value]}/> : "--";
    },
  },
  {
    title: <FormattedMessage id="time" />,
    key: 'created_at',
    align: 'right',
    render: time => formatDate(time * 1000, 1),
  },
];

@connect((state, { api }) => ({
  history: state.AcCenter.lockHistory.data,
  count: state.AcCenter.lockHistory.count,
  loading: state.Loading.fetchLoading,
}))
class Lock extends PureComponent { 
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
export default Lock 