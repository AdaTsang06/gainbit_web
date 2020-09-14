import request from '../utils/request';

export async function queryBalanceLog(payload) {//财务记录
    return request('/api/v1/balance_log/query',{
        method:'post',
        body:payload
    });
}

export async function queryTransferLog(payload) {//划转记录
  return request('/api/v1/user/query_transfer_log',{
      method:'post',
      body:payload
  });
}

export async function queryLockLog(payload) {//锁定解锁记录
  return request('/api/v1/balance/query_lock',{
      method:'post',
      body:payload
  });
}

export async function queryPlaced(payload) {//当前委托
    return request('/api/v1/order/query_placed',{
        method:'post',
        body:payload
    });
  }

export async function queryHistorical(payload) {//历史委托
    return request('/api/v1/order/query_historical',{
        method:'post',
        body:payload
    });
  }

  export async function queryDeal(payload) {//成交
    return request('/api/v1/deal/query',{
        method:'post',
        body:payload
    });
  }

  export async function queryDealByOrder(payload) {//委托单成交明细
    return request('/api/v1/deal/query_by_order',{
        method:'post',
        body:payload
    });
  }

  export async function queryDepositHistory(payload) {//查询入币记录
    return request('/api/v1/balance/query_deposit',{
        method:'post',
        body:payload
    });
  }

  export async function queryWithdrawHistory(payload) {//查询出币记录
    return request('/api/v1/balance/query_withdraw',{
        method:'post',
        body:payload
    });
  }