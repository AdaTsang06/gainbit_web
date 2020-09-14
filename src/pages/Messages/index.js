import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import SwitchBar from '@/components/switch-bar';
import Message from './record/Message';
// import Notice from './record/Notice';
import styles from './styles.scss';

@connect(
  state=>({
    locale: state.Intl.locale
  })
)
class DeliverDeclare extends React.Component{

    state = {
      chose: 'message'
    }
     
    handleSwitchChange = item => {
          this.setState({ chose: item});
    }
    render(){
        const { chose } = this.state;
        return <div className={classnames(styles.container,styles.declareBox)}>  
            <div className={styles.SwitchBarBOx}>
                <SwitchBar
                    chose={ chose }
                    arr={['message']}
                    onClick={item => this.handleSwitchChange(item)}
                />
            </div>

            {chose === 'message' && <Message/>}
            {/* {chose === 'notice' && <Notice/>} */}
        </div>
    }
}
export default DeliverDeclare;
