import React, { Component } from 'react';
import SwitchBar from '../../../components/switch-bar-order';
import Order from './order';
import Tips from './tips';
import styles from './styles.scss';
import { textColor } from '../../../common/color';
import { order_type } from '../../../common/constant-enum';
export default class PlaceOrder extends Component {
  state = {
    orderType: 'limit',
  };
  componentWillReceiveProps(nextProps) {
    const { replaceValue } = nextProps;
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
  }
  _onSwitchBarClick = item => {
    this.setState({ orderType: item });
  };
  render() {
    const { orderType } = this.state;
    const { replaceValue } = this.props;
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
          chose={orderType}
          arr={['limit', 'market']}
          onClick={this._onSwitchBarClick}
          activeTabColor={textColor}
          normalColor={textColor}
          // title={title}
        />
        <div className={styles.place_order_content}>
          {['buy', 'sell'].map((form, index) => (
            <Order
              key={index}
              {...this.props}
              form={form}
              orderType={orderType}
              scale={1}
            />
          ))}
        </div>
        <Tips {...this.props} />
        <div className={replaceValue ? styles.replace_shadow : ''} />
      </div>
    );
  }
}
