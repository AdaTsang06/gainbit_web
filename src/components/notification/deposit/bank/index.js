import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi-plugin-locale';
import { connect } from 'dva';
import styles from './styles.scss';

@connect(
  state => ({
    userInfo: state.Account.userInfo,
    depositBankCode: state.Address.depositBankCode,
  })
)
class Bank extends PureComponent {
  componentWillMount() {
    this.props.dispatch({type:'getDepositBankCode'})
  }
  componentWillReceiveProps(nextProps) {
    const { userInfo } = nextProps;
    if (this.props.userInfo !== userInfo) {
      if (userInfo.kyc < 1) {
        this.props.dispatch({type:'Notification/changeTemplate',payload:{type:'deposit_kyc_tip'}})
      }
    }
  }
  render() {
    const { depositBankCode, userInfo, locale } = this.props;
    const data = [
      {
        title: <FormattedMessage id="withdrawal_bank" />,
        body: 'China Minsheng Banking Corp.',
      },
      {
        title: <FormattedMessage id="bank_address" />,
        body: 'No. 836, Dong Fang Road, Pudong Shanghai 200120, China',
      },
      {
        title: <FormattedMessage id="swift_code" />,
        body: 'MSBCCNBJ002',
      },
      {
        title: <FormattedMessage id="account_number" />,
        body: 'NRA047687',
      },
      {
        title: <FormattedMessage id="beneficiary_name" />,
        body: 'Pro Gold Trading Limited',
      },
      {
        title: <FormattedMessage id="account_country" />,
        body: 'China',
      },
      {
        title: <FormattedMessage id="reference_number" />,
        body: (
          <FormattedMessage
            id="reference_number_note"
            values={{ code: depositBankCode }}
          />
        ),
      },
    ];
    const helpLink = (
      <a
        style={{ color: '#4a90e2' }}
        rel="noopener noreferrer"
        target="_blank"
        href={`${
          locale === "zh-TW"
            ? 'https://gx.kf5.com/hc/kb/article/1146472/?lang=en'
            : 'https://gx.kf5.com/hc/kb/article/1146471/'
        }`}
      >
        <FormattedMessage id="help_center" />
      </a>
    );
    const guideLink = (
      <a
        style={{ color: '#4a90e2' }}
        rel="noopener noreferrer"
        href="https://www.gx.com/guide/fee"
      >
        <FormattedMessage id="help_link" />
      </a>
    );
    if (userInfo && userInfo.kyc < 1) {
      return null;
    }
    return (
      <div className={styles.fiat}>
        <div className={styles.fiat_header}>
          <FormattedMessage id="deposit_title" />
          <span style={{ color: '#4a90e2', marginLeft: '30px' }}>
            <FormattedMessage id="USD" />
          </span>
        </div>
        <div className={styles.fiat_table}>
          {data.map((item, index) => (
            <div key={index} className={styles.fiat_table_line}>
              <span className={styles.fiat_table_line_title}>{item.title}</span>
              <span className={styles.fiat_table_line_body}>{item.body}</span>
            </div>
          ))}
        </div>
        <pre className={styles.fiat_deposit_warning}>
          <div>
            <FormattedMessage id="please_note" />
          </div>
          {/*<FormattedMessage
            values={{ help: helpLink, guide: guideLink }}
            id="fiat_deposit_warning"
          />*/}
        </pre>
      </div>
    );
  }
}
export default Bank