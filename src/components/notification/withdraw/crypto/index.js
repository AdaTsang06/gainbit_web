import React, { PureComponent } from 'react';
import { IntlProvider } from 'umi-plugin-locale';
import Form from './form';

export default class Crypto extends PureComponent {
  render() {
    const { coin } = this.props;
    return (
      <IntlProvider>
        <Form {...this.props} coin={coin} name={coin} />
      </IntlProvider>
    );
  }
}
