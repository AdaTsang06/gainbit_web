import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'umi-plugin-locale';
import { acTabColor } from '../../../common/color';
import diamondActive from '@/assets/diamond_active.png';
import diamondInactive from '@/assets/diamond_inactive.png';
import styles from './styles.scss';
const failColor = '#d13232';

const keys = [
  '',
  'USD_deposit_normal',
  'USD_withdraw',
  'crypto_deposit',
  'crypto_withdraw',
  // '',
];

const tableData = [
  {
    USD_deposit_normal: '—',
    USD_withdraw: '—',
    crypto_deposit: <FormattedMessage id="no_limit" />,
    crypto_withdraw: (
      <FormattedMessage values={{ value: 2 }} id="crypto_withdraw_unit" />
    ),
     status: '',
  },
  {
    USD_deposit_normal: (
      <FormattedMessage
        values={{ value: '2,000' }}
        id="USD_deposit_normal_unit"
      />
    ),
    USD_withdraw: '—',
    crypto_deposit: <FormattedMessage id="no_limit" />,
    crypto_withdraw: (
      <FormattedMessage values={{ value: 10 }} id="crypto_withdraw_unit" />
    ),
     status: '',
  },
  {
    USD_deposit_normal: (
      <FormattedMessage
        values={{ value: '50,000' }}
        id="USD_deposit_normal_unit"
      />
    ),
    USD_withdraw: (
      <FormattedMessage
        values={{ value: '50,000' }}
        id="USD_deposit_normal_unit"
      />
    ),
    crypto_deposit: <FormattedMessage id="no_limit" />,
    crypto_withdraw: (
      <FormattedMessage values={{ value: 100 }} id="crypto_withdraw_unit" />
    ),
     status: '',
  },
  {
    USD_deposit_normal: (
      <FormattedMessage
        values={{ value: '100,000' }}
        id="USD_deposit_normal_unit"
      />
    ),
    USD_withdraw: (
      <FormattedMessage
        values={{ value: '100,000' }}
        id="USD_deposit_normal_unit"
      />
    ),
    crypto_deposit: <FormattedMessage id="no_limit" />,
    crypto_withdraw: (
      <FormattedMessage values={{ value: 100 }} id="crypto_withdraw_unit" />
    ),
     status: '',
  },
];

@connect(
  null,
  dispatch => ({
    _removeTemplate: () => dispatch({type: 'Notification/changeTemplate'}),
  })
)
class BasicRender extends PureComponent {
  _getVerificationStatus = (level, status) => {
    const link = {
      not_started: (
        <Link
          style={{ color: acTabColor }}
          to={`/ac/user-setting/kyc/personal/${level}`}
        >
          <FormattedMessage id="verify_now" />
        </Link>
      ),
      manual_rejected: (
        <Link
          style={{ color: failColor }}
          to={`/ac/user-setting/kyc/personal/${level}`}
        >
          <FormattedMessage id="verify_failed" />
        </Link>
      ),
      manual_approved: (
        <Link
          style={{ color: acTabColor }}
          to={`/ac/user-setting/kyc/personal/${level}`}
        >
          <FormattedMessage id="verify_now" />
        </Link>
      ),
      submitted: <FormattedMessage id="verifyng" />,
    };
    return link[status];
  };
  render() {
    const kycLevel =  2;
    const kycLevelStatus = 'manual_approved';
    return (
      <Fragment>
        <div className={styles.kyc_title} style={{ color: acTabColor }}>
          <FormattedMessage id="personal_account" />
        </div>
        <div className={styles.kyc_container}>
          <div className={styles.kyc_level}>
            <div className={styles.kyc_level_column}>
              {keys.map((key, index) => (
                <span
                  style={{
                    justifyContent: 'flex-start',
                    height: index === 0 ? '38px' : '55px',
                  }}
                  className={styles.kyc_level_column_span}
                  key={index}
                >
                  {key && <FormattedMessage id={key} />}
                </span>
              ))}
            </div>
            {tableData.map((item, index) => {
              const isVerified = index <= kycLevel;
              const isUnverified = index - 2 >= kycLevel;
              return (
                <div className={styles.kyc_level_column} key={index}>
                  <span
                    style={{
                      background: isVerified ? '#25375D' : 'transparent',
                      height: '38px',
                      fontWeight: 700,
                    }}
                    className={styles.kyc_level_column_span}
                  >
                    <img
                      src={isVerified ? diamondActive : diamondInactive}
                      alt="diamond"
                    />
                    <FormattedMessage id="level" values={{ key: index + 1 }} />
                  </span>
                  {Object.keys(item).map((prop, idx) => {
                    let node = item[prop];
                    if (prop === 'status') {
                      if (isVerified) {
                        node = <FormattedMessage id="verified" />;
                      } else if (isUnverified) {
                        node = <FormattedMessage id="unverified" />;
                      } else {
                        node = this._getVerificationStatus(
                          kycLevel + 2,
                          kycLevelStatus
                        );
                      }
                    }
                    const color =
                      isUnverified && prop === 'status' ? '#91A2C8' : '#fff';
                    return (
                      <span
                        style={{
                          background: isVerified ? '#25375D' : 'transparent',
                          color:
                            isVerified && prop === 'status' ? '#31bb6a' : color,
                          justifyContent:
                            prop === 'status' ? 'center' : 'flex-end',
                        }}
                        key={idx}
                        className={styles.kyc_level_column_span}
                      >
                        {node}
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        <div
          className="action"
          style={{
            paddingTop: '20px',
            justifyContent: 'flex-end',
            display: 'flex',
          }}
        >
          <button
            className="submit_button"
            onClick={this.props._removeTemplate}
          >
            <FormattedMessage id="know" />
          </button>
        </div>
      </Fragment>
    );
  }
}
export default  BasicRender