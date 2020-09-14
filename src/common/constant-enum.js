// 方向
export const dir = {
  foo: 0,
  buy: 1,
  sell: 2,
};

export const dir_reverse = {
  0: 'foo',
  1: 'buy',
  2: 'sell',
};

// 订单类型
export const order_type = {
  bar: 0,
  limit: 1,
  market: 2,
  stop: 3,
};

export const MARKET = 'market';
export const LIMIT = 'limit';
export const STOP = 'stop';

export const orderMap = {
  1: 'limit',
  2: 'market',
  3: 'stop',
};

// 产品状态
export const symbol_status = {
  symbol_status_non: 0,
  buy_sell: 1, // 可买可卖
  buy_only: 2, // 只能买
  sell_only: 3, // 只能卖
  disable: 4, // 不能买卖
};

// 产品交易手续费类型
export const symbol_fee_type = {
  symbol_fee_type_non: 0,
  percent: 1, // 按比例
  const: 2, // 固定
};

// 账户类型
export const account_type = {
  accountTypeNon: 0,
  accountTypeEx: 1, // 现货账号
  accountTypeTd: 2  // 杠杆账号
}

// 订单状态
export const  order_status = {
  all: 0,
  placed: 1,// 还没成交
  filled: 2,// 全部成交
  canceled: 3,// 取消
  partially: 8 // 部分成交
}

// 订单状态
export const  order_status_reverse = {
  0: 'all',
  1: 'placed',
  2: 'filled',
  3: 'canceled',
  8: 'partially' // 部分成交
}  

export const symbol_type ={
  symbol_type_non: 0,
  ex: 1, // 现货产品
  td: 2 // 延期产品
}

// 货币状态
export const spot_status = {
  spot_status_non: 0,
  deposit_withdraw: 1, // 可出入金
  deposit_only: 2, // 只能入金
  withdraw_only: 3, // 只能出金
  spot_status_disable: 4, // 不能出入金
};

// 货币类型
export const spot_type = {
  spot_type_non: 0,
  fiat: 1, // 法币
  digital: 2, // 数字货币
};

export const position_status = {
  position_status_non: 0,
  opened: 1,
  closed: 2
}

export const spot_change_reason = {
  fuzz: 0,
  trade: 1, // 交易
  deposit: 2, // 入金
  withdraw: 3, // 出金
  admin: 4, // 后台
  test: 5, // 测试
  fee: 6,
  transfer: 7,
  jiaoshou: 8,   // 交收
  deliverFee: 9, // 交收手续费
  deferFee: 10, // 递延费
  withdrawFee: 11,//提币手续费
  activatedReward: 12,//激活奖励
  welcomeReward: 13,//新用户交易奖励
  rebate: 14,//返佣
  lockReward:15, //锁定奖励
  botTransfer:16
};

export const getKeys = (key, item) => {
  const keys = [];
  if (key in item) {
    keys.push(key);
  }
  return keys;
};

export const transfer_dir = {
  transfer_non: 0,
  transfer_ex_td: 1,// 现货到延期
  transfer_td_ex: 2 // 延期到现货
}

export const transfer_dir_reverse = {
   0: '0',
   1: 'transferExTd',// 现货到延期
   2: 'transferTdEx' // 延期到现货
}

export const order_reason = {
  order_reason_non: 0, // 现货
  open_position: 1,  // 开仓
  close_position: 2, // 平仓
  force_close_position: 3 // 强平
}
export const order_reason_reverse = {
  0: '0', // 现货
  1: 'openPositon',  // 开仓
  2: 'closePosition', // 平仓
  3: 'forcePosition' // 强平
}

export const asset_status = {
  hidden: 1,
  show: 2
}

export const  deliver_type = {
  deliver_type_non: 0,
  deliver_type_user: 1,  // 用户提交的申请
  deliver_type_system: 2 // 系统提交的申请
}

export const  deliver_type_reverse = {
  1: "deliverTypeUser",  // 用户提交的申请
  2: "deliverTypeSystem" // 系统提交的申请
}


export const neutral_status = {
  neutral_status_non: 0,
  neutral_init: 1,    // 已申请
  neutral_filled: 2,   // 成交
  neutral_cancel: 3,    // 取消
  neutral_partially: 4 // 部分成交
}

export const deliver_status = {
  deliver_status_non: 0,
  deliver_init: 1,    // 申请成功
  deliver_success: 2, // 交收成功
  deliver_cancel:3 // 交收取消
}

export const  deliver_status_reverse = {
  0: 'all',
  1: 'placed',
  2: 'filled',
  3: 'canceled',
  4: 'partially' // 部分成交
}

export const  deposit_status_reverse = {
  0: 'depositStatusNon',
  1: 'depositStatusOngoing', // 进行中
  2: 'depositStatusSuccess',// 成功到账
  3: 'depositStatusConfiscate' // 没收
}

export const  withdraw_status = {
  withdraw_status_non: 0,
  withdraw_waiting_check: 1,   // 等待审核
  withdraw_check_success: 2,  // 审核通过
  withdraw_check_fail: 3,     // 审核失败
  withdraw_launch: 4,     // 已经发起出币
  withdraw_finish: 5 // 处理完成
}

export const  withdraw_status_reverse = {
  0: 'withdraw_status_non',
  1: 'withdraw_waiting_check',   // 等待审核
  2: 'withdraw_check_success',  // 审核通过
  3: 'withdraw_check_fail',     // 审核失败
  4: 'withdraw_launch',     // 已经发起出币
  5: 'withdraw_finish' // 处理完成
}

export const message_status_reverse = {
  0: 'message_status_non',
  1: 'message_status_unread', // 未读
  2: 'message_status_read'   // 已读
}

export const kyc_status = {
  pleaseSelect: 0,
  checkPending: 1, // 待审核
  checkPass: 2, // 审核通过
  checkRefused: 3 // 审核未通过
};

export const kyc_status_reverse = {
  0: "pleaseSelect",
  1: "checkPending", // 待审核
  2: "checkPass", // 审核通过
  3: "checkRefused" // 审核未通过
};

export const lockTypeReverse = {
  1: "lock",
  2: "unLock"
}

export const lockType = {
  lock: 1,
  unLock: 2
}

export const vip2LevelReverse = {
  1:"cuprum",
  2:"silver",
  3:"gold",
  4:"platinum"
}