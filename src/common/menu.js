import acSecuriyIcon from '@/assets/userCenter/ac_security.png';
import assertIcon from '@/assets/userCenter/my-assets.png';
import cfhistory from '@/assets/userCenter/finance_history.png';
import myInvite from '@/assets/userCenter/my_invite.png';
import fankui from '@/assets/userCenter/fankui.png';
import lock from '@/assets/userCenter/lock_web_icon.png';

export const navUserCenter = [
  // [
  //   assertIcon,
  //   'balance',
  //   '/ac/account/balance',
  // ],
  [
    acSecuriyIcon,
    'security-setting',
    '/ac/user-setting/security-setting'
  ],
  [cfhistory, 'history', '/ac/account/history'],
  [lock, 'lockHistory', '/ac/account/lockHistory'],
  [assertIcon, 'orderManage', '/ac/orderManage'],
  [myInvite, 'myInvite', '/ac/myInvite'],
  //[fankui, 'feedback', '/ac/feedback'],
  [fankui, 'feedback', {
  "zh-CN":"https://gainbit.zendesk.com/hc/zh-cn/requests/new",
  "zh-TW":"https://gainbit.zendesk.com/hc/zh-tw/requests/new",
  "en-US":"https://gainbit.zendesk.com/hc/en-001/requests/new"
},true]
  // [transacSetting, 'trading-setting', '/ac/user-setting/trading-setting'],
];
