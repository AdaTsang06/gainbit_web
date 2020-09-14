import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'umi-plugin-locale';
import classnames from 'classnames';
import Logo from '@/assets/logo.png';
import SelectComponent from '@/components/select-language';
import DropDown from '@/components/drop-down';
import { mainColor, mainBg, contentBg } from '../common/color';
import { androidDwUrl } from '../common/constants';
import { navUserCenter } from '../common/menu';
import styles from './index.scss';
import kycIco from '@/assets/userCenter/account-center.png';
import wecaht from '@/assets/wechat.png';
import noitce from '@/assets/noitce.png';


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
    this.state = {
      navLeft: [['exchange','/exchange-ex'],['exchange-td']],
      navLeftLogin: [
        // [
        //   'footer2_content2',
        //   '',
        //   '',
        // ],
      ]
     ,
      navRight: ['login', 'register'],
    };
  }
  logout = () => {
    this.props.dispatch({type:'Account/logout'})
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

  render() {
    const {
      navLeft,
      navRight,
      navLeftLogin,
    } = this.state;
    const { pathname, loggedIn, locale, userInfo,unreadMsgCount } = this.props;
    const loginNav = [
      ...navUserCenter
    ];
    // if(userInfo.kyc < 2){
    //   loginNav.unshift( [
    //     kycIco,
    //     'kyc',
    //      userInfo ? `/ac/user-setting/kyc/personal/${userInfo.kyc}`:'/ac/account/balance',
    //   ]);
    // }
    return (
      <header className={styles.header} style={{ backgroundColor:( pathname === '/login' ||
      pathname.indexOf('/register') !== -1 ) ? contentBg : (pathname === '/home' ? 'transparent':mainBg) }}>
        <nav
          className={styles.container}
          style={{
            maxWidth: '100%',
            height: '100%'
          }}
        >
          <div className={styles.navLeft}>
            <Link className={styles.img_wrap} to="/">
               <img src={Logo}/>
            </Link>
            {navLeft.map(([item, link]) => {
              const result = link ? (
                <Link
                  className={classnames(
                    styles.header_nav_btn,
                    pathname.indexOf(link) > -1 && styles.header_btn_active
                  )}
                  key={item}
                  to={link}
                  rel="noopener noreferrer"
                >
                  <FormattedMessage id={item} />
                </Link>
              ) : (
                <Link
                  key={item}
                  className={classnames(
                    styles.header_nav_btn,
                    pathname.indexOf(item) > -1 && styles.header_btn_active
                  )}
                  to={`/${item}`}
                >
                  <FormattedMessage id={item} />
                </Link>
              );
              return result;
            })}

            {navLeftLogin.map(([item, linkZh, linkEn]) => {                                                    
              return ( <a
                className={classnames(
                  styles.header_nav_btn,
                  pathname.indexOf(item) > -1 && styles.header_btn_active
                )}
                key={item}
                href={locale == 'en-US'?linkEn:linkZh}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FormattedMessage id={item} />
              </a>);
            })}         
          </div>
          <div className={styles.navRight}>
            <a className={styles.appDowloadBox} href={androidDwUrl}>
              <FormattedMessage id="header_dowload"/>
              <img src={wecaht} alt="wechat" />
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
              <DropDown value={userInfo.mobile} width={locale==='en-US'?'200px':'160px'}>
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
                  </Link> : <a key={name} href={path} target="blank">
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
                <label style={{ margin: '0 20px 0 14px' }}>|</label>
                <FormattedMessage className="logout_span" id="logout" />
              </a>
              </Fragment>
            )}
            {/*{loggedIn && (
              <Link to={`/ac/user-setting/trading-setting`} className={styles.setting_ico}>
                <img src={userSettingIcon} width="16" height="16" />
              </Link>
            )}*/}
            <SelectComponent />
          </div>
        </nav>
      </header>
    );
  }
}
export default Header