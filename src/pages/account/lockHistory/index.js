/* eslint react/no-multi-comp:0, no-console:0 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { IntlProvider, FormattedMessage } from 'umi-plugin-locale';
import { withRouter } from 'react-router-dom';
import Form from '@/components/form';
import ActionButton from '@/components/action-button';
import Selects from '@/components/selects';
import Transfer from './lock';
import styles from './styles.scss';
import classnames from 'classnames';
import messages from '../messages';
import { lockSel } from '../../../common/search-item';
import { getFormat } from '../../../utils/util';
import TimeRange from '../../../components/time-range';
 
const SHOW_TIME = false;
@withRouter
@connect(state => ({
  locale: state.Intl.locale
}))
class LockHistory extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      startValue: null,
      endValue: null,
      start: 0,
      end: 0,
      acId:0,
      type: 0,
      init:true
    };
     this._paginationCallback = this._paginationCallback.bind(this);
  };
  componentWillMount() {
      this._historySearch();   
  }
  _paginationCallback = offset => {
    const { start, end, type } = this.state;
    const paramsObj = {
      type: parseInt(type),
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
    const { type, start, end } = this.state;
    const paramsObj = {
      type: parseInt(type),
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
    let keys = Object.keys(params);
    keys.map(key => {
      if(!params[key]){
        delete params[key];
      }
    })
    params.limit = 10;
    this.props.dispatch({type:'AcCenter/getLockHistory',payload:params});
  }
  render() {
    const { locale } = this.props;
    const {
      type,
      init
    } = this.state;
    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div className={classnames(styles.container)}>
          <div className={styles.history} style={{paddingTop:0}}>
                <div className={styles.form_box} style={{borderTop:0}}>
                  <Form
                    className={styles.formSearch}
                    onSubmit={this._historySearch}
                    action={() => <ActionButton id="submit" />}
                    form="myEntrustForm"
                  >            
                    <div className={styles.formSearch_item}>
                      <FormattedMessage id="direction" />
                      <Selects
                        width={180}
                        name="type"
                        onChange={this._onDepthChange.bind(this, 'type')}
                        arr={[{
                          name: <FormattedMessage id="All" />,
                          value: 0,
                        },...lockSel]}
                        defaultValue={type}
                      />
                    </div>
                    <div className={styles.formSearch_item}>
                      <FormattedMessage id="time" />
                      <TimeRange startValue={this.state.startValue} endValue={this.state.endValue} onChange={this.onChange}/>
                    </div>
                  </Form>
                </div>             
            <Transfer _historySearch={this._historySearch} _paginationCallback={this._paginationCallback} 
            init={init}/>
          </div>
        </div>
      </IntlProvider>
    );
  }
}
export default  LockHistory