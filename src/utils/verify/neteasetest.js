import './nt.js';
const captchaId = '2441822e37994f09b9d20da688c210a6';

const init = (locale = 'en', success, id = '#captcha') =>
  new Promise(resolve => {
    let lang = locale.toLowerCase();
    if (lang.indexOf('en') !== -1) {
      lang = 'en';
    } else {
      lang = 'zh-CN';
    }
    window.initNECaptcha(
      {
        captchaId,
        element: id,
        mode: 'popup',
        width: '320px',
        lang,
        onVerify: async (err, data) => {
          if (err) return;
          try {
            success({ ne_captcha_validate: data.validate });
          } catch (e) {
          }
        },
      },
      instance => {
        resolve(instance);
      },
      () => {
        resolve('');
      }
    );
  });

export default init;
