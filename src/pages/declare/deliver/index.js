import React from 'react';
import { connect } from 'dva';
import { IntlProvider } from 'umi-plugin-locale';
import classnames from 'classnames';
import SwitchBar from '@/components/switch-bar';
import DeliverOrder from './order/deliver';
import WeituoOrder from './order/weituo';
import DealOrder from './order/deal';
import DiYanOrder from './order/diyanfei';
import messages1 from '../messages.json';
import messages2 from '../../orderManage/messages.json';
import styles from '../styles.scss';

@connect(
  state=>({
    locale: state.Intl.locale
  })
)
class DeliverDeclare extends React.Component{

    state = {
      chose: 'jiaoshouApply'
    }
     
    handleSwitchChange = item => {
          this.setState({ chose: item});
    }
    render(){
        const { chose } = this.state;
        const { locale } = this.props;
        let messages = {...messages1[locale],...messages2[locale]};
        return    <IntlProvider locale={locale} messages={messages}>
        <div className={classnames(styles.container,styles.declareBox)}>  
            <div className={styles.SwitchBarBOx}>
                <SwitchBar
                    chose={ chose }
                    arr={['jiaoshouApply', 'weituo', 'declareDeal', 'diyanFei']}
                    onClick={item => this.handleSwitchChange(item)}
                />
            </div>

            {chose === 'jiaoshouApply' && <DeliverOrder/>}
            {chose === 'weituo' && <WeituoOrder/>}
            {chose === 'declareDeal' && <DealOrder/>}
            {chose === 'diyanFei' && <DiYanOrder/>}
        </div>
        </IntlProvider>
    }
}
export default DeliverDeclare;
