import React, { Component } from 'react';
import styles from './styles.scss';

export default class Pagination extends Component {
  constructor(props) {
    super(props);
    const idx = props.defaultCurrent || 1;
    this.state = {
      idx: idx - 1,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.init) {
      this.setState({
        idx: nextProps.defaultCurrent - 1 || 0,
      });
    }
  }
  _iconClick(bol, disable) {
    if (disable) return;
    this.setState(prevState => {
      const prevIdx = prevState.idx;
      const nextIdx = bol ? prevIdx - 1 : prevIdx + 1;
      this.props.callback(nextIdx);
      return {
        idx: nextIdx,
      };
    });
  }
  render() {
    const { dataLen, pageCount = 6 } = this.props;
    const { idx } = this.state;
    return (
      idx === 0 && dataLen <=0 ? '' :<div className={styles.pagination}>     
        <button
          disabled={idx === 0}
          onClick={() => this._iconClick(true, idx === 0)}
        >
          &lt;
        </button>               
        <button
          disabled={dataLen < pageCount}
          onClick={() => this._iconClick(false, dataLen < pageCount)}
        >
          &gt;
        </button>
        
      </div>
    );
  }
}
