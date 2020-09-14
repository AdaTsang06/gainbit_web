/* eslint react/no-multi-comp:0, no-console:0 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { FormattedMessage } from 'umi-plugin-locale';
import Order from './order';
import { getQueryLang } from '../../../../utils/util';
import styles from '../../styles.scss';


@connect(state => ({
    locale: state.Intl.locale,
}))
class MessagesRecs extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            skip: 0
        }
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
        this.setState({ skip: offset})
    };
    _entrustSearch = () => {
        const paramsObj = {
            skip: 0
        };
        this.toSearch(paramsObj);
        this.setState({ skip: 0})
    };

    toSearch = (paramsObj) => {    
        paramsObj={          
            ...paramsObj
        };  
        for (let key in paramsObj) {
            if (!paramsObj[key]) delete paramsObj[key];
        }
        paramsObj.limit = 10;
        paramsObj.lang = getQueryLang(this.props.locale);
        paramsObj.zone = -(new Date().getTimezoneOffset()/60);
        this.props.dispatch({ type: 'Messages/getMessages', payload: paramsObj });
    }

    setRead = (payload) => {
        if(payload){
             this.props.dispatch({ type: 'Messages/setRead', payload: payload })
             .then(result => {
                 if(result){
                     this.toSearch({
                         skip: this.state.skip
                     });
                     this.props.dispatch({type: "Account/fetchUnreadMsgCount"});
                 }
             });
        }
    }
    render() {
        return (
            <div className={classnames(styles.container)}>
                <a className={styles.allRead} onClick={() => {
                      this.setRead({all:true})
                  }}>
                  <FormattedMessage id="allRead"/>
                </a>
                <div className={styles.history}>
                    <Order _historySearch={this._historySearch} 
                    _paginationCallback={this._paginationCallback} 
                    rowOnClickHandler = {(item) => {
                        if(item){
                            this.setRead({ids:[item.id]})
                        }
                    }}
                    />
                </div>
            </div>
        );
    }
}
export default MessagesRecs