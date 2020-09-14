import React, { Component } from 'react';

export default class LiComponent extends Component {
  render() {
    const { price, amount, callbackClickOrderInfo, color, index } = this.props;
    return (
      <li onClick={() => callbackClickOrderInfo('price')}
      >
        <a>
          <span>
            <i>{index}</i>
          </span>
          <span
            style={{ color }}
          >
            {price}
          </span>
          {/* <span onClick={() => callbackClickOrderInfo('size')}>{amount}</span> */}
          <span>{amount}</span>
        </a>
      </li>
    );
  }
}
