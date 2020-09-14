import request from '../utils/request';

export async function getErrorMessage() {
  return request('/api/v1/error_message');
}
export async function getSymbols() {
  return request('/api/v1/symbol');
}

export async function incrBalance(payload) {
  return request('/api/v1/testing/incr_balance',{
      method:'post',
      body:payload
  });
}

export async function queryNotices(payload) {
  return request('/api/v1/get_notice',{
      method:'post',
      body:payload
  });
}

export async function getRate() {
  return request('/api/v1/exch_rate');
}