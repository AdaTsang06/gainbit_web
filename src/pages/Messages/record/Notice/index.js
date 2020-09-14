import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-locale';
import Table from '@/components/table';
import { getQueryLang } from '../../../../utils/util';
import styles from '../../styles.scss';


@connect((state) => ({
  locale: state.Intl.locale,
  history: state.global.noticeList,
  loading: state.Loading.fetchLoading,
}))
class NoticeRecs extends PureComponent {
  state = {
    init: false
  }
  getColumns = () => {
    const columns = [
      {
        title: <FormattedMessage id="content" />,
        key: 'content',
        align: 'left'
      }
    ];
    return columns;
  }

  componentWillMount(){
    const paramsObj = {lang: getQueryLang(this.props.locale) };
    this.props.dispatch({ type: 'global/fetchNotices', payload: paramsObj });
  }
  
  render() {
    const { history, loading } = this.props;
    let columns = this.getColumns();
    return (
      <div className={styles.table_box}>
       <Table
          loading={loading}
          columns={columns}
          placeholder={<FormattedMessage id={`no_record`} />}
          data={history || []}
        />
      </div>
    );
  }
}
export default NoticeRecs 