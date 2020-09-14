import React from 'react';
import { FormattedMessage } from 'umi-plugin-locale';
import { dir, order_type,symbol_status, symbol_fee_type,order_status,
  spot_status,spot_change_reason,transfer_dir,deliver_status,neutral_status, lockType } from "./constant-enum"
// 方向
export const dirSel = [
  {
    name: <FormattedMessage id="all" />,
    value: 0,
  },
  { name: <FormattedMessage id="buy" />, value: dir.buy },
  { name: <FormattedMessage id="sell" />, value: dir.sell },
];
// 订单类型
export const orderTypeSel = [
  {
    name: <FormattedMessage id="all" />,
    value: 0,
  },
  {
    name: <FormattedMessage id="limit" />,
    value: order_type.limit,
  },
  {
    name: <FormattedMessage id="market" />,
    value: order_type.market,
  }
];
// 产品状态
export const symbolStatusSel = [
  {
    name: <FormattedMessage id="all" />,
    value: 0,
  },
  {
    name: <FormattedMessage id="buy_sell" />,
    value: symbol_status.buy_sell, // 可买可卖
  },
  {
    name: <FormattedMessage id="buy_only" />,
    value: symbol_status.buy_only, // 只能买
  },
  {
    name: <FormattedMessage id="sell_only" />,
    value: symbol_status.sell_only, // 只能卖
  },
  {
    name: <FormattedMessage id="disable" />,
    value: symbol_status.disable, // 不能买卖
  },
];
// 产品交易手续费类型
export const symbolFeeType = [
  {
    name: <FormattedMessage id="all" />,
    value: 0,
  },
  {
    name: <FormattedMessage id="percent" />,
    value: symbol_fee_type.percent, // 按比例
  },
  {
    name: <FormattedMessage id="const" />,
    value: symbol_fee_type.const, // 固定
  },
];
// 订单状态
export const orderStatusSel = [
  {
    name: <FormattedMessage id="all" />,
    value: 0,
  },
  // {
  //   name: <FormattedMessage id="placed" />,
  //   value: order_status.placed, // 还没成交
  // },
  {
    name: <FormattedMessage id="filled" />,
    value: order_status.filled, // 全部成交
  },
  {
    name: <FormattedMessage id="canceled" />,
    value: order_status.canceled, // 取消
  },
  // {
  //   name: <FormattedMessage id="partially" />,
  //   value: order_status.partially, // 部分成交
  // },
];
// 货币类型
export const spotTypeSel = [
  {
    name: <FormattedMessage id="all" />,
    value: 0,
  },
  {
    name: <FormattedMessage id="fiat" />,
    value: 1, // 法币
  },
  {
    name: <FormattedMessage id="digital" />,
    value: 2, // 数字货币
  },
];
// 货币状态
export const spotStatusSel = [
  {
    name: <FormattedMessage id="all" />,
    value: 0,
  },
  {
    name: <FormattedMessage id="deposit_withdraw" />,
    value: spot_status.deposit_withdraw, // 可出入金
  },
  {
    name: <FormattedMessage id="deposit_only" />,
    value: spot_status.deposit_only, // 只能入金
  },
  {
    name: <FormattedMessage id="withdraw_only" />,
    value: spot_status.withdraw_only, // 只能出金
  },
  {
    name: <FormattedMessage id="spot_status_disable" />,
    value: spot_status.spot_status_disable, // 不能出入金
  },
];
export const spotChangeReasonSel = [
  {
    name: <FormattedMessage id="All" />,
    value: 0,
  },
  {
    name: <FormattedMessage id="trade" />,
    value: spot_change_reason.trade, // 交易
  },
  {
    name: <FormattedMessage id="deposit" />,
    value: spot_change_reason.deposit, // 入金
  },
  {
    name: <FormattedMessage id="withdraw" />,
    value: spot_change_reason.withdraw, // 出金
  },
  // {
  //   name: <FormattedMessage id="admin" />,
  //   value: spot_change_reason.admin, // 后台
  // },
  // {
  //   name: <FormattedMessage id="test" />,
  //   value: spot_change_reason.test, // 测试
  // },
  {
    name: <FormattedMessage id="fee" />,
    value: spot_change_reason.fee, // 手续费
  },
  {
    name: <FormattedMessage id="transfer" />,
    value: spot_change_reason.transfer, // 划转
  },
  {
    name: <FormattedMessage id="jiaoshou" />,
    value: spot_change_reason.jiaoshou, // 交收
  },
  {
    name: <FormattedMessage id="deliverFee" />,
    value: spot_change_reason.deliverFee, // 交收手续费
  },
  {
    name: <FormattedMessage id="deferFee" />,
    value: spot_change_reason.deferFee, //  递延费
  },
  {
    name: <FormattedMessage id="withdrawFee" />,
    value: spot_change_reason.withdrawFee, //  提币手续费
  },
  {
    name: <FormattedMessage id="activatedReward" />,
    value: spot_change_reason.activatedReward, //  激活奖励
  },
  {
    name: <FormattedMessage id="welcomeReward" />,
    value: spot_change_reason.welcomeReward, //  新用户交易奖励
  },
  {
    name: <FormattedMessage id="rebate" />,
    value: spot_change_reason.rebate, //  返佣
  },
  {
    name: <FormattedMessage id="lockReward" />,
    value: spot_change_reason.lockReward, //  锁定奖励
  },
  // {
  //   name: <FormattedMessage id="botTransfer" />,
  //   value: spot_change_reason.botTransfer, //  机器人划转	
  // }
];

export const tranferDirectionSel = [
  {name:<FormattedMessage id='transferExTd'/>, value: transfer_dir.transfer_ex_td},
  {name:<FormattedMessage id='transferTdEx'/>, value: transfer_dir.transfer_td_ex}
]
console.log(lockType.lock)
export const lockSel = [
  {name:<FormattedMessage id='lock'/>, value: lockType.lock},
  {name:<FormattedMessage id='unLock'/>, value: lockType.unLock}
]

// 交收类型
export const deliverTypeSel = [
  {
    name: <FormattedMessage id="All" />,
    value: 0,
  },
  {
    name: <FormattedMessage id="shuohuo" />,
    value: dir.buy,
  },
  {
    name: <FormattedMessage id="jiaohuo" />,
    value: dir.sell,
  }
];

//交收狀态
export const deliverStatusSel = [
  {
    name: <FormattedMessage id="All" />,
    value: 0,
  },
  {
    name: <FormattedMessage id="placed" />,
    value: deliver_status.deliver_init,
  },
  {
    name: <FormattedMessage id="filled" />,
    value: deliver_status.deliver_success,
  },
  {
    name: <FormattedMessage id="canceled" />,
    value: deliver_status.deliver_cancel,
  }
]

// 订单状态
export const neutralStatusSel = [
  ...deliverStatusSel,
  {
    name: <FormattedMessage id="partially" />,
    value: neutral_status.neutral_partially, // 部分成交
  },
];

export const cardType = [
  { value: 1, name: <FormattedMessage id="paper" /> },
  { value: 2, name: <FormattedMessage id="passport" /> },
];