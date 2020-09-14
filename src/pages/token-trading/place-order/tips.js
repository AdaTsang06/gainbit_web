import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi-plugin-locale';
import { connect } from 'dva';
import ReactAudioPlayer from 'react-audio-player';
import success from '@/audios/order_success.wav';
import fail from '@/audios/order_fail.wav';
import styles from './styles.scss';

@connect(state => ({
  tipsList: state.global.tipsList,
}))
class Tips extends PureComponent {
  _checkRC(rc) {
    switch (rc) {
      case 0:
        return 'success';
      case -5:
        return 'cancel_by_system';
      case 2013:
        return 'reach_max_count';
      case 999:
        return 'excuted';
      default:
        return 'error';
    }
  }
  render() {
    const { tipsList } = this.props;
    const objectToArray = Object.keys(tipsList);
    return (
      <div>
        {objectToArray.length > 0 &&
          objectToArray.map((item, idx) => {
            const isCancelOrder =
              tipsList[item].MsgType === 'CancelOrderResponse' ||
              tipsList[item].MsgType === 'CancelAllOrdersResponse'
                ? 'cancel'
                : 'place';
            const isSuccess =
              tipsList[item].RC === 0 || tipsList[item].RC === 999;
            return (
              <div
                key={idx}
                className={styles.tips}
                style={{
                  top: `-${idx * 30}px`,
                  backgroundColor: isSuccess ? '#39b06e' : '#d13232',
                }}
              >
                <FormattedMessage
                  id={`${isCancelOrder}_order_${this._checkRC(
                    tipsList[item].RC
                  )}`}
                />
                <ReactAudioPlayer src={isSuccess ? success : fail} autoPlay />
              </div>
            );
          })}
      </div>
    );
  }
}
export default Tips