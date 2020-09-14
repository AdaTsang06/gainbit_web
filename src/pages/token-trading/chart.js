import React, { PureComponent } from 'react';
import env from '@/common/env';
import styles from './styles.scss';
import FullImg from '../../assets/svg/full.js';

export default class Chart extends PureComponent {
  constructor(props) {
    super(props);
    this.divRef = null;
    this.iframeRef = null;
    this.state = {
      height: '465px',
    };
  }
  componentDidMount() {
    this._getWidthAndHeight();
    window.addEventListener('resize', this._getWidthAndHeight, false);
  }
  componentWillReceiveProps(nextProps) {
    if (
      this.iframeRef &&
      nextProps.market !== this.props.market
    ) {
      this.iframeRef.contentWindow.postMessage(
        JSON.stringify({ msgType: 'market', value: nextProps.symbolName }),
        '*'
      );
    }
    if(this.props.kFullScreen !== nextProps.kFullScreen){
      if(nextProps.kFullScreen){
        this.setState(() => ({
          height: '100%',
        }));
      }
      else{
        this._getWidthAndHeight();
      }
    }
  }
  componentWillUnmount() {
    return window.removeEventListener('resize', this._getWidthAndHeight, false);
  }
  _getWidthAndHeight = () => {
    this.setState(() => ({
      height: this.divRef.offsetHeight > 465 ? 465 : this.divRef.offsetHeight,
    }));
  };

  render() {
    const { locale, symbolName, toggleFullScreen } = this.props;
    let lang = locale;
    if (lang === 'zh-CN') {
      lang = 'zh';
    } else if (lang === 'zh-TW') {
      lang = 'zh_TW';
    }
    return (
      <div
        ref={e => {
          this.divRef = e;
        }}
        className={styles.chart}
      >
        {symbolName && <span style={{display:'inline-block',width:'30px',height:'30px',position:'absolute',top:'14px',right:'3px'}} onClick={toggleFullScreen}><FullImg /></span>}
        <div style={{ width: '100%', height:this.state.height}}>
          {symbolName && <iframe
            id="trading-view"
            ref={e => {
              this.iframeRef = e;
            }}
            title="chart"
            width={'100%'}
            height={this.state.height}
            style={{ border: 'none' }}
            src={`${env.CHART_URL}?symbol=${symbolName}&lang=${lang}`}
          />}
        </div>
      </div>
    );
  }
}
