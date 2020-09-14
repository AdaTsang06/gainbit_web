import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { spot_change_reason } from '@/common/constant-enum.js';
import { FormattedMessage } from 'umi-plugin-locale';
import Table from '@/components/table';
import formatDate from '@/utils/format-date';
import stringifyVolumn from '@/utils/format';

import styles from '../styles.scss';

@connect((state, { api }) => ({
  history: state.AcCenter.financeHistory.data,
  count: state.AcCenter.financeHistory.count,
  loading: state.Loading.fetchLoading,
  currencyInfos: state.Account.currencyInfos
}))
class tradeHistory extends PureComponent {
  render() {
    const { history, count, loading, _paginationCallback, currencyInfos,init} = this.props;
    const columns = [
      {
        title: <FormattedMessage id="coin_type" />,
        key: 'currency',
        align: 'left',
      },
      {
        title: <FormattedMessage id="type" />,
        key: 'reason',
        align: 'right',
        render: reason => {
          for (var i in spot_change_reason) {
            if (spot_change_reason[i] === reason) {
              return <FormattedMessage id={i} />;
            }
          }
        },
      },
      {
        title: <FormattedMessage id="amount_change_all" />,
        key: 'amount_change',
        align: 'right',
        render:(value,item) => {
          let currenInfo = currencyInfos[item.currency] || {};
          return stringifyVolumn(value || 0, currenInfo.digits);
        }
      },
      {
        title: <FormattedMessage id="amount_after_all" />,
        key: 'amount_after',
        align: 'right',
        render:(value,item) => {
          let currenInfo = currencyInfos[item.currency] || {};
          return stringifyVolumn(value || 0, currenInfo.digits);
        }
      },
      {
        title: <FormattedMessage id="time" />,
        key: 'created_at',
        align: 'right',
        render: time => formatDate(time * 1000, 1),
      },
    ];
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
export default tradeHistory 