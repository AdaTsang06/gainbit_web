import createHmac from 'create-hmac';
import moment from 'moment';
import { getSessionStore} from './storage';
import countryData from '@/common/country.json';
import { symbol_type, account_type } from '../common/constant-enum';

const sortstringify = obj =>{
     let res = '',trans;
     let keys = Object.keys(obj).sort(), len = keys.length;
     keys.forEach((k, i) =>{
       res += `${k}=`;
      if(obj[k] && obj[k].constructor === String){
        trans = encodeURIComponent(obj[k]).replace(/[!'()*]/g, function(c) {
          return '%' + c.charCodeAt(0).toString(16).toUpperCase();
        });
        trans = trans.replace(/%/g,'');
        res += `${trans}`;
      }
      else if(obj[k] && obj[k].constructor === Array ){
        res += `[${obj[k].join(' ')}]`;
      }
      else{
        res += obj[k];
      }
      if( i < len -1){
        res += '&';
      }
     });
    return res;
  }

export function genDeviceid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
}

export const getSignature = payload => {
    const secret =  getSessionStore('token') || '';
    let content = payload;
    if (typeof payload === 'object') {
        content = sortstringify(payload);
    }
    const hmac = createHmac('sha256', Buffer.from(secret));
    hmac.update(content);
    return hmac.digest('hex');
};

export const createRequest = () => {
    let userInfo = getSessionStore('userInfo');
    if(!userInfo) return null;
    return { userid: userInfo.id };
}

export const createSignatureRequest = (payload) => {
    let request = createRequest() || {};
    if(payload){
        Object.assign(request,payload);
    }
    request.sign = getSignature(request);
    return request;
}

export const formatUnixtTime = (unixTime) =>{
  return moment.unix(unixTime).format('YYYY-MM-DD HH:mm:ss')
}



export const handleCountryData = (locale) => {
  const data = countryData[locale];
  return Object.keys(data)
    .filter(key => key !== 'US')
    .map(key => ({
      name: data[key].name,
      value: key,
    }))
    .sort();
};

export const handleMobileCode  = (locale) => {
  const data = countryData[locale];
  return Object.keys(data)
    .filter(key => key !== 'US')
    .map(key => ({
      name: data[key].code,
      value: data[key].code,
    }))
    .sort();
};

export const getSymTypeObj = () => {
  let symTypeObj ={};
  Object.values(symbol_type).map(val =>{
    if(val){
      symTypeObj[val] = {};
    }
  });
  return symTypeObj;
}

export const getAccountTypeObj = () => {
  let acTypeObj ={};
  Object.values(account_type).map(val =>{
    if(val){
      acTypeObj[val] = {};
    }
  });
  return acTypeObj;
}

export const getAccountId = (chose, accountInfos) => {
  let acId = 0;
  for(let i = 0; i < accountInfos.length; i++) {
    if(chose === accountInfos[i].type){
      acId = accountInfos[i].id;
      break;
    }
  }
  return acId;
}

export const getFormat = function getFormat(time) {
  return time ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
}

export const getQueryLang = (locale) => {
  let lang = '';
  switch(locale){
    case 'en-US':{
        lang = 'en';
        break
    }
    case 'zh-TW':{
      lang = 'zh-HK';
      break
    }
    default:
      lang = 'zh';
  }
  return lang;
}

export const imgCompress = (files, callBack) => {
  let image = files[0]; //获取文件域中选中的图片
  let reader = new FileReader(); //实例化文件读取对象
  reader.readAsDataURL(image); //将文件读取为 DataURL,也就是base64编码
  let img = new Image();
  reader.onload = (ev) => { //文件读取成功完成时触发
    img.src = ev.target.result
  }
  img.onload = function () {
    // 缩放图片需要的canvas（也可以在DOM中直接定义canvas标签，这样就能把压缩完的图片不转base64也能直接显示出来）
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    // 图片原始尺寸
    var originWidth = this.width;
    var originHeight = this.height;
    // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
    var maxWidth = 600,
        maxHeight = 600;
    // 目标尺寸
    var targetWidth = originWidth,
        targetHeight = originHeight;
    // 图片尺寸超过600*600的限制
    if(originWidth > maxWidth || originHeight > maxHeight) {
        if(originWidth / originHeight > maxWidth / maxHeight) {
            // 更宽，按照宽度限定尺寸
            targetWidth = maxWidth;
            targetHeight = Math.round(maxWidth * (originHeight / originWidth));
        } else {
            targetHeight = maxHeight;
            targetWidth = Math.round(maxHeight * (originWidth / originHeight));
        }
    }
    // canvas对图片进行缩放
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    // 清除画布
    context.clearRect(0, 0, targetWidth, targetHeight);
    // 图片压缩
    context.drawImage(img, 0, 0, targetWidth, targetHeight);
    /*第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高*/

    //压缩后的图片转base64 url
    /*canvas.toDataURL(mimeType, qualityArgument),mimeType 默认值是'image/png';
      * qualityArgument表示导出的图片质量，只有导出为jpeg和webp格式的时候此参数才有效，默认值是0.92*/
    let newUrl = canvas.toDataURL('image/jpeg', 0.92);//base64 格式
    let idx = newUrl.indexOf('base64,');
    newUrl=newUrl.substr(idx);
    newUrl = newUrl.replace("base64,","");
    callBack(newUrl);
  }
};

export const showBase64Img = (value) => {
   return value ? `data:image/jpeg;base64,${value}` : '';
}