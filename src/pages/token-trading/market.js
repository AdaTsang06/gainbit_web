import React, { PureComponent } from 'react';
import FreeScrollBar from 'react-free-scrollbar';
import { FormattedMessage } from 'umi-plugin-locale';
//import SwitchBar from '@/components/switch-bar';
import toFixed from '@/utils/calculate';
import classNames from 'classnames';
import { buyColor, sellColor, highLi } from '@/common/color';
import Big from 'big.js';
import styles from './styles.scss';

export default class Market extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      chose: '',
      tab: '',
    };
  }
  big(str, number, val, toFix = 8) {
    if (val < 0 || number < 0) return '0';
    const c = new Big(val);
    return toFixed(
      c[str](number)
        .round(toFix, 0)
        .toFixed(toFix)
    );
  }
  _getQuoteRequest(symbolId) {
    this.props.getQuoteRequest(symbolId);
  }
  _checkValue = item => {
    const { chose } = this.state;
    switch (chose) {
      case 'last_price-up':
      case 'last_price-down':
        return parseFloat(item.price || 0);
      case '24h_change-up':
      case '24h_change-down':
        return item.change_percent && parseFloat(item.change_percent.replace('%', ''));
      case 'pair-up':
      case 'pair-down':
        return item.name;
      default:
        break;
    }
    return false;
  };
  _comparatorValueMapper = value => {
    const { ticker } = this.props;
    let item = { name:value.name, ...ticker[value.id] };
    return this._checkValue(item);
  };
  _comparator = (ia, ib) => {
    let a = this._comparatorValueMapper(ia);
    let b = this._comparatorValueMapper(ib);
    if (this.state.chose.indexOf('up') > -1) {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      if (a === b) {
        return 0;
      }
    }
    if (a < b) {
      return 1;
    }
    if (a > b) {
      return -1;
    }
    if (a === b) {
      return 0;
    }
    return false;
  };
  _checkSortBy = value => {
    const { chose } = this.state;
    if (chose.indexOf(value) > -1 && chose.indexOf('up') > -1) {
      return this.setState({ chose: `${value}-down` });
    }
    return this.setState({ chose: `${value}-up` });
  };
  _checkClass = item => {
    const { chose } = this.state;
    if (chose.indexOf(item) > -1) {
      if (chose.indexOf('up') > -1) {
        return styles.up;
      }
      return styles.down;
    }
    return '';
  };
  render() {
    const { market, ticker, marketList,sortArr=[] } = this.props;
    // const { tab } = this.state;
    let markeArr = [];
    sortArr.map(id => {
      markeArr.push(marketList[id]);
    });
    return (
      <div className={styles.market}>
        {/* <SwitchBar
          style={{
            padding: '0 20px',
            borderBottom: '1px solid #45577F!important',
          }}
          chose={tab}
          arr={arr}
          onClick={item => this.setState({ tab: item })}
        /> */}
        <div className={styles.list_title}>
          {['pair', 'last_price', '24h_change'].map(item => (
            <span
              key={item}
              className={classNames(styles.sort, this._checkClass(item))}
              onClick={() => this._checkSortBy(item)}
            >
              <FormattedMessage id={item} />
            </span>
          ))}
        </div>
        <ul className={styles.list_content}>
          <FreeScrollBar>
            {markeArr &&
              markeArr
              .sort(this._comparator)
                .map(sym => {
                  let item = {...sym,...ticker[sym.id]};                 
                  const checkChange = parseFloat(
                    item.change_amount || 0
                  );
                  const isTrue = market !== item.id;
                  const rate = item.change_percent || '--';
                  return (
                    <li
                      key={item.name}
                      style={{ backgroundColor: !isTrue && highLi }}
                    >
                      <a
                        onClick={() =>
                          isTrue && this._getQuoteRequest(item.id)
                        }
                      >
                        <span>
                          {sym.name.toUpperCase()}
                        </span>
                        <span className={styles.market_price}>
                          {item.price|| '--'}
                        </span>
                        <span
                          style={{
                            color:
                              checkChange < 0
                                ? sellColor
                                : checkChange > 0
                                  ? buyColor
                                  : '',
                          }}
                          className={styles.market_change}
                        >
                          {checkChange > 0 ? '+' : ''} {rate} {'  '}
                          {checkChange > 0 ? '↑' : checkChange < 0 ? '↓' : ''}
                        </span>
                      </a>
                    </li>
                  );
                })}
          </FreeScrollBar>
        </ul>
      </div>
    );
  }
}
