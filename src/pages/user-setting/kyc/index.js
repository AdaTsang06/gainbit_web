import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-locale';

import Modal from '@/components/modal';
import Fail from '@/assets/svg/fail';
import Level from './level';
import styles from './styles.scss';
import classnames from 'classnames/bind';
import common from '@/css/common.scss';

@withRouter
@connect(
  state => ({
    showError: state.KYC.showError,
    rejectReason: state.KYC.rejectReason,
    locale:state.Intl.locale
  }),
  dispatch => ({
    _hideIdError: () => dispatch({ type: 'ID_ERROR', show: false }),
  })
)
class KYC extends PureComponent {
  render() {
    const {
      match: { path },
      showError,
      rejectReason,
      _hideIdError,
      // checkPath,
    } = this.props;
    return (
      <div className={classnames(common.container, styles.container)} style={{minHeight: 'auto', marginBottom: '0'}}>
        <div className={styles.kyc}>
          <Level {...this.props}/>
          <Modal
            className="confirm_modal"
            bodyStyle={{ padding: '32px 32px 24px' }}
            width={600}
            visible={showError}
          >
            <div className="confirm_modal_title">
              <Fail />
              {rejectReason ? (
                <FormattedMessage id="reject_reason" />
              ) : (
                <FormattedMessage id="kyc_id_warning" />
              )}
            </div>
            {rejectReason && (
              <div className={styles.reject_reason}>{rejectReason}</div>
            )}
            <div className="confirm_modal_action">
              <button onClick={_hideIdError}>
                <FormattedMessage id="close" />
              </button>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}
export default  KYC