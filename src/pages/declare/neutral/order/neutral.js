import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-locale';
import Table from '@/components/table';
import styles from '../../styles.scss';
import { mainColor, tabColor } from '../../../../common/color';


@connect((state) => ({
  history: state.neutralDeclare.settleHistory.data,
  count: state.neutralDeclare.settleHistory.count,
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
        title: <FormattedMessage id="side" />,
        key: 'direction',
        align: 'right',
        render:(value,item) =>{
          let dom='--';
          let deferAmount = parseFloat(item.defer_amount || 0)
          if(deferAmount > 0){
            dom = <FormattedMessage id="kongfuduo"/>
          }
          else if(deferAmount < 0){
            dom = <FormattedMessage id="duofukong"/>
          }
          return dom;
        }
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
        title: <FormattedMessage id="diyanNum" />,
        key: 'defer_amount',
        align: 'right'
      },
      {
        title: <FormattedMessage id="settlePrice" />,
        key: 'settle_price',
        align: 'right',
        render:(value) => {
          return value || '--'
        }
      },
      {
        title: <FormattedMessage id="operation" />,
        key: 'operation',
        align: 'right',
        render: (value,item) =>{
          const equalZero = parseFloat(item.defer_amount || 0) === 0 || parseFloat(item.settle_price || 0) <= 0;
          return <a 
          style={{color: !equalZero ? mainColor : tabColor, cursor: !equalZero ? 'pointer' : 'not-allowed'}}
          onClick={() =>{
            if(!equalZero){
              this.props.dispatch({type:'Notification/changeTemplate',payload:{type:'neutral',symbolid:item.symbolid}})
            }
          } 
        }
        >
          <FormattedMessage id="shenbao" />
        </a>    
        },
      },
    ];
    return columns;
  }

  componentWillMount(){
    const paramsObj = {};
    this.props.dispatch({ type: 'neutralDeclare/queryDeliverSummary', payload: paramsObj });
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
export default DeliverHistory 