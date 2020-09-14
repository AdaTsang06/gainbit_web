import React, { Component } from 'react';
import { FormattedMessage } from 'umi-plugin-locale';
import FreeScrollBar from 'react-free-scrollbar';
import { formatTimestamp } from '../../utils/format-date';
import { buyColor, sellColor } from '../../common/color';
import { dir } from '../../common/constant-enum';

import styles from './styles.scss';

class HistoryList extends Component {
  shouldComponentUpdate(nextProps) {
    if (JSON.stringify(this.props) === JSON.stringify(nextProps)) {
      return false;
    }
    return true;
  }
  render() {
    const { item } = this.props;
    return (
      <li>
        <span>{formatTimestamp(item.timestamp * 1000)}</span>
        <span style={{ color: item.direction === dir.sell ? sellColor : buyColor }}>
          {item.price}
        </span>
        <span>
          {item.amount}
        </span>
      </li>
    );
  }
}

const History = ({ data=[], currency_quantity='',currency_price}='') => {
  const list = data.slice(0, 50);
  return (
    <div className={styles.history}>
      {/*<div className={styles.panel_header}>
        <FormattedMessage id="recent_trade" />
      </div>*/}
      <div className={styles.list_title}>
        <FormattedMessage id="date" />
        <FormattedMessage id="history_price" values={{ unit: currency_price}} />
        <FormattedMessage id="history_amount" values={{ unit: currency_quantity }} />
      </div>
      <FreeScrollBar>
        <ul>
          {list.map((item, index) => <HistoryList key={index} item={item} />)}
        </ul>
      </FreeScrollBar>
    </div>
  );
};

export default History;
