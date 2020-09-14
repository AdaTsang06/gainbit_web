import { createSignatureRequest } from './util';
export const getUnixTime = () =>{
    return parseInt(new Date().getTime()/1000);
}
export const wsLoginReq = () =>{
    let obj = {action:'ws_login_req'};
    //obj.nonce = parseInt(Math.random()*10000);
   // obj.timestamp = getUnixTime();
    obj = createSignatureRequest(obj);
    return JSON.stringify(obj) ;
}  

export const wsheartResp = () =>{
    return JSON.stringify({action:'ws_heartbeat_rsp',server_time:getUnixTime()})
}

  