import React, { PureComponent, Fragment } from 'react';
import { FormattedMessage } from 'umi-plugin-locale';
import { connect } from 'dva';
import classnames from 'classnames';
import Swiper from 'react-id-swiper';
import QRCode from 'qrcode.react';
import Notice from '@/components/notice';
import { sellColor, buyColor } from '../../common/color';
import { symbol_type } from '../../common/constant-enum';
import { androidDwUrl } from '../../common/constants';
import styles from './styles.scss';
import banner1 from '@/assets/home/banner.png';
import downloadAndroid from '@/assets/home/web_img_google_d.png';
import downloadIphone from '@/assets/home/web_img_iphone_d.png';
import btn_pre from '@/assets/home/web_icon_sliding_l.png';
import btn_next from '@/assets/home/web_icon_sliding_r.png';
import web_img_line from '@/assets/home/web_img_line.png';
import security from '@/assets/home/web_img_security.png';
import audit from '@/assets/home/web_img_audit.png';
import platform from '@/assets/home/web_img_security.png';
import stable from '@/assets/home/web_img_stable.png';
import experience from '@/assets/home/web_img_experience.png';
import dw_img2 from '@/assets/home/web_img_phone_one.png';
import dw_img3 from '@/assets/home/web_img_phone_two.png';

class Banner extends PureComponent {
  render() {
    const params = {
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    };
    return (
      <div className={styles.banner_box}>
        <Swiper {...params}>
          <div className={styles.banner_box} style={{ background: '#272436' }}>
            <div className={styles.banner_content}>
              <img src={banner1} />
            </div>         
          </div>
          {/* <div className={styles.banner_box} style={{ background: '#272436' }}>
            <div className={styles.banner_content}>
              <img src={banner1} />
            </div>
          </div>
          <div className={styles.banner_box} style={{ background: '#272436' }}>
            <div className={styles.banner_content}>
              <img src={banner1} />
            </div>
          </div> */}
        </Swiper>
      </div>
    );
  }
}

