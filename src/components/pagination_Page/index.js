import React, { Component } from 'react';
import classnames from 'classnames';
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
  _onClick(idx) {
    if (idx === this.state.idx) return;
    this.props.callback(idx);
    this.setState({ idx });
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
  _generateArray(idx, total) {
    if (total < 5) return Array(...{ length: total }).map(Number.call, Number);
    switch (idx) {
      case 0:
        return Array(...[idx, idx + 1, '•••', total - 1]);
      case 1:
        return Array(...[0, idx, idx + 1, '•••', total - 1]);
      case total - 1:
        return Array(...[0, '•••', idx - 1, idx]);
      case total - 2:
        return Array(...[0, '•••', idx - 1, idx, idx + 1]);
      default:
        return Array(...[0, '•••', idx - 1, idx, idx + 1, '•••', total - 1]);
    }
  }
  render() {
    const { total = 0, pageCount = 6 } = this.props;
    const { idx } = this.state;
    const totalPage = Math.ceil(total / pageCount);
    const buttonArray = this._generateArray(idx, totalPage);
    const hide = total > pageCount;
    return (
      <div className={styles.pagination}>
        {hide && (
          <button
            disabled={idx === 0}
            onClick={() => this._iconClick(true, idx === 0)}
          >
            &lt;
          </button>
        )}
        {buttonArray.map((data, index) => (
          <button
            key={index}
            onClick={() => this._onClick(data)}
            className={classnames({ [styles.button]: data === idx })}
            disabled={data === '•••'}
          >
            {typeof data !== 'string' ? data + 1 : data}
          </button>
        ))}
        {hide && (
          <button
            disabled={idx === totalPage - 1}
            onClick={() => this._iconClick(false, idx === totalPage - 1)}
          >
            &gt;
          </button>
        )}
      </div>
    );
  }
}
