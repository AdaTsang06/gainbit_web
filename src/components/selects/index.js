import React, { Component } from 'react';
import FreeScrollBar from 'react-free-scrollbar';
import Arrow from '@/assets/svg/order-arrow';
import styles from './styles.scss';

export default class Selects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValue: this.setDefaultValue(props),
      isShow: false,
      top: 28,
    };
  }

  componentWillReceiveProps(nextProps){
    if(this.props.arr !== nextProps.arr){
      const selectValue = this.setDefaultValue(nextProps);
      if(selectValue){
        this.setState({ selectValue })
      }
    }
  }


  componentDidMount() {
    this._computeHeight();
  }
  
  setDefaultValue = (props) => {
    const defaultItem = props.arr.filter(item => item.value === props.defaultValue)[0];
    return defaultItem ? (defaultItem.code
    ? `+ ${defaultItem.code}`
    : defaultItem.name) : ""
  }
   
  _computeHeight = () => {
    this.setState({ top: this.valueRef.offsetHeight + 4 });
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
    const { isShow, selectValue, top } = this.state;
    const {
      arr,
      width = '152',
      placeholder,
      disabled,
      options = {},
    } = this.props;
    const { itemSize = 36, maxHeight = 300, align } = options;
    const alignItems = this._checkAlign(align);
    const arrLength = arr.length;
    return (
      <div style={{ width: `${width}px` }} className={styles.select}>
        <div
          ref={e => {
            this.valueRef = e;
          }}
          style={{ alignItems: alignItems, cursor: disabled ? 'not-allowed' : 'pointer' }}
          className={styles.select_value}
          onClick={this._showRender}
        >
          {selectValue || placeholder}
          <span className={isShow ? styles.select_arrow_up : ''}>
            <Arrow fill="#9e9e9e" />
          </span>
        </div>
        <div
          style={{
            top,
            display: isShow ? 'block' : 'none',
            height: arrLength > 10 ? maxHeight : arrLength * (itemSize+1),
          }}
          className={styles.select_container}
        >
          <FreeScrollBar>
            <ul>
             {arr.map((item,index) => <li className={styles.select_item} key={index}> 
             <a style={{ alignItems }} onClick={() => this._menuitemClick(item)}>
              {item.name}
              </a>
              </li>)}
            </ul>
          </FreeScrollBar>
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
