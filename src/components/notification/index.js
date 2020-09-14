import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-locale';
import { withRouter, Link } from 'react-router-dom';
import close from '@/assets/close.png';
import Forgot from './forgot';
import Confirm from './confirm';
//import Agreement from './agreement';
import ProductIntroduction from './product-introduction';
//import Address from './address';
//import AddBank from './addBank';
// import Verify from './verify';
import Deposit from './deposit';
import Withdraw from './withdraw';
//  import KYCAuth from './kycAuth';
import Transfer from './transfer';
import Deliver from './deliver';
import Neutral from './neutral';
import Lock from './lock';
import UnLock from './unLock';
import styles from './styles.scss';

@connect(
  state => ({
    template: state.Notification.template,
  }),
  dispatch => ({
    _removeTemplate: () => dispatch({type:'Notification/changeTemplate'}),
  })
)
@withRouter
class Notification extends PureComponent {
  componentDidMount() {
    window.document.body.style.overflow = 'hidden';
  }

  componentWillUnmount() {
    window.document.body.style.overflow = 'auto';
  }

  _goKyc = () => {
    const { history, _removeTemplate } = this.props;
    _removeTemplate();
    history.push('/ac/user-setting/kyc');
  };
  _goAuth = () => {
    const { history, _removeTemplate } = this.props;
    _removeTemplate();
    history.push('/ac/user-setting/security-setting');
  };
  render() {
    const { template, _removeTemplate } = this.props;
    let msg = '',
      coin = '',
      symbolInfo = {},
      order = {},
      symbolid= 0;
    if (template) {
      msg = template.type;
      coin = template.coin || '';
      order = template.order && { ...template.order } || {};
      symbolInfo = template.symbolInfo || {};
      symbolid = template.symbolid || 0;
    }
    switch (msg) {
      // case 'agreement':
      //   return (
      //     <div className={styles.notification}>
      //       <div
      //         style={{ background: 'transparent', width: 'auto' }}
      //         className={styles.notification_content}
      //       >
      //         <Agreement />
      //       </div>
      //     </div>
      //   );
      case 'product-introduction':
        return (
          <div className={styles.notification}>
            <div
              style={{ background: 'transparent', width: 'auto' }}
              className={styles.notification_content}
            >
              <ProductIntroduction symbolInfo={symbolInfo} />
            </div>
          </div>
        );
      case 'order_confirm':
        return (
          <div className={styles.notification}>
            <div
              style={{ background: 'transparent', width: 'auto' }}
              className={styles.notification_content}
            >
              <Confirm type={1} />
            </div>
          </div>
        );
      case 'order_cancel_confirm':
        return (
          <div className={styles.notification}>
            <div
              style={{ background: 'transparent', width: 'auto' }}
              className={styles.notification_content}
            >
              <Confirm type={0} />
            </div>
          </div>
        );
      case 'forgot':
        return (
          <div className={styles.notification}>
            <div
              className={styles.notification_content}
              style={{ width: '460px', background: '#fff' }}
            >
              <div
                className={styles.notification_header}
                style={{ background: '#fff' }}
              >
                {/*<h3 className={styles.notification_title}>
                  <FormattedMessage id="forgot_password" />
                </h3>*/}
                <span
                  className={styles.notification_close}
                  onClick={_removeTemplate}
                >
                  <img src={close} alt="close" />
                </span>
              </div>
              <div className={styles.notification_body}>
                <Forgot />
              </div>
            </div>
          </div>
        );
      // case 'create_withdraw_address':
      //   return (
      //     <div className={styles.notification}>
      //       <div className={styles.notification_content}>
      //         <div className={styles.notification_header}>
      //           <h3 className={styles.notification_title}>
      //             <FormattedMessage id="add_address" />
      //           </h3>
      //           <span
      //             className={styles.notification_close}
      //             onClick={_removeTemplate}
      //           >
      //             <img src={close} alt="close" />
      //           </span>
      //         </div>
      //         <div className={styles.notification_body}>
      //           <Address />
      //         </div>
      //       </div>
      //     </div>
      //   );
      // case 'create_withdraw_bank':
      //   return (
      //     <div className={styles.notification}>
      //       <div className={styles.notification_content}>
      //         <div className={styles.notification_header}>
      //           <h3
      //             className={styles.notification_title}
      //             style={{ textAlign: 'left' }}
      //           >
      //             <FormattedMessage id="add_bank_account_title" />
      //           </h3>
      //           <span
      //             className={styles.notification_close}
      //             onClick={_removeTemplate}
      //           >
      //             <img src={close} alt="close" />
      //           </span>
      //         </div>
      //         <div className={styles.notification_body}>
      //           <AddBank />
      //         </div>
      //       </div>
      //     </div>
      //   );
      case 'deposit_kyc_tip':
        return (
          <div className={styles.notification}>
            <div className={styles.notification_content}>
              <div className={styles.notification_header}>
                <span
                  style={{ right: '35px', width: 'auto', fontSize: '14px' }}
                  className={styles.notification_close}
                  onClick={_removeTemplate}
                >
                  <Link to="/ac/account/balance">
                    <FormattedMessage id="go_back" />
                  </Link>
                </span>
              </div>
              <div className={styles.notification_body}>
                <p>
                  <FormattedMessage id="deposit_kyc_tip" />
                </p>
                <button onClick={this._goKyc} className={styles.normal_button}>
                  <FormattedMessage id="go_to_setting" />
                </button>
              </div>
            </div>
          </div>
        );
      case 'withdraw_kyc_tip':
        return (
          <div className={styles.notification}>
            <div className={styles.notification_content}>
              <div className={styles.notification_header}>
                <span
                  className={styles.notification_close}
                  onClick={_removeTemplate}
                >
                  <img src={close} alt="close" />
                </span>
              </div>
              <div className={styles.notification_body}>
                <p>
                  <FormattedMessage id="withdraw_kyc_tip" />
                </p>
                <button onClick={this._goKyc} className={styles.normal_button}>
                  <FormattedMessage id="go_to_setting" />
                </button>
              </div>
            </div>
          </div>
        );
      case 'withdraw_auth_tip':
        return (
          <div className={styles.notification}>
            <div className={styles.notification_content}>
              <div className={styles.notification_header}>
                <span
                  className={styles.notification_close}
                  onClick={_removeTemplate}
                >
                  <img src={close} alt="close" />
                </span>
              </div>
              <div className={styles.notification_body}>
                <p>
                  <FormattedMessage id="auth_tip" />
                </p>
                <button onClick={this._goAuth} className={styles.normal_button}>
                  <FormattedMessage id="go_to_setting" />
                </button>
              </div>
            </div>
          </div>
        );
      case 'deposit':
        return (
          <div className={styles.notification}>
            <div className={styles.notification_content}>
              <div className={styles.notification_header}>
                <h3
                  className={styles.notification_title}
                  style={{ textAlign: 'left' }}
                >
                  <FormattedMessage id="deposit" /> {coin}
                </h3>
                <span
                  className={styles.notification_close}
                  onClick={_removeTemplate}
                >
                  <img src={close} alt="close" />
                </span>
              </div>
              <div className={styles.notification_body}>
                <Deposit coin={coin} />
              </div>
            </div>
          </div>
        );
      case 'withdraw':
        return (
          <div className={styles.notification}>
            <div className={styles.notification_content}>
              <div className={styles.notification_header}>
                <h3
                  className={styles.notification_title}
                  style={{ textAlign: 'left' }}
                >
                  <FormattedMessage id="withdrawCoin" /> {coin}
                </h3>
                <span
                  className={styles.notification_close}
                  onClick={_removeTemplate}
                >
                  <img src={close} alt="close" />
                </span>
              </div>
              <div className={styles.notification_body}>
                <Withdraw coin={coin} />
              </div>
            </div>
          </div>
        );
        case 'transfer':
          return (
            <div className={styles.notification}>
              <div className={styles.notification_content}>
                <div className={styles.notification_header}>
                  <h3
                    className={styles.notification_title}
                    style={{ textAlign: 'left' }}
                  >
                    <FormattedMessage id="transfer" />
                  </h3>
                  <span
                    className={styles.notification_close}
                    onClick={_removeTemplate}
                  >
                    <img src={close} alt="close" />
                  </span>
                </div>
                <div className={styles.notification_body}>
                  <Transfer/>
                </div>
              </div>
            </div>
          );
          case 'lock':
            return (
              <div className={styles.notification}>
                <div className={styles.notification_content}>
                  <div className={styles.notification_header}>
                    <h3
                      className={styles.notification_title}
                      style={{ textAlign: 'left' }}
                    >
                      <FormattedMessage id="lockCoin" /> {coin}
                    </h3>
                    <span
                      className={styles.notification_close}
                      onClick={_removeTemplate}
                    >
                      <img src={close} alt="close" />
                    </span>
                  </div>
                  <div className={styles.notification_body}>
                    <Lock coin={coin} />
                  </div>
                </div>
              </div>
            );
            case 'unLock':
              return (
                <div className={styles.notification}>
                  <div className={styles.notification_content}>
                    <div className={styles.notification_header}>
                      <h3
                        className={styles.notification_title}
                        style={{ textAlign: 'left' }}
                      >
                        <FormattedMessage id="unLockCoin" /> {coin}
                      </h3>
                      <span
                        className={styles.notification_close}
                        onClick={_removeTemplate}
                      >
                        <img src={close} alt="close" />
                      </span>
                    </div>
                    <div className={styles.notification_body}>
                      <UnLock coin={coin} />
                    </div>
                  </div>
                </div>
              );
          case 'deliver':
            return (
              <div className={styles.notification}>
                <div className={styles.notification_content}>
                  <div className={styles.notification_header}>
                    <h3
                      className={styles.notification_title}
                      style={{ textAlign: 'left' }}
                    >
                      <FormattedMessage id="deliverDeclare" />
                    </h3>
                    <span
                      className={styles.notification_close}
                      onClick={_removeTemplate}
                    >
                      <img src={close} alt="close" />
                    </span>
                  </div>
                  <div className={styles.notification_body}>
                    <Deliver symbolid={symbolid}/>
                  </div>
                </div>
              </div>
            );
            case 'neutral':
              return (
                <div className={styles.notification}>
                  <div className={styles.notification_content}>
                    <div className={styles.notification_header}>
                      <h3
                        className={styles.notification_title}
                        style={{ textAlign: 'left' }}
                      >
                        <FormattedMessage id="neutralDeclare" />
                      </h3>
                      <span
                        className={styles.notification_close}
                        onClick={_removeTemplate}
                      >
                        <img src={close} alt="close" />
                      </span>
                    </div>
                    <div className={styles.notification_body}>
                      <Neutral symbolid={symbolid}/>
                    </div>
                  </div>
                </div>
              );
      // case 'verification_modal':
      //   return (
      //     <div className={styles.notification}>
      //       <div className={styles.notification_content}>
      //         <div className={styles.notification_header}>
      //           <h3 className={styles.notification_title}>
      //             <FormattedMessage id="verify_again" />
      //           </h3>
      //           <span
      //             className={styles.notification_close}
      //             onClick={_removeTemplate}
      //           >
      //             <img src={close} alt="close" />
      //           </span>
      //         </div>
      //         <div className={styles.notification_body}>
      //           <Verify />
      //         </div>
      //       </div>
      //     </div>
      //   );
      // case 'kyc_auth':
      //   return (
      //     <div className={styles.notification}>
      //       <div className={styles.notification_content}>
      //         <div className={styles.notification_header}>
      //           <h3
      //             className={styles.notification_title}
      //             style={{ textAlign: 'left' }}
      //           >
      //             <FormattedMessage id="kyc_auth" />
      //           </h3>
      //           <span
      //             className={styles.notification_close}
      //             onClick={_removeTemplate}
      //           >
      //             <img src={close} alt="close" />
      //           </span>
      //         </div>
      //         <div className={styles.notification_body}>
      //           <KYCAuth />
      //         </div>
      //       </div>
      //     </div>
      //   );
      default:
        return (
          <div className={styles.notification}>
            <div className={styles.notification_success}>{msg}</div>
          </div>
        );
    }
  }
}
export default  Notification