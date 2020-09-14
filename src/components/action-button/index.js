import React from 'react';
import { FormattedMessage } from 'umi-plugin-locale';
import { connect } from 'dva';
import styles from './styles.scss';
import classnames from 'classnames/bind';

const cx = styles::classnames;

@connect(state => ({
  loading: state.Loading.submitLoading
}))
class ActionButton extends React.PureComponent {
  render() {
    const { id, style, loading, isDisalbed } = this.props;
    const classes = cx('action_button', {
      action_button_loading: loading,
    });
    return (
      <button
        type="submit"
        className={classes}
        style={style}
        disabled={loading || isDisalbed}
      >
        <FormattedMessage id={id} />
      </button>
    );
  }
}
export default ActionButton
