//import fetch from 'dva/fetch';
import {apiUrl} from '../common/env'
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  if (response.status === 401 || response.status === 403) {
    //history.pushState('/401', null);
    return;
  }
  console.log("status not 200");
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    // credentials: 'include',
    headers: {
      // token: getSessionStore('userToken'),
      // 'app-version': 'web:1.0.0',
    },
  };

  const needAddContentType = (option) => {
    // get 请求不用加
    if (!option.method) return false;
    // body 是 FormData 类型不用加 application/json
    if (option.body instanceof FormData) return false;
    return true;
  };
  const newOptions = { ...defaultOptions, ...options };
  if (needAddContentType(newOptions)) {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(newOptions.body);
  }

  return fetch(apiUrl + url, newOptions)
    .then(checkStatus)
    .then(response => response.json())
    .catch((error) => {
      if (error.code) {
        console.log(error.code)
      }
      if ('stack' in error && 'message' in error) {
        console.log(error.message);
      }
      return false;
    });
}
