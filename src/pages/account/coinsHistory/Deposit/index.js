import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { deposit_status_reverse } from '@/common/constant-enum.js';
import { FormattedMessage} from 'umi-plugin-locale';
import formatDate from '@/utils/format-date';
import Table from '@/components/table';
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
    title: <FormattedMessage id="address" />,
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
      return val && deposit_status_reverse[val] ? <FormattedMessage id={deposit_status_reverse[val]}/> : ""
    }
  },
  {
  title: <FormattedMessage id="depositTime" />,
    key: 'created_at',
    align: 'right',
    render: time => formatDate(time * 1000, 1),
  }
];

@connect((state, { api }) => ({
  history: state.AcCenter.depositHistory.data,
  count: state.AcCenter.depositHistory.count,
  loading: state.Loading.fetchLoading,
}))
class Crypto extends PureComponent {
  render() {
    const { history, count, loading,  _paginationCallback, init } = this.props;
    return (
      <div className={styles.crypto}>
        <Table
          loading={loading}
          placeholder={<FormattedMessage id={`no_record`} />}
          columns={columns}
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
export default  Crypto