/* eslint-disabled */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { FormattedMessage} from 'umi-plugin-locale';
//import Service from '@/containers/guide/service';
import styles from './styles.scss';

@connect(
  state => ({
    locale: state.Intl.locale}
    )
)
class Agreement extends PureComponent {
  removeTemplate = () =>{
    this.props.dispatch({type:'Notification/changeTemplate'})
  }
  render() {
    return (
        <div className={styles.confirm} style={{ width: '100%' }}>
          <div className={styles.confirm_header}>
            <FormattedMessage id="agreement_title" />
          </div>
          <div
            className={styles.confirm_body}
            style={{ overflow: 'hidden', width: '600px', height: '600px' }}
          >
            {/* <Service /> */}
          </div>
          <div className={styles.confirm_footer}>
            <button onClick={this.removeTemplate}>
              <FormattedMessage id="close" />
            </button>
          </div>
        </div>
    );
  }
}
export default Agreement;