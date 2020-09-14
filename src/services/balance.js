import request from '../utils/request';

export async function getDepositAddress(payload) {
    return request('/api/v1/balance/get_deposit_address',{
        method:'post',
        body:payload
    });
}
  

export async function withdraw(payload) {
    return request('/api/v1/balance/withdraw',{
        method:'post',
        body:payload
    });
}
 
export async function getWithdrawAddress(payload) {
    return request('/api/v1/balance/query_withdraw_addr',{
        method:'post',
        body:payload
    });
}

export async function getWithdrawMax(payload) {
    return request('/api/v1/balance/withdraw_max',{
        method:'post',
        body:payload
    });
}