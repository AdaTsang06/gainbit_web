import React from 'react';
import Dialog from 'rc-dialog';
/*eslint-disable*/
import '!style-loader!css-loader!rc-dialog/assets/index.css';

export default class Modal extends React.PureComponent {
  render() {
    const { children } = this.props;
    return (
      <Dialog closable={false} wrapClassName="center" {...this.props}>
        {children}
      </Dialog>
    );
  }
}
