import request from '../utils/request';
export async function login(payload) {
  return request('/api/v1/user/login',{
      method:'post',
      body:payload
  });
}

export async function register(payload) {
  return request('/api/v1/user/register',{
      method:'post',
      body:payload
  });
}

export async function sendRegisterCaptcha(payload) {
  return request('/api/v1/user/register_captcha',{
      method:'post',
      body:payload
  });
}

export async function placeOrder(payload){
  return request('/api/v1/order/place',{
    method:'post',
    body:payload
  });
}

export async function closeOrder(payload){
  return request('/api/v1/position/close',{
    method:'post',
    body:payload
  });
}

export async function queryPlaced(payload){
  return request('/api/v1/order/query_placed',{
    method:'post',
    body:payload
  });
}

export async function cancelOrder(payload){
  return request('/api/v1/order/cancel',{
    method:'post',
    body:payload
  });
}

export async function changePw(payload){
  return request('/api/v1/user/change_password',{
    method:'post',
    body:payload
  });
}


export async function retrievePasswordCaptcha(payload) {
  return request('/api/v1/user/retrieve_password_captcha',{
      method:'post',
      body:payload
  });
}


export async function retrievePassword(payload) {
  return request('/api/v1/user/retrieve_password',{
      method:'post',
      body:payload
  });
}

export async function transfer(payload) {
  return request('/api/v1/user/transfer',{
      method:'post',
      body:payload
  });
}

export async function lock(payload) {
  return request('/api/v1/balance/lock',{
      method:'post',
      body:payload
  });
}


export async function queryMessages(payload){
  return request('/api/v1/message/query',{
    method:'post',
    body:payload
  });
}

export async function setMessagesRead(payload){
  return request('/api/v1/message/set_read',{
    method:'post',
    body:payload
  });
}

export async function queryUnreadMsgCount(payload){
  return request('/api/v1/message/count_unread',{
    method:'post',
    body:payload
  });
}
//反馈
export async function feedback(payload){
  return request('/api/v1/feedback/submit',{
    method:'post',
    body:payload
  });
}

export async function queryKycIdInfo(payload){
  return request('/api/v1/user/kyc/query_id',{
    method:'post',
    body:payload
  });
}

export async function submitKycIdInfo(payload){
  return request('/api/v1/user/kyc/submit_id',{
    method:'post',
    body:payload
  });
}

export async function queryRiskAssessment(payload){
  return request('/api/v1/user/kyc/query_risk_assessment',{
    method:'post',
    body:payload
  });
}

export async function submitRiskAssessment(payload){
  return request('/api/v1/user/kyc/submit_risk_assessment',{
    method:'post',
    body:payload
  });
}

export async function queryIdPhoto(payload){
  return request('/api/v1/user/kyc/query_id_photo',{
    method:'post',
    body:payload
  });
}
export async function downloadPhto(payload){
  return request('/api/v1/user/kyc/download_photo',{
    method:'post',
    body:payload
  });
}

export async function submitIdPhoto(payload){
  return request('/api/v1/user/kyc/submit_id_photo',{
    method:'post',
    body:payload
  });
}

export async function queryKycRandPhoto(payload){
  return request('/api/v1/user/kyc/query_rand_photo',{
    method:'post',
    body:payload
  });
}

export async function submitKycRandPhoto(payload){
  return request('/api/v1/user/kyc/submit_rand_photo',{
    method:'post',
    body:payload
  });
}

export async function queryKycStatus(payload){
  return request('/api/v1/user/kyc/status',{
    method:'post',
    body:payload
  });
}

export async function queryInviteInfo(payload){
  return request('/api/v1/user/invite_info',{
    method:'post',
    body:payload
  });
}