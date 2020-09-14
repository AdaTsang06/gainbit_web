import React, { PureComponent, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { IntlProvider, FormattedMessage } from 'umi-plugin-locale';
import { connect } from 'dva';
import classnames from 'classnames/bind';
import { kyc_status, account_type, vip2LevelReverse } from '../../../common/constant-enum';
import styles from './styles.scss';
import common from '../../../css/common.scss';
import messages from './messages.json';
import changepwIco from '@/assets/userCenter/change-password.png'

const cx = styles:: classnames;

@withRouter
@connect(
  state => ({
    userInfo: state.Account.userInfo,
    locale: state.Intl.locale,
    kycStatusInfo: state.Account.kycStatusInfo,
    accountInfos: state.Account.accountInfos
  })
)
class SecuritySetting extends PureComponent {
  state = {
    data: [
      {
        name: <FormattedMessage id="reset_password" />,
        key: 'reset-password',
        action: 'reset',
        template: '/ac/user-setting/reset',
        ico: changepwIco,
        isLink: true
      }
    ],
  };
  componentDidMount() {
    this.props.dispatch({ type: 'Account/getKycStatus' });
  }

  attendAc = () => {
    this.props.dispatch(require('dva').routerRedux.push('/ac/account/balance'));
    this.props.dispatch({
      type: 'Notification/changeTemplate',
      payload: { type: 'lock', coin: "GCT" },
  })
  }
  
  render() {
    const {
      match: { path },
      locale,
      userInfo = {},
      kycStatusInfo
    } = this.props;
    const { data } = this.state;
    const profile = {};
    const kycLink = "/ac/user-setting/kyc/personal/1";
    const ac = this.props.accountInfos.filter(item => item.type === account_type.accountTypeEx)[0] || {};
    //const ac ={ vip_level: 1, vip2_level: 1}
    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div className={classnames(common.container, styles.container)}>
          <div className={styles.info_box}>
            <div className={styles.info_box_title}>
              <FormattedMessage id="basic-info" />
            </div>
            <div className={styles.info_box_info}>
              <div className={styles.info_item}>
                <label className={styles.info_label}><FormattedMessage id="account" />:</label>
                <label className={styles.info_data}>{userInfo.mobile}</label>
              </div>
              <div className={styles.info_item}>
                <label className={styles.info_label}><FormattedMessage id="userid" />:</label>
                <label className={styles.info_data}>{userInfo.id}</label>
              </div>
            </div>
          </div>
          <div className={styles.info_box}>
            <div className={styles.info_box_title}>
              <FormattedMessage id="kyc-info" />
            </div>
            <div className={styles.info_box_info}>
                 <div className={styles.info_item}>
                    <label className={styles.info_label}><FormattedMessage id="kyc-status" />:</label>
                    <label className={styles.info_data}>
                      <FormattedMessage id={ kycStatusInfo.status === kyc_status.checkPass? "kyc-authed" : (kycStatusInfo.status === kyc_status.checkPending ?"checkPending": (kycStatusInfo.status === kyc_status.checkRefused ? "checkRefused":"kyc-no-auth"))} />
                      {kycStatusInfo.status === kyc_status.checkPass && <i className={styles.info_ico}></i>}  
                    </label>
                 </div>
                 <div className={styles.info_item}>
                   {kycStatusInfo.status !== kyc_status.checkPass && (kycStatusInfo.comment || "")}
                 </div>
                <div className={styles.info_item} style={{justifyContent:"flex-end"}}>
                  {kycStatusInfo.status === kyc_status.checkRefused && <Link className={classnames("submit_button")} to={kycLink}> <FormattedMessage id="reToauto"/></Link>} 
                  {!kycStatusInfo.status && <Link className={classnames("submit_button")} to={kycLink}><FormattedMessage id="toAuth" /></Link>} 
                </div>         
            </div>
          </div>
          <div className={styles.info_box}>
            <div className={styles.info_box_title}>
              <FormattedMessage id="vipActivity" />
            </div>
            <div className={styles.info_box_info}>
            <div className={styles.info_item}>
                <label className={styles.info_label}><FormattedMessage id="lockLevel" />:</label>
                <label className={styles.info_data}>
                {ac.vip_level ? <Fragment>{ac.vip_level} <FormattedMessage id="levelLabel" /></Fragment>: <FormattedMessage id="noAttend" /> }
                </label>
                <label>
                  {ac.vip_level ? (ac.vip_level < 4 ? <a className={styles.info_Link} onClick={this.attendAc}><FormattedMessage id="upgrade" /></a> : "") : <a className={styles.info_Link} onClick={this.attendAc}><FormattedMessage id="attendAc" /></a> }
                </label>            
              </div>
              <div className={styles.info_item}>
                <label className={styles.info_label}><FormattedMessage id="debitLevel" />:</label>
                <label className={styles.info_data}>
                {ac.vip2_level ? vip2LevelReverse[ac.vip2_level] ? <FormattedMessage id={vip2LevelReverse[ac.vip2_level]} /> : ac.vip2_level : <FormattedMessage id="noAttend" /> }
                </label>
                <label>
                  {ac.vip2_level ? (ac.vip2_level < 4 ? <a className={styles.info_Link} onClick={this.attendAc}><FormattedMessage id="upgrade" /></a> : "") : <a className={styles.info_Link} onClick={this.attendAc}><FormattedMessage id="attendAc" /></a> }
                </label>   
              </div>
            </div>
          </div>  
          <div>
            <div
              className={styles.setting_header}
              style={{ borderBottom: '0 none' }}
            >
              <FormattedMessage id="security-setting" />
            </div>
            <ul className={styles.list}>
              {data.map(item => (
                <li key={item.key}>
                  <span>
                    <img src={item.ico} />
                    <span>
                      {item.name}                   
                    </span>
                  </span>
                  <span>
                    <span
                      className={cx({
                        status_open: profile[item.field],
                        status_close: !profile[item.field],
                      })}
                    >
                    </span>
                    <span>
                      {
                        item.isLink ? (<Link
                          className={
                            !profile[item.field]
                              ? 'submit_button'
                              : ''
                          }
                          to={item.template}
                        >
                          {item.action &&
                            !profile[item.field] && (
                              <FormattedMessage id={item.action} />
                            )}
                        </Link>) : (<div className={
                          !profile[item.field]
                            ? 'submit_button'
                            : ''
                        } onClick={item.template}> {item.action &&
                          !profile[item.field] && (
                            <FormattedMessage id={item.action} />
                          )}</div>)
                      }

                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </IntlProvider>
    );
  }
}
export default SecuritySetting