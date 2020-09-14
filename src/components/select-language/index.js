import React, { Component } from 'react';
import { connect } from 'dva';
import { setLocale } from 'umi-plugin-locale';

import { withRouter } from 'react-router-dom';
import styles from './styles.scss';

const SelectArr = [
  ['English', 'en-US'],
  ['简体中文', 'zh-CN'],
  ['繁体中文', 'zh-TW'],
];

@withRouter
@connect(state =>({
  locale: state.Intl.locale
}))
class SelectLanguage extends Component {
  constructor(props) {
    super(props);
    this.arr = props.arr || SelectArr;
    this.state = {
      selectValue: this._defaultName(this.arr),
      isShow: false,
    };
  }
  _renderedMenu = ([name, label]) =>
    label !== this.props.locale && (
      <li key={label}>
        <a onClick={() => this._menuitemClick([name, label])}>{name}</a>
      </li>
    );
  _menuitemClick = ([name, label]) => {
    this.setState({
      selectValue: name,
      isShow: false,
    });
    setLocale(label);
  };
  _showRender = () => this.setState({ isShow: !this.state.isShow });

  _defaultName = arr => {
    const {locale} = this.props;
    const langs = arr.filter(item => item[1] === locale);
    let name = '简体中文';
    if(langs && langs.length > 0){
      name = langs[0][0];
    }
    else{
      setLocale('zh-CN');
    }
    return name;
  };
  render() {
    const { isShow, selectValue } = this.state;
    const { selectColor="#fff" } = this.props;
    return (
      <div
        className={styles.select}
        style={{
          margin:'5px 8px',
        }}
      >
        <a onClick={this._showRender} style={{color:selectColor}}
        >
          {selectValue}
          <span className={styles.arrow} style={{borderColor: `${selectColor} transparent transparent transparent`}}></span>
        </a>
        <ul className={isShow ? styles.isShow : null}>
          {this.arr.map(this._renderedMenu)}
        </ul>
        <div
          onClick={() => this.setState({ isShow: false })}
          className={isShow ? styles.shadow : null}
        />
      </div>
    );
  }
}
export default SelectLanguage