import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { FormattedMessage, setLocale } from 'umi-plugin-locale';
import classnames from 'classnames';
import Logo from '@/assets/biglogo.png';
import Logo_Uat from '@/assets/logo_uat.png';
import DropDown from '@/components/drop-down';
import { mainColor} from '../common/color';
import { navUserCenter } from '../common/menu';
import styles from './header-gainbit.scss';
import noitce from '@/assets/noitce.png';
import us from '@/assets/lang/us.png';
import hk from '@/assets/lang/hk.png';
import cn from '@/assets/lang/cn.png';

const SelectArr = [
  ['English', 'en-US'],
  ['中文(简)', 'zh-CN'],
  ['中文(繁)', 'zh-TW'],
];

const aboutUs = {
  "zh-CN":"https://www.gainbit.com/zh/_cn-about-us/",
  "zh-TW":"https://www.gainbit.com/hk/about-us-hk/",
  "en-US":"https://www.gainbit.com/"
}

const promotion = {
  "zh-CN":"https://www.gainbit.com/zh/promotion-zh/",
  "zh-TW":"https://www.gainbit.com/hk/promotion-hk-tc/",
  "en-US":"https://www.gainbit.com/promotion/"
}


const newProject = {
  "zh-CN":"https://www.gainbit.com/zh/projects-zh/",
  "zh-TW":"https://www.gainbit.com/hk/projects-hk-tc/",
  "en-US":"https://www.gainbit.com/projects/"
}

const userEducation = {
  "zh-CN":"https://gainbit.zendesk.com/hc/zh-cn",
  "zh-TW":"https://gainbit.zendesk.com/hc/zh-tw",
  "en-US":"https://gainbit.zendesk.com/hc/en-001"
}

const appDownload = {
  "zh-CN":"https://www.gainbit.com/zh/app-zh/",
  "zh-TW":"https://www.gainbit.com/hk/app-cn/",
  "en-US":"https://www.gainbit.com/app/"
}


let interval = null;
@connect(
  state => ({
    locale: state.Intl.locale,
    loggedIn: state.Account.loggedIn,
    userInfo: state.Account.userInfo,
    unreadMsgCount: state.Account.unreadMsgCount
  })
)
class Header extends PureComponent {
  constructor(props) {
    super(props);
    this.arr = props.arr || SelectArr;
    this.state = {
      navLeft: [['exchange','/exchange-ex'],['exchange-td']],
      navLeftLogin: [],
      navRight: ['login', 'register'],
      selectValue: this._defaultName(this.arr),
    };
  }
  logout = () => {
    // console.log('userinfo',this.props.userInfo)
    // console.log(JSON.parse(sessionStorage.getItem('token')))
    this.props.dispatch({type:'Account/logout',payload: {
      ...this.props.userInfo,
      token: JSON.parse(sessionStorage.getItem('token'))
    }})
  }

  componentWillMount(){
   this.getUnReadMsgCout(this.props.loggedIn);
  }

  componentWillReceiveProps(nextProps){
    if(this.props.loggedIn !== nextProps.loggedIn && nextProps.loggedIn){
      this.getUnReadMsgCout(nextProps.loggedIn);
    }
    else if(!nextProps.loggedIn){
      if(interval){
        clearInterval(interval);
      }
    }
  }

  getUnReadMsgCout = (loggedIn) => {
    const { dispatch } = this.props;
    if(loggedIn){
      dispatch({type: "Account/fetchUnreadMsgCount"});
      if(interval){
        clearInterval(interval);
      }
      interval = setInterval(() => {
        dispatch({type: "Account/fetchUnreadMsgCount"});
      },30000)
    }
  }

  _defaultName = arr => {
    const {locale} = this.props;
    const langs = arr.filter(item => item[1] === locale);
    let name = '中文(简)';
    if(langs && langs.length > 0){
      name = langs[0][0];
    }
    else{
      setLocale('zh-CN');
    }
    return name;
  };

  _getIco = local => {
    let ico = cn;
    switch(local){
      case "en-US":{
        ico = us;
        break;
      }
      case "zh-CN":{
        ico = cn;
        break;
      }
      case "zh-TW":{
        ico = hk;
        break;
      }
    }
    return ico;
  }

  _menuitemClick = ([name, label]) => {
    this.setState({
      selectValue: name
    });
    setLocale(label);
  };

