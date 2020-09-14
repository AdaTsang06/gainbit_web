import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-locale';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';
import Modal from '@/components/modal';
import styles from './styles.scss';

@connect(
  (state, ownProps) => ({
    currencyInfos: state.Account.currencyInfos,
    address: state.AcCenter.depositAddress,
    loading: state.Loading.fetchLoading,
  })
)
class Crypto extends PureComponent {
  state = {
    isShowModal: false,
  };
  componentWillMount() {
    //const { name } = this.props;
    this._generateAddress();
    // if (name == acCurrency) {
    //   this.setState({
    //     isShowModal: true,
    //   });
    // }
  }
  _hideModal = () => {
    this.setState({ isShowModal: false });
  };

  _generateAddress = () => {
    const { dispatch, name } = this.props;
    return dispatch({type:'AcCenter/getDepositAddress',payload:{ currency: name }});
  };
  _copy = () => {
    const { address,dispatch } = this.props;
    copy(address);
    dispatch({type:'global/showSuccessMessage',payload:'copy_success'});
  };
  render() {
    const { name, loading } = this.props;
    let { address, currencyInfos } = this.props;
    let currencyInfo = currencyInfos[name] || {};
    const deposit_min = currencyInfo && currencyInfo.deposit_min;
    const { isShowModal } = this.state;
    return (
      <div className={styles.crypto}>
        <FormattedMessage
          id="generate_address_tip_label"
          values={{ name: name ? name : '' }}
        />
        <div className={styles.crypto_address}>
          {address || <FormattedMessage id="generate_address_tip" />}
          <div className={styles.crypto_action}>
            {!address ? (
              <button disabled={loading} onClick={this._generateAddress}>
                <FormattedMessage
                  id="generate_address"
                  values={{ name: name ? name : '' }}
                />
              </button>
            ) : (
              <button onClick={this._copy}>
                <FormattedMessage id="copy_address" />
              </button>
            )}
          </div>
        </div>
        {address ? (
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
        ) : (
          <div className={styles.crypto_empty} />
        )}
        <div className={styles.crypto_span}>
          <FormattedMessage id="scan_to_charge" />
        </div>
        {!isShowModal ? (
          ''
        ) : (
          <Modal
            className="confirm_modal"
            bodyStyle={{ padding: '32px 32px 24px' }}
            width={400}
            visible={true}
          >
            <FormattedMessage id="notice" />
            <div>
              <div className="confirm_modal_title">
                <FormattedMessage id="deposit_cryptoUSDT" />
              </div>
              <div className="confirm_modal_action">
                <button onClick={this._hideModal}>
                  <FormattedMessage id="close" />
                </button>
              </div>
            </div>
          </Modal>
        )}

        <pre className={styles.crypto_deposit_warning}>
          <div>
            <FormattedMessage id="please_note" />
          </div>
          <FormattedMessage
            id="crypto_deposit_warning"
            values={{
              name,
              min: deposit_min,
            }}
          />
        </pre>
      </div>
    );
  }
}
export default Crypto