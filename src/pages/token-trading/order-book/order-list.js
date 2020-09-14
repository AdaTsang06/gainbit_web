import React, { Component } from 'react';
import classnames from 'classnames';
import { buyColor, sellColor } from '@/common/color';
import LiComponent from './li-component';
import styles from './styles.scss';
import { dir } from '../../../common/constant-enum';

export default class OrderBook extends Component {
  render() {
    const { idx, callbackClickOrderInfo, order, sellOrBuy } = this.props;
    const checkType = idx === dir.buy;
    const color = checkType ? buyColor : sellColor;
    let list = order;
    return (
      <ul
        className={classnames(styles.order_list, styles.transition, {
          [styles.reverse_style]: !sellOrBuy && !checkType,
        })}
      >
        {list.map((item, idx) => {
          const { Price, Size } = item;
          return (
            <LiComponent
              key={Price}
              price={Price}
              amount={Size}
              callbackClickOrderInfo={prop =>
                callbackClickOrderInfo({ prop, Price, Size: Size })
              }
              color={color}
              index={!checkType ? list.length - idx : idx + 1}
            />
          );
        })}
      </ul>
    );
  }
}
