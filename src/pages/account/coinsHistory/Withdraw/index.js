import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { withdraw_status_reverse } from '@/common/constant-enum.js';
import { FormattedMessage } from 'umi-plugin-locale';
import Table from '@/components/table';
import formatDate from '@/utils/format-date';
import styles from '../styles.scss';

const columns = [
  {
    title: <FormattedMessage id="coin_type" />,
    key: 'currency',
    align: 'left',
  },
  {
    title: <FormattedMessage id="tx_amount" />,
    key: 'amount',
    align: 'right',
  },
  {
    title: <FormattedMessage id="fee" />,
    key: 'fee',
    align: 'right',
  },
  {
    title: <FormattedMessage id="address2" />,
    key: 'address',
    align: 'right',
  },
  {
    title: <FormattedMessage id="txid" />,
    key: 'txid',
    align: 'right',
  },
  {
    title: <FormattedMessage id="status" />,
    key: 'status',
    align: 'right',
    render:(val) => {
      return val && withdraw_status_reverse[val] ? <FormattedMessage id={withdraw_status_reverse[val]}/> : ""
    }
  },
  {
    title: <FormattedMessage id="comment" />,
    key: 'comment',
    align: 'right',
    render:(val) => {
      return val ? val :''
    }
    
  },
  {
    title: <FormattedMessage id="applyTime" />,
    key: 'created_at',
    align: 'right',
    render: time => formatDate(time * 1000, 1),
  }
];

@connect((state) => ({
  history: state.AcCenter.withdrawHistory.data,
  count: state.AcCenter.withdrawHistory.count,
  loading: state.Loading.fetchLoading,
}))
class FaitHistory extends PureComponent {
  render() {
    const { history, count, loading, _paginationCallback, init } = this.props;
    return (
      <div className={styles.crypto}>
        <Table
          loading={loading}
          columns={columns}
          // columns={columns}
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
export default FaitHistory