@connect(
  state => ({
    ticker: state.ws.ticker,
    acSymbolsObj:state.global.acSymbolsObj
  })
)
class Section1 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: symbol_type.ex,
      chose: '',
      stateTicker: props.ticker,
      btn_show: false,
    };
    this.goNext = this.goNext.bind(this);
    this.goPrev = this.goPrev.bind(this);
    this.swiper = null;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.ticker !== this.props.ticker) {
      this.setState(prev => ({
        stateTicker:{...prev.stateTicker,...nextProps.ticker},
      }));
    }
  }
  componentWillMount() {
  }
  componentDidMount() {
    this.resize();
    window.addEventListener('resize', this.resize);
  }
  resize = () => {
    const { acSymbolsObj } = this.props;
    const len = Object.keys(acSymbolsObj[symbol_type.ex]).length;
    this.setState({
      btn_show:
        (window.innerWidth <= 1400 && len >= 4) ||
        (window.innerWidth > 1400 && len >= 5),
    });
  };
  _getValues(str) {
   
  }
  _checkSortBy = value => {
    const { chose } = this.state;
    if (chose.indexOf(value) > -1 && chose.indexOf('up') > -1) {
      return this.setState({ chose: `${value}-down` });
    }
    return this.setState({ chose: `${value}-up` });
  };
  _checkValue = tickItem => {
    const { chose } = this.state;
    switch (chose) {
      case 'price-up':
      case 'price-down':
        return parseFloat(tickItem.price || 0);
      case 'change-up':
      case 'change-down':
        return tickItem.change_percent && parseFloat(tickItem.change_percent.replace('%', ''));
      case 'high-up':
      case 'high-down':
        return parseFloat(tickItem.high || 0);
      case 'low-up':
      case 'low-down':
        return parseFloat(tickItem.low || 0);
      case 'volume-up':
      case 'volume-down':
        return parseFloat(tickItem.volume || 0);
      case 'pair-up':
      case 'pair-down':
        return tickItem.name;
      default:
        break;
    }
    return false;
  };
  _comparatorValueMapper = value => {
    let { stateTicker } = this.state,
      tickItem = {name:value.name};
    if (stateTicker) {
      tickItem = stateTicker[value.id] || {};
    }
    return this._checkValue(tickItem);
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
  _jumpTrading = symbolId => {
    const { dispatch } = this.props;
    const routerRedux =require('dva').routerRedux;
    dispatch({type:'ws/changeQuoteRequest',payload:symbolId});
    dispatch(routerRedux.push('/exchange-ex'));
  };

  goNext() {
    if (this.swiper) this.swiper.slideNext();
  }

  goPrev() {
    if (this.swiper) this.swiper.slidePrev();
  }

  getSymTypeTab = () => {
    let items=[];
    const { activeIndex } = this.state;
    Object.values(symbol_type).map(item => {
      if(item){
         items.push(<li
              key={item}
              className={styles[item === activeIndex && 'active']}
            >
              <a onClick={() => this.setState({ activeIndex: item })}>                 
                <FormattedMessage id={`acType${item}`}/>
              </a>
      </li>)
      }
      })
    return items;
  }
  render() {
    const { acSymbolsObj } = this.props;
    const { stateTicker, btn_show,activeIndex } = this.state;
    const params = {
      slidesPerView: 4,
      spaceBetween: 60,
      breakpoints: {
        // when window width is <= 1400px
        1400: {
          slidesPerView: 3,
          spaceBetween: 60,
        },
      },
    };
    let hotSymbolList = [];
    let symList = Object.values(acSymbolsObj[symbol_type.ex]);
    if (symList && symList.length > 5) {
      hotSymbolList = symList.slice(0, 5);
    } else {
      hotSymbolList = [...symList];
    }
    return (
      <Fragment>
        <div className={styles.home_box}>
          <Notice {...this.props} />
        </div>
        <section className={styles.hot_container}>
          <div className={styles.home_box} id="hot_box">
            <Swiper
              {...params}
              ref={node => {
                if (node) this.swiper = node.swiper;
              }}
            >
              {hotSymbolList.map((item, idx) => {
                let quote =stateTicker && stateTicker[item.id] || null;
                if (quote) {
                  let isUp = parseFloat(quote.change_amount) >= 0;
                  return (
                    <div className={styles.hot_b_box} key={idx}>
                      <div className={styles.hot_box}>
                        <div className={styles.info1}>
                          <label className={styles.symbol}>{item.name}</label>
                          <label
                            className={styles.zdf}
                            style={{
                              background: isUp ? buyColor : sellColor,
                            }}
                          >
                            {isUp ? '+' : ''}{' '}
                            { quote.change_percent ||'--'}
                          </label>
                        </div>
                        <div
                          className={styles.info2}
                          style={{ color: isUp ? buyColor : sellColor }}
                        >
                          {quote.price || '--'}
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </Swiper>
          </div>
          {btn_show && (
            <div className={styles.btn_pre} onClick={this.goPrev}>
              <img src={btn_pre} />
            </div>
          )}
          {btn_show && (
            <div className={styles.btn_next} onClick={this.goNext}>
              <img src={btn_next} />
            </div>
          )}
        </section>
        <section className={classnames(styles.home_box, styles.marketing)}>
          <h1><FormattedMessage id="lastQuote"/></h1>
          <ul>
            {
              this.getSymTypeTab()
            }
          </ul>
          <div className={styles.marketing_thead_wrap}>
            <div className={styles.marketing_thead}>
              {['pair', 'price', 'change', 'high', 'low', 'volume'].map(
                item => (
                  <a
                    key={item}
                    className={this._checkClass(item)}
                    onClick={() => this._checkSortBy(item)}
                  >
                    <FormattedMessage id={item} />
                  </a>
                )
              )}
            </div>
            {acSymbolsObj && acSymbolsObj[activeIndex] ? (
                Object.values(acSymbolsObj[activeIndex])
                .sort(this._comparator)
                .map((item, idx) => {
                  let symName = item.name;              
                  let tickItem = {name:symName};
                  if (stateTicker) {
                     if(stateTicker[item.id]){
                      tickItem = {...tickItem,...stateTicker[item.id]}
                   }                
                  }
                  return (
                    <a
                      key={idx}
                      onClick={() => this._jumpTrading(item.id)}
                      className={styles.pannel_tr}
                    >
                      <span>{symName}</span>
                      <span>{tickItem.price || '--'}</span>
                      <span
                        style={{
                          color:
                            parseFloat(tickItem.change_amount) > 0
                              ? buyColor
                              : parseFloat(tickItem.change_amount) < 0
                                ? sellColor
                                : '',
                        }}
                      >
                        {tickItem.change_amount > 0 ? '+' : ''}{' '}
                        {tickItem.change_percent || '--'}
                      </span>
                      <span>{tickItem.high || '--'}</span>
                      <span>{tickItem.low || '--'}</span>
                      <span>{tickItem.volume || '--'}</span>
                    </a>
                  );
                })
            ) : (
              <div style={{ height: '230px' }} />
            )}
          </div>
        </section>
      </Fragment>
    );
  }
}

const home_max_width = 1650;
class Section2 extends PureComponent {
  constructor(props) {
    super(props);
    this.goNext = this.goNext.bind(this);
    this.goPrev = this.goPrev.bind(this);
    this.swiper = null;
    this.state = {
      btn_show: window.innerWidth < home_max_width,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }
  resize = () => {
    this.setState({ btn_show: window.innerWidth < home_max_width });
  };
  goNext() {
    if (this.swiper) this.swiper.slideNext();
  }

  goPrev() {
    if (this.swiper) this.swiper.slidePrev();
  }

  render() {
    const params = {
      slidesPerView: 5,
      spaceBetween: 29,
      breakpoints: {
        1649: {
          slidesPerView: 4,
          spaceBetween: 29,
        },
        1280: {
          slidesPerView: 3,
          spaceBetween: 29,
        },
      },
    };
    const { btn_show } = this.state;
    return (
      <section className={classnames(styles.chater_container)}>
        <div className={styles.home_box}>
          <img src={web_img_line} className={styles.desc_img} />
          <h1 className={styles.h1}>
            <FormattedMessage id="pt_introduction" />
          </h1>
          <h2 className={styles.h2}>
            <FormattedMessage id="pt_desc" />
          </h2>
        </div>
        <div className={classnames(styles.charter_box, styles.home_box)}>
          <Swiper
            {...params}
            ref={node => {
              if (node) this.swiper = node.swiper;
            }}
          >
            <div className={styles.charter_b_block}>
              <div className={styles.charter_block}>
                <img src={security} />
                <div className={styles.title}>
                  <FormattedMessage id="pt_charter1_title" />
                </div>
                <div className={styles.desc}>
                  <FormattedMessage id="pt_charter1_desc" />
                </div>
              </div>
            </div>
            <div className={styles.charter_b_block}>
              <div className={styles.charter_block}>
                <img src={audit} />
                <div className={styles.title}>
                  <FormattedMessage id="pt_charter2_title" />
                </div>
                <div className={styles.desc}>
                  <FormattedMessage id="pt_charter2_desc" />
                </div>
              </div>
            </div>
            <div className={styles.charter_b_block}>
              <div className={styles.charter_block}>
                <img src={platform} />
                <div className={styles.title}>
                  <FormattedMessage id="pt_charter3_title" />
                </div>
                <div className={styles.desc}>
                  <FormattedMessage id="pt_charter3_desc" />
                </div>
              </div>
            </div>
            <div className={styles.charter_b_block}>
              <div className={styles.charter_block}>
                <img src={stable} />
                <div className={styles.title}>
                  <FormattedMessage id="pt_charter4_title" />
                </div>
                <div className={styles.desc}>
                  <FormattedMessage id="pt_charter4_desc" />
                </div>
              </div>
            </div>
            <div className={styles.charter_b_block}>
              <div className={styles.charter_block}>
                <img src={experience} />
                <div className={styles.title}>
                  <FormattedMessage id="pt_charter5_title" />
                </div>
                <div className={styles.desc}>
                  <FormattedMessage id="pt_charter5_desc" />
                </div>
              </div>
            </div>
          </Swiper>
        </div>
        {btn_show && (
          <div className={styles.btn_pre} onClick={this.goPrev}>
            <img src={btn_pre} />
          </div>
        )}
        {btn_show && (
          <div className={styles.btn_next} onClick={this.goNext}>
            <img src={btn_next} />
          </div>
        )}
      </section>
    );
  }
}
const Section3 = () => {
  return (
    <section className={classnames(styles.home_page5)}>
      <div className={styles.home_page5_left_box}>
        <div className={styles.home_page5_left}>
          <h1 className={styles.h1}>
            <FormattedMessage id="dowload_title" />
          </h1>
          <h2 className={styles.h2}>
            <FormattedMessage id="dowload_desc" />
          </h2>
          <img src={dw_img2} className={styles.img2} />
          <img src={dw_img3} className={styles.img3} />
        </div>
      </div>
      <div className={styles.home_page7}>
        <div className={styles.home_page7_qr}>
          <QRCode
            value={androidDwUrl}
            size={185}
            renderAs="svg"
          />
        </div>
        <p>
          <FormattedMessage id="mobile_app_discription" />
        </p>
        <div
          className={classnames(styles.home_page7_item, styles.first)}
        >
          <div className={styles.home_page7_item_before}>
          <a href={androidDwUrl} className={styles.home_page7_link}>
            <img src={downloadIphone} alt="iosplay" />
            <FormattedMessage id="iphoneDw"/>
            </a>
          </div>
          <div className={styles.home_page7_item_qr}>
            <QRCode
              value={androidDwUrl}
              size={100}
              renderAs="svg"
            />
          </div>
        </div>
        <div
          className={styles.home_page7_item}
        >
          <div className={styles.home_page7_item_before}>
            <a href={androidDwUrl} className={styles.home_page7_link}>
              <img src={downloadAndroid} alt="androidplay" />
              <FormattedMessage id="googleDw"/>
            </a>
          </div>
          <div className={styles.home_page7_item_qr}>
            <QRCode
              value={androidDwUrl}
              size={100}
              renderAs="svg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default {
  Section1,
  Section2,
  Section3,
  Banner
};
