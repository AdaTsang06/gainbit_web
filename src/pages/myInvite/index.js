import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-locale';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';
import Facebook from '@/assets/svg/fb';
import Twitter from '@/assets/svg/tw';
import Weibo from '@/assets/svg/wb';
import styles from './styles.scss';

@connect(
  (state) => ({
    userInfo: state.Account.userInfo,
    inviteInfo: state.Account.inviteInfo
  })
)
class MyInvite extends PureComponent {
  state = {
    address:''
  };
  componentWillMount() {
    this.props.dispatch({type:"Account/getInviteInfo", payload:{}})
    const { userInfo } = this.props;
    const regLink = `${window.location.origin}/register`;
    if(userInfo.invite_code){
      this.setState({address:`${regLink}/${userInfo.invite_code}`})
    }
    else{
      this.setState({address:`${regLink}`})
    }
  }
  _copyCode = () => {
    const { userInfo } = this.props;
    copy(userInfo.invite_code || '');
    this.props.dispatch({type:'global/showSuccessMessage',payload:'copy_success'});
  };
  _copyLink = () => {
    const { address } = this.state;
    copy(address);
    this.props.dispatch({type:'global/showSuccessMessage',payload:'copy_success'});
  };

  windowOpen = url => {
    const windowWidth = 550;
    const windowHeight = 400;
    const left =
      window.outerWidth / 2 +
      (window.screenX || window.screenLeft || 0) -
      windowWidth / 2;
    const top =
      window.outerHeight / 2 +
      (window.screenY || window.screenTop || 0) -
      windowHeight / 2;
    const config = {
      centerscreen: 'yes',
      chrome: 'yes',
      directories: 'no',
      height: windowHeight,
      left,
      location: 'no',
      menubar: 'no',
      resizable: 'no',
      scrollbars: 'yes',
      status: 'no',
      toolbar: 'no',
      top,
      width: windowWidth,
    };
    const features = Object.keys(config)
      .map(key => `${key}=${config[key]}`)
      .join(', ');
    window.open(url, '', features);
  };
  render() {
    const { address } = this.state;
    const { inviteInfo } = this.props;
    const msg = "邀请注册";
    return (
      <div className={styles.container}>
        <div className={styles.inviteBox}>
          <div  className={styles.inviteInfo}>
            <div><FormattedMessage id="invitePersonNum"/>{inviteInfo.count}</div>
             <div><FormattedMessage id="totalrebate"/>{inviteInfo.rebate} {inviteInfo.rebate_currency}</div>
          </div>
          <QRCode
                style={{
                  width: '170px',
                  height: '170px',
                  margin: 'auto',
                  display: 'block',
                  border: '5px solid #fff',
                }}
                value={address || ''}
              />
          <div className={styles.codeDesc}>
           <FormattedMessage id="scanCode" />
          </div>
          <div className={styles.copyBox}>
             <span className={styles.copyBox_label}><FormattedMessage id="myInviteCode" values={{icon:''}}/></span>
             <div className={styles.copyBox_item}>
              <span>{this.props.userInfo.invite_code}</span>
              <button className="submit_button" onClick={this._copyCode}><FormattedMessage id="copyInviteCode"/></button>
             </div>
          </div>
          <div className={styles.copyBox}>
             <span className={styles.copyBox_label}><FormattedMessage id="inviteLink"/></span>
             <div className={styles.copyBox_item}>
              <span>{address}</span>
              <button className="submit_button" onClick={this._copyLink}><FormattedMessage id="copyLink"/></button>
             </div>
          </div>
          <div className={styles.share_item}>
              <FormattedMessage id="share" />
              <div className={styles.share_con}>
                <a
                  className="facebook-share-button"
                  onClick={this.windowOpen.bind(
                    this,
                    `https://www.facebook.com/dialog/share?display=popup&href=${address}`
                  )}
                >
                  <Facebook color="#fefefe" />
                </a>
                <br />
                <a
                  className="twitter-share-button"
                  onClick={this.windowOpen.bind(
                    this,
                    `https://twitter.com/intent/tweet?text=${
                      msg
                    }&url=${address}`
                  )}
                >
                  <Twitter color="#fefefe" />
                </a>
                <br />

                <a
                  className="facebook-share-button"
                  onClick={this.windowOpen.bind(
                    this,
                    `http://service.weibo.com/share/share.php?url=${address}&appkey=&title=${
                      msg
                    }&pic=&ralateUid=`
                  )}
                >
                  <Weibo color="#fefefe" />
                </a>
                <br />
              </div>
            </div>
        </div>
      </div>
    );
  }
}
export default MyInvite