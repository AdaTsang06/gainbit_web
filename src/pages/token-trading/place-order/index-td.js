import React, { Component } from 'react';
import { FormattedMessage } from 'umi-plugin-locale';
import { connect } from 'dva';
import SwitchBar from '../../../components/switch-bar';
import SwitchBarOrder from '../../../components/switch-bar-order';
import Select from '../../../components/selects';
import Order from './order';
import CloseOrder from './close-order';
import Tips from './tips';
import styles from './styles.scss';
import { textColor } from '../../../common/color';
import { order_type } from '../../../common/constant-enum';

@connect(state => ({
  userSymScale: state.trading.userSymScale,
  userInfo: state.Account.userInfo
}))
class PlaceOrder extends Component {
  constructor(props){
    super();
    this.state =  {
      positionType: props.optType === 'closePosition' ? 'closePosition':'openPositon',
      orderType: 'limit',
      scale:1,
      arr:[]
    };
  }
  componentWillReceiveProps(nextProps) {
    const { replaceValue, market, nowTicker } = nextProps;
    if (replaceValue !== this.props.replaceValue && replaceValue) {
      let i = 'limit';
      switch (replaceValue.orderType) {
        case order_type.market:
          i = 'market';
          break;
        case order_type.limit:
          i = 'limit';
          break;
        case order_type.stop:
          i = 'stop';
          break;
        default:
          break;
      }
      this.setState({
        orderType: i,
      });
    }
    if(market !== this.props.market){
      if(nowTicker.levers && nowTicker.levers.length){
        this._updateScales(nowTicker);
      }
    }
    else{
      if(!this.state.arr || !this.state.arr.length){
        if(nowTicker.levers && nowTicker.levers.length){
          this._updateScales(nowTicker);
        }
      }
    }
  }

  componentWillMount(){
    this._updateScales(this.props.nowTicker);
  }
  
  _updateScales(nowTicker){
    const {userSymScale, isLogin, userInfo} = this.props;
    if(nowTicker.levers && nowTicker.levers.length){
      const arr= nowTicker.levers.map(item => {
        return { name: <FormattedMessage id='scaleBei' values={{scale: item}}/>, value: item}
      });
      let scale= nowTicker.levers[0];
      if(isLogin && userInfo && userSymScale[userInfo.id] && userSymScale[userInfo.id][nowTicker.id]){
        if(nowTicker.levers.indexOf(userSymScale[userInfo.id][nowTicker.id]) !== -1){
          scale = userSymScale[userInfo.id][nowTicker.id];
        }
      }
      
      this.setState({scale:scale,arr})
    }
  }

  _onSwitchBarClick = (item) => {
    this.setState({ positionType: item, orderType:'limit'});
  };
  _onTypeSwitchBarClick = (item) => {
    this.setState({ orderType: item});
  };
  onChange = (value) => {
    this.setState({scale:value});
    const { dispatch, userInfo, nowTicker } = this.props;
    dispatch({type:'trading/updateSymScale',payload:{
      userId: userInfo.id, 
      symbolid: nowTicker.id,
      scale: value
    }})
  }
  render() {
    const { orderType, positionType, arr, scale  } = this.state;
    const { replaceValue } = this.props;
    let typeArr = ['limit','market'];
    /*const title = (
      <span className={styles.sale}>
        <FormattedMessage id="fee" />
        <span className={styles.sale_price}>0.10%</span>
      </span>
    );*/
    return (
      <div className={styles.place_order}>
        <SwitchBar
          style={{ padding: '0 20px' }}
          chose={positionType}
          arr={['openPositon','closePosition']}
          onClick={ this._onSwitchBarClick }
          activeTabColor={textColor}
          normalColor={textColor}
        />
        <div className={styles.scale_box}>
          <SwitchBarOrder
            chose={orderType}
            arr={typeArr}
            onClick={ this._onTypeSwitchBarClick }
            activeTabColor={textColor}
            normalColor={textColor}
            />
          {positionType==='openPositon' && <Select arr={arr} onChange={this.onChange} defaultValue={scale}></Select>}     
        </div>
        {positionType==='openPositon' && <div className={styles.place_order_content}>
          {['buy', 'sell'].map((form, index) => (
            <Order
              key={index}
              {...this.props}
              form={form}
              orderType={orderType}
              scale={scale}
            />
          ))}
        </div>}
        {positionType==='closePosition' && <div className={styles.place_order_content}>
          {['buy', 'sell'].map((form, index) => (
            <CloseOrder
              key={index}
              {...this.props}
              form={form}
              orderType={orderType}
            />
          ))}
        </div>}
        <Tips {...this.props} />
        <div className={replaceValue ? styles.replace_shadow : ''} />
      </div>
    );
  }
}
export default PlaceOrder;