import React from 'react';
import { FormattedMessage } from 'umi-plugin-locale';

const agreement = ({ level }) =>
  level === 2 ? (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://s3-ap-northeast-1.amazonaws.com/exchangekycauth/media/public/KYC+L2+%E7%94%A8%E6%88%B7%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE_20180608.pdf"
      style={{ paddingLeft: '5px' }}
    >
      <FormattedMessage id="service_agreement" />
    </a>
  ) : (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://s3-ap-northeast-1.amazonaws.com/exchangekycauth/media/public/KYC+L3+%E7%94%A8%E6%88%B7%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE_20180607.pdf"
      style={{ paddingLeft: '5px' }}
    >
      <FormattedMessage id="service_agreement" />
    </a>
  );

export default agreement;
