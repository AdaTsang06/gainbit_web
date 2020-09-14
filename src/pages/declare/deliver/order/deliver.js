import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-locale';
import Table from '@/components/table';
import styles from '../../styles.scss';


@connect((state) => ({
  history: state.deliverDeclare.settleHistory.data,
  count: state.deliverDeclare.settleHistory.count,
  loading: state.Loading.fetchLoading,
}))
class DeliverHistory extends PureComponent {
  state = {
    init: false
  }
  getColumns = () => {
    const columns = [
      {
        title: <FormattedMessage id="product" />,
        key: 'symbol',
        align: 'left'
      },
      {
        title: <FormattedMessage id="shouhuoNum" />,
        key: 'buy_amount',
        align: 'right'
      },
      {
        title: <FormattedMessage id="jiaohuoNum" />,
        key: 'sell_amount',
        align: 'right'
      },
      {
        title: <FormattedMessage id="lianca" />,
        key: 'defer_amount',
        align: 'right'
      },
      {
        title: <FormattedMessage id="operation" />,
        key: 'operation',
        align: 'right',
        render: (value,item) =>{
          return <a 
          onClick={() =>{
            this.props.dispatch({type:'Notification/changeTemplate',payload:{type:'deliver',symbolid:item.symbolid}})
          } 
        }
        >
          <FormattedMessage id="jiaoshouTitle1" />
        </a>    
        },
      },
    ];
    return columns;
  }

  componentWillMount(){
    const paramsObj = {};
    this.props.dispatch({ type: 'deliverDeclare/queryDeliverSummary', payload: paramsObj });
  }
  
  render() {
    const { history, count, loading } = this.props;
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
export default DeliverHistory 