  render() {
    const {
      navRight,
      selectValue
    } = this.state;
    const { pathname, loggedIn, locale, userInfo,unreadMsgCount } = this.props;
    const loginNav = [
      ...navUserCenter
    ];
    return (
      <header className={styles.header}>
        <nav
          className={styles.container}
          style={{
            maxWidth: '100%',
            height: '100%'
          }}
        >
          <div className={styles.navLeft}>
            <a className={styles.img_wrap} href={aboutUs[locale]} target="_blank">
               <img src={process.env.ENV_PARAM === "prd" ? Logo : Logo_Uat} width="127"/>
            </a>
            <label className={styles.header_drop1}>
              <a onMouseOver={() => {
                this.dropdown1.style.display = "block";
                this.dropdown2.style.display = "none";
                this.dropdown3.style.display = "none";
                }}><FormattedMessage id="centralized"/><i className={styles.icon}></i></a>       
              <ul ref={el => this.dropdown1 = el}  onMouseLeave={() => {
                this.dropdown1.style.display = "none";
                }}>
                <li><Link to="/exchange-ex"><FormattedMessage id="exchange"/></Link></li>
                <li><Link to="/exchange-td"><FormattedMessage id="exchange-td"/></Link></li>
              </ul>
            </label>
            <a href="https://dex.gainbit.com/" target="_blank" className={classnames(styles.header_nav_btn)}><FormattedMessage id="decentralized"/></a>
            <a href={promotion[locale]} target="_blank" className={classnames(styles.header_nav_btn)}><FormattedMessage id="promotion"/></a>
            <label className={styles.header_drop2} style={{marginLeft:"7px"}}>
              <a onMouseOver={() => {
                this.dropdown2.style.display = "block";
                this.dropdown1.style.display = "none";
                this.dropdown3.style.display = "none";
                }}><FormattedMessage id="learnMore"/><i className={styles.icon}></i></a>       
              <ul ref={el => this.dropdown2 = el}  onMouseLeave={() => {
                this.dropdown2.style.display = "none";
                }}>
                <li> <a href={newProject[locale]} target="_blank"><FormattedMessage id="newProject"/></a></li>
                <li> <a href={userEducation[locale]} target="_blank"><FormattedMessage id="userEducation"/></a></li>
              </ul>
            </label>
          </div>
          <div className={styles.navRight}>
            <a className={styles.appDowloadBox} href={appDownload[locale]} target="_blank">
              App
            </a>
            {loggedIn && 
              <Link to={"/ac/account/balance"} style={{ color: pathname === "/ac/account/balance" && mainColor }}><FormattedMessage id="balance" values={{icon:''}}/></Link>
            }           
            {loggedIn && 
              <Link to={"/ac/messages"} className={classnames(styles.notice_box,unreadMsgCount ? styles.notice_box_i :'')}>
                <img src={noitce} alt="noitce" className={styles.notice_ico}/>
              </Link>
            }
            {!loggedIn &&
              navRight.map(item => (
                <Link
                  key={item}
                  className={classnames(
                    styles.header_btn_menu,
                    styles[`header_btn_${item}`]
                  )}
                  to={`/${item}`}
                  style={{ color: pathname.indexOf(item) > -1 && mainColor }}
                >
                  <FormattedMessage id={item} />
                </Link>
              ))}
            {loggedIn && (
              <DropDown value={userInfo.mobile} width={locale==='en-US'?'205px':'160px'} dropColor={"rgba(17, 17, 17, 0.7)"}>
                {loginNav.map(([icon, name, path,isBlank=false]) => {
                  return !isBlank ? <Link key={name} to={path}>
                    <FormattedMessage
                      id={name}
                      values={{
                        icon: (
                          <span className={styles.chooseOrder}>
                            <img
                              src={icon}
                              alt="name"
                              /*onClick={() => {
                            this._changShow('');
                          }}*/
                            />
                          </span>
                        ),
                      }}
                    />
                  </Link> : <a key={name} href={path[locale]} target="blank">
                  <FormattedMessage
                      id={name}
                      values={{
                        icon: (
                          <span className={styles.chooseOrder}>
                            <img
                              src={icon}
                              alt="name"
                              /*onClick={() => {
                            this._changShow('');
                          }}*/
                            />
                          </span>
                        ),
                      }}
                    />
                  </a>
                 })}
              </DropDown>
            )}

            {loggedIn && (
              <Fragment>
              <a className={styles.logout} onClick={this.logout} style={{marginRight:0}}>
                <label style={{ margin: '0 15px 0 0' }}>|</label>
                <FormattedMessage className="logout_span" id="logout" />
              </a>
              </Fragment>
            )}
            {/*{loggedIn && (
              <Link to={`/ac/user-setting/trading-setting`} className={styles.setting_ico}>
                <img src={userSettingIcon} width="16" height="16" />
              </Link>
            )}*/}
             <label className={styles.header_drop3}>
              <a onMouseOver={() => {
                this.dropdown3.style.display = "block";
                this.dropdown1.style.display = "none";
                this.dropdown2.style.display = "none";
                }}>{selectValue}<img src={this._getIco(locale)} className={styles.l_img}/><i className={styles.icon}></i></a>       
              <ul ref={el => this.dropdown3 = el}  onMouseLeave={() => {
                this.dropdown3.style.display = "none";
                }}>
                {this.arr.map(([name,label])=> {
                return  <li key={label}><a onClick={() => this._menuitemClick([name, label])}><img src={this._getIco(label)}/>{name}</a></li>
                })}         
              </ul>
            </label>
          </div>
        </nav>
      </header>
    );
  }
}
export default Header