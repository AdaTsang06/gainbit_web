import request from '../utils/request';

export async function queryDeliverSummary(payload) {
  return request('/api/v1/deliver/query_summary',
  {
    method:'post',
    body:payload
});
}

export async function deliver(payload) {
  return request('/api/v1/position/deliver',
  {
    method:'post',
    body:payload
});
}

export async function queryDeliver(payload) {
  return request('/api/v1/deliver/query',
  {
    method:'post',
    body:payload
});
}

export async function cancelDeliver(payload) {
  return request('/api/v1/deliver/cancel',
  {
    method:'post',
    body:payload
});
}

export async function queryDeliverDeal(payload) {
  return request('/api/v1/deliver/query_deal',
  {
    method:'post',
    body:payload
});
}


export async function queryDeferFee(payload) {
  return request('/api/v1/deliver/query_defer_fee',
  {
    method:'post',
    body:payload
});
}

export async function neutral(payload) {
  return request('/api/v1/neutral/declare',
  {
    method:'post',
    body:payload
});
}

export async function queryNeutral(payload) {
  return request('/api/v1/neutral/query',
  {
    method:'post',
    body:payload
});
}

export async function cancelNeutral(payload) {
  return request('/api/v1/neutral/cancel',
  {
    method:'post',
    body:payload
});
}

export async function queryNeutralDeal(payload) {
  return request('/api/v1/neutral/query_deal',
  {
    method:'post',
    body:payload
});
}

export async function queryNeutralDeferFee(payload) {
  return request('/api/v1/neutral/query_defer_fee',
  {
    method:'post',
    body:payload
});
}