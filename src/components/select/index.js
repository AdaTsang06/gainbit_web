import React, { Component } from 'react';
import VirtualList from 'react-tiny-virtual-list';
import Arrow from '@/assets/svg/order-arrow';
import styles from './styles.scss';

export default class Select extends Component {
  constructor(props) {
    super(props);
    const defaultItem =
      props.arr.filter(item => item.value === props.defaultValue)[0] || {};
    this.state = {
      selectValue: defaultItem.code
        ? `+ ${defaultItem.code}`
        : defaultItem.name,
      isShow: false,
      top: 28,
    };
  }
  componentDidMount() {
    this._computeHeight();
  }
  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    if (this.props.selectValue !== value) {
      const selectItem = this.props.arr.filter(item => item.value === value)[0];
      if (selectItem) {
        this.setState({
          selectValue: selectItem.code
            ? `+ ${selectItem.code}`
            : selectItem.name,
        });
      }
    }
  }
  _computeHeight = () => {
    this.setState({ top: this.valueRef.offsetHeight + 4 });
  };
  /**
   * item: object, { name, value }
   */
  _renderedMenu = (item, index, alignItems, style) => {
    const { name: Name } = item;
    const isComponent = typeof Name === 'function';
    return (
      <li className={styles.select_item} key={index} style={style}>
        {!isComponent ? (
          <a style={{ alignItems }} onClick={() => this._menuitemClick(item)}>
            {item.name}
          </a>
        ) : (
          <Name
            style={{ alignItems }}
            onClick={() => this._menuitemClick(item)}
          />
        )}
      </li>
    );
  };
  _menuitemClick = item => {
    this.setState({
      selectValue: item.code ? `+ ${item.code}` : item.name,
      isShow: false,
    });
    const { onChange = () => {} } = this.props;
    onChange(item.value);
  };
  _showRender = () => {
    const { disabled } = this.props;
    if (disabled) return;
    this.setState({ isShow: !this.state.isShow });
  };
  _checkAlign(align) {
    switch (align) {
      case 'left':
        return 'flex-start';
      case 'right':
        return 'flex-end';
      default:
        return 'center';
    }
  }
  render() {
    const { isShow, selectValue: SelectValue, top } = this.state;
    const {
      arr,
      width = '152',
      extra = null,
      placeholder,
      disabled,
      options = {},
    } = this.props;
    const { itemSize = 36, maxHeight = 300, align } = options;
    const showValue =
      typeof SelectValue === 'function' ? <SelectValue /> : SelectValue;
    const alignItems = this._checkAlign(align);
    const arrLength = arr.length;
    return (
      <div style={{ width: `${width}px` }} className={styles.select}>
        <div
          ref={e => {
            this.valueRef = e;
          }}
          style={{ alignItems, cursor: disabled ? 'not-allowed' : 'pointer' }}
          className={styles.select_value}
          onClick={this._showRender}
        >
          {showValue || placeholder}
          <span className={isShow ? styles.select_arrow_up : ''}>
            <Arrow fill="#9e9e9e" />
          </span>
        </div>
        <div
          style={{ top, display: isShow ? 'block' : 'none' }}
          className={styles.select_container}
        >
          <VirtualList
            width="100%"
            height={arrLength > 10 ? maxHeight : arrLength * itemSize}
            // height="auto"
            style={{ overflow: arrLength > 10 ? 'auto' : 'hidden' }}
            itemCount={arrLength}
            itemSize={itemSize}
            renderItem={({ index, style }) =>
              this._renderedMenu(arr[index], index, alignItems, style)
            }
          />
          {extra}
        </div>
        {isShow && (
          <div
            onClick={() => this.setState({ isShow: false })}
            className={styles.shadow}
          />
        )}
      </div>
    );
  }
}
