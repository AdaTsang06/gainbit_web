import './nt.js';
const captchaId = 'abc07d77a67144c98685779901df0b6a';
const init = (locale = 'en', success, id = '#captcha') =>
  new Promise(resolve => {
    let lang = locale.toLowerCase();
    if (lang.indexOf('en') !== -1) {
      lang = 'en';
    } else {
      lang = 'zh-CN';
    }
    new window.YpRiddler({
      expired: 10,
      mode: 'dialog',
      winWidth: 300,
      lang: 'zh-cn', // 界面语言, 目前支持: 中文简体 zh-cn, 英语 en
      // langPack: LANG_OTHER, // 你可以通过该参数自定义语言包, 其优先级高于lang
      container: document.getElementById('captcha'),
      appId: 'bf6306fea07b4b9a800b4fb43134ab73',
      version: 'v1',
      //noButton:true,
      onError: function (param) {
              if (!param.code) {
                  console.error('错误请求');
              }
              else if (parseInt(param.code / 100) == 5) {
                  // 服务不可用时，开发者可采取替代方案
                  console.error('验证服务暂不可用');
              }
              else if (param.code == 429) {
                  console.warn('请求过于频繁，请稍后再试');
              }
              else if (param.code == 403) {
                  console.warn('请求受限，请稍后再试');
              }
              else if (param.code == 400) {
                  console.warn('非法请求，请检查参数');
              }
          // 异常回调
          console.error('验证服务异常')
      },
      onSuccess: function (validInfo, close, useDefaultSuccess) {
          // 成功回调
          alert('验证通过! token=' + validInfo.token + ', authenticate=' + validInfo.authenticate)
          // 验证成功默认样式
          //useDefaultSuccess(true)
          close()
      },
      onFail: function (code, msg, retry) {
          // 失败回调
          alert('出错啦：' + msg + ' code: ' + code)
          retry()
      },
      beforeStart: function (next) {
          console.log('验证马上开始')
          next()
      },
      onExit: function () {
          // 退出验证 （仅限dialog模式有效）
          console.log('退出验证')
      }
  })
  });

export default init;
