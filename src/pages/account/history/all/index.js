import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { spot_change_reason } from '@/common/constant-enum.js';
import { FormattedMessage } from 'umi-plugin-locale';
import formatDate from '@/utils/format-date';
import Table from '@/components/table';
import styles from '../styles.scss';

const columns = [
  {
    title: <FormattedMessage id="coin_type" />,
    key: 'spot_name',
    align: 'left',
  },
  {
    title: <FormattedMessage id="type" />,
    key: 'reason',
    align: 'right',
    render: name => {
      for (var i in spot_change_reason) {
        if (spot_change_reason[i] === name) {
          return <FormattedMessage id={i} />;
        }
      }
    },
  },
  {
    title: <FormattedMessage id="amount_change_all" />,
    key: 'amount_change',
    align: 'right',
  },
  {
    title: <FormattedMessage id="fee" />,
    key: 'fee',
    align: 'right',
  },
  {
    title: <FormattedMessage id="amount_after_all" />,
    key: 'amount_after',
    align: 'right',
  },
  {
    title: <FormattedMessage id="time" />,
    key: 'created_at',
    align: 'right',
    render: time => formatDate(time * 1000, 1),
  }
];

@connect((state, { api }) => ({
  history: state.AcCenter.financeHistory.data,
  count: state.AcCenter.financeHistory.count,
  loading: state.Loading.fetchLoading,
}))
class AllHistory extends PureComponent {
  componentWillMount() {
    const paramsObj = {
      spot_name: '',
      reason: 0,
    };
    this.props._historySearch(paramsObj);
  }
  render() {
    const { history, count, loading, _paginationCallback } = this.props;
    return (
      <div className={styles.crypto}>
        <Table
          loading={loading}
          placeholder={<FormattedMessage id={`no_record`} />}
          columns={columns}
          data={history || []}
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
export default AllHistory