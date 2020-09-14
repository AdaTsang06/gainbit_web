import Fingerprint2 from 'fingerprintjs2sync';
const sayswho = () => {
  var ua = navigator.userAgent,
    tem,
    M =
      ua.match(
        /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
      ) || [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return 'IE ' + (tem[1] || '');
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
    if (tem != null)
      return tem
        .slice(1)
        .join(' ')
        .replace('OPR', 'Opera');
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
  return M.join(' ');
};

export const getFinger = () => {
  const fingerprint = localStorage.getItem('fingerprint');
  const deviceInfo = localStorage.getItem('deviceInfo');
  if (fingerprint && deviceInfo) {
    return { fingerprint, deviceInfo };
  }
  const { fprint, newKeys } = new Fingerprint2().getSync();
  const device = newKeys.some(item => item.key === 'user_agent').value;
  localStorage.setItem('fingerprint', fprint);
  localStorage.setItem('deviceInfo', device);
  return { fingerprint: fprint, deviceInfo: device };
};

export default sayswho;
