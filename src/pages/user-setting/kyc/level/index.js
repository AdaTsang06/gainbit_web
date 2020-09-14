import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi-plugin-locale';
import { connect } from 'dva';
import diamondActive from '@/assets/diamond_active.png';
import diamondInactive from '@/assets/diamond_inactive.png';
import LevelOne from './level-one';
import LevelTwo from './level-two';
import LevelThree from './level-three';
import LevelFour from './level-four';

import styles from './styles.scss';
import { tabColor } from '../../../../common/color';

let levels = [
  { name: '1', active: 0 },
  { name: '2', active: 0 },
  { name: '3', active: 0 },
];

const activeTabColor = '#4a90e2';

@connect()
class Level extends PureComponent {
  componentWillUnmount(){
     this.props.dispatch({type:'KYC/updateState',payload:{
      kycIdInfo: {},
      riskAssessment: {},
      kycIdPhoto:{},
      headPhoto:'',
      backPhoto:'',
      addressPhoto:'',
      randNumber:'',
      handPhoto:''
     }})
  }
  render() {
    const {
      location,
    } = this.props;
    const level = parseInt(
      location.pathname.split('/')[location.pathname.split('/').length - 1]
    );
    const levelMap = {
      1: <LevelOne {...this.props}/>,
      2: <LevelTwo {...this.props}/>,
      3: <LevelThree {...this.props} />,
      4: <LevelFour {...this.props} />
    };
    levels = levels.map((item, index) => ({
      ...item,
      active: index === level - 1 ? 1 : 0,
    }));
    if(level > 3){
      levels[2].active = 1;
    }
    return (
      <div className={styles.kyc_level}>
        <div className={styles.kyc_level_title}>
          <FormattedMessage id="personal_account_verify" />
        </div>
        <div className={styles.kyc_level_slider}>
          {levels.map((l, index) => {
            const color = index < level - 1 ? '#4C638F' : tabColor;
            return (
              <span className={styles.kyc_level_slider_item} key={index}>
                <span
                  style={{ color: l.active ? activeTabColor : color,paddingRight:index < levels.length - 1?'10px':0  }}
                  className={styles.kyc_level_slider_item_name}
                >
                  <img
                    src={l.active ? diamondActive : diamondInactive}
                    alt="diamond"
                  />
                  <FormattedMessage id={`level${l.name}`} />
                </span>
                {index < levels.length - 1 && (
                  <span
                    style={{ background: l.active ? activeTabColor : '#365087' }}
                    className={styles.kyc_level_slider_line}
                  />
                )}
              </span>
            );
          })}
        </div>
        <div className={styles.kyc_level_content}>{levelMap[level]}</div>
      </div>
    );
  }
}
export default Level 