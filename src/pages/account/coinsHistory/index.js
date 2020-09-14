/* eslint react/no-multi-comp:0, no-console:0 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { IntlProvider, FormattedMessage } from 'umi-plugin-locale';
import { withRouter } from 'react-router-dom';
import Form from '@/components/form';
import ActionButton from '@/components/action-button';
import SwitchBar from '@/components/switch-bar';
import Selects from '@/components/selects';
import TimeRange from '../../../components/time-range';
import DepositHistory from './Deposit';
import WithdrawHistroy from './Withdraw';
import { account_type } from '../../../common/constant-enum'
import styles from './styles.scss';
import classnames from 'classnames';
import messages from '../messages';
import { getFormat,getAccountId } from '../../../utils/util';
const SHOW_TIME = false;
@withRouter
@connect(state => ({
  currencyInfos: state.Account.currencyInfos,
  locale: state.Intl.locale,
  accountInfos: state.Account.accountInfos
}))
class CoinsHistory extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      chose: 'deposit',
      startValue: null,
      endValue: null,
      start: 0,
      end: 0,
      currencyNow: '',
      acId:0,
      init:true
    };
     this._paginationCallback = this._paginationCallback.bind(this);
  };
  componentWillMount() {
    this.setState({acId:this.getAccountId(account_type.accountTypeEx)},() => {
      this._historySearch();
  })
  }

  getAccountId = (chose) => {
    const { accountInfos } = this.props;
    return getAccountId(chose,accountInfos);
  }
  _handleOrdersChange = item => {
    this.setState({ chose: item, currencyNow: '', start: 0, end: 0, startValue: null, endValue: null },()=>{
      this._historySearch();
    });
  };

  _paginationCallback = offset => {
    const { currencyNow, start, end } = this.state;
    const paramsObj = {
      spot_name: currencyNow,
      start_time: start,
      end_time : end,
      skip: offset,
    };
    this.toSearch(paramsObj);
   };
  onChange = (field, value) => {
    let time1 = 0;
    if(value){
       let time = value.format(getFormat(SHOW_TIME)).replace(/-/g,'/');
       time1 = new Date(time).getTime() / 1000;
    }
    if(field === 'startValue'){
      this.setState({start: time1, [field]: value});
    }else if(field === 'endValue'){
      this.setState({end: time1 ? time1 + 24 * 60 * 60 : 0, [field]: value});
    }
  };
  _onDepthChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  _historySearch = () => {
    const { currencyNow, start, end } = this.state;
    const paramsObj = {
      currency : currencyNow,
      start_time: start,
      end_time : end,
      skip:0
    };
    this.setState({init : true},() => {
      this.setState({init : false})
    });
    this.toSearch(paramsObj);
  };

  toSearch = (params) => {
    const { acId, chose } = this.state;
    let keys = Object.keys(params);
    keys.map(key => {
      if(!params[key]){
        delete params[key];
      }
    });
    params.accountid  = acId;
    params.limit = 10;
    if(chose === 'deposit'){
      this.props.dispatch({type:'AcCenter/getDepositHistory',payload:params});
    }
    else if(chose === 'withdraw'){
      this.props.dispatch({type:'AcCenter/getWithdrawHistory',payload:params});
    }
  }
  render() {
    const { locale, currencyInfos } = this.props;
    const {
      chose,
      currencyNow,
      init
    } = this.state;
    const currencyPair = [{ value: '', name: <FormattedMessage id="All" /> }];
    const currencys = Object.keys(currencyInfos);
    for(let i =0;i < currencys.length;i++){
      currencyPair.push({ value: currencys[i], name: currencys[i] });
    }
    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div className={classnames(styles.container)}>
          <div className={styles.history}>
            <div className={styles.history_label}>
              <SwitchBar             
                chose={chose}
                arr={['deposit', 'withdraw']}
                onClick={item => this._handleOrdersChange(item)}
              />
            </div>
            {
              currencyPair.length>0 && (
                <Form
                  className={styles.formSearch}
                  onSubmit={this._historySearch}
                  action={() => <ActionButton id="submit" />}
                  form="myEntrustForm"
                >
                  <div className={styles.formSearch_item}>
                    <FormattedMessage id="coin_type" />
                    <Selects
                      width={140}
                      name="symbol"
                      onChange={this._onDepthChange.bind(this, 'currencyNow')}
                      arr={currencyPair}
                      defaultValue={currencyNow}
                    />
                  </div>
                  <div className={styles.formSearch_item}>
                    <FormattedMessage id="time" />
                    <TimeRange startValue={this.state.startValue} endValue={this.state.endValue} onChange={this.onChange}/>
                  </div>
                </Form>
              )}
            {chose === 'deposit' &&<DepositHistory api="deposit" _historySearch={this._historySearch} _paginationCallback={this._paginationCallback} init={init}/>}
            {chose === 'withdraw' && <WithdrawHistroy api="withdraw" _historySearch={this._historySearch} _paginationCallback={this._paginationCallback} init={init}/>}
          </div>
        </div>
      </IntlProvider>
    );
  }
}
export default  CoinsHistory