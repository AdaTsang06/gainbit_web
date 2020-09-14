/* eslint react/no-multi-comp:0, no-console:0 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-locale';
import Form from '../../../../../components/form';
import ActionButton from '../../../../../components/action-button';
import Order from './order';
import Selects from '../../../../../components/selects';
import TimeRange from '../../../../../components/time-range';
import { 
   // deliverStatusSel, 
    deliverTypeSel } from '../../../../../common/search-item';
import classnames from 'classnames';
import { account_type } from '../../../../../common/constant-enum';
import {  getFormat, getAccountId } from '../../../../../utils/util';
import styles from '../../../styles.scss';

const SHOW_TIME = false;;

@connect(state => ({
    currencyInfos: state.Account.currencyInfos,
    locale: state.Intl.locale,
    accountInfos: state.Account.accountInfos,
    acSymbolsObj: state.global.acSymbolsObj
}))
class WeiTuo extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            acId: getAccountId(account_type.accountTypeTd,props.accountInfos),
            startValue: null,
            endValue: null,
            start: 0,
            end: 0,
            symbolid: '',
            //orderStatusNow: deliverStatusSel[0].value,
            settleTypeNow: deliverTypeSel[0].value,
            init:true
        };
        this._paginationCallback = this._paginationCallback.bind(this);
    }
    componentWillMount() {
        this._entrustSearch();
    }
    _paginationCallback = offset => {
        const paramsObj = {
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
    _entrustSearch = () => {
        const paramsObj = {
            skip: 0
        };
        this.setState({init : true},() => {
            this.setState({init : false})
          });
        this.toSearch(paramsObj);
    };

    toSearch = (paramsObj) => {   
        const { symbolid,start, end, acId,settleTypeNow } = this.state;
        paramsObj={
            accountid: acId,
            symbolid: symbolid,
            start_time: start,
            end_time: end,
            direction: settleTypeNow,
           // status: orderStatusNow,
            ...paramsObj};   
        for (let key in paramsObj) {
            if (!paramsObj[key]) delete paramsObj[key];
        }
        paramsObj.limit = 10;
        this.props.dispatch({ type: 'neutralDeclare/queryNeutralDeal', payload: paramsObj });
    }

    render() {
        const {
            acSymbolsObj,
        } = this.props;
        const {
           // orderStatusNow,
            symbolid,
            settleTypeNow,
            init
        } = this.state;
        const symbolArr = Object.values(acSymbolsObj[account_type.accountTypeTd]) || [];
        const symSelects = symbolArr.map(item => {
            return { value: item.id, name: item.name }
        });
        symSelects.unshift({ value: '', name: <FormattedMessage id='all' /> })

        return (
            <div className={classnames(styles.container)}>
                <div className={styles.history}>
                    <div className={styles.form_box}>
                        <Form
                            className={styles.formSearch}
                            onSubmit={this._entrustSearch}
                            action={() => <ActionButton id="submit" />}
                            form="myEntrustForm"
                        >
                            <div className={styles.formSearch_item}>
                                <FormattedMessage id="product" />
                                <Selects
                                    width={170}
                                    name="symbolid"
                                    onChange={this._onDepthChange.bind(this, 'symbolid')}
                                    arr={symSelects}
                                    defaultValue={symbolid}
                                />
                            </div>
                            <div className={styles.formSearch_item}>
                                <FormattedMessage id="type" />
                                <Selects
                                    width={140}
                                    name="type"
                                    onChange={this._onDepthChange.bind(this, 'settleTypeNow')}
                                    arr={deliverTypeSel}
                                    defaultValue={settleTypeNow}
                                />
                            </div>
                            {/* <div className={styles.formSearch_item}>
                                <FormattedMessage id="status" />
                                <Selects
                                    width={140}
                                    name="status"
                                    onChange={this._onDepthChange.bind(this, 'orderStatusNow')}
                                    arr={deliverStatusSel}
                                    defaultValue={orderStatusNow}
                                />
                            </div>                         */}
                            <div className={styles.formSearch_item}>
                                <FormattedMessage id="dateChoose" />                              
                                <TimeRange startValue={this.state.startValue} endValue={this.state.endValue} onChange={this.onChange}/>
                            </div>
                        </Form>
                    </div>
                    <Order _historySearch={this._historySearch} _paginationCallback={this._paginationCallback} init={init}/>
                </div>
            </div>
        );
    }
}
export default WeiTuo