import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import KYC from '@/pages/user-setting/kyc';

@withRouter
class KYCAuth extends PureComponent {
  render() {
    const {
      match: { path },
    } = this.props;
    return (
      <div style={{ width: '100%' }}>
        <KYC templatePath={path + 'user-setting/security-setting'} />
      </div>
    );
  }
}
export default  KYCAuth