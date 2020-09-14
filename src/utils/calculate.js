import Big from 'big.js';

const big = (str, num1, num2) => {
  const b = new Big(num1);
  return b[str](num2).toString();
};

//四舍五入，解决toFixed（4舍6入双5）精度丢失问题
export  const numberRound =function (number,n){
    n = n ? parseInt(n) : 0;
    if (n <= 0) return Math.round(number);
    number =Math.round(number * Math.pow(10, n+1))/10;
    number = Math.round(number) / Math.pow(10, n);
    return number;
}

export const toFixed2 = function (number,n) {//四舍五入
  if(number.constructor ===String){
      number = number.replace(/[^\d\.-]/g, "");
  }
  if(isNaN(parseFloat(number))){
      return "";
  }
  number = numberRound(parseFloat(number),n);
  if(n <=0){
      return number.toString();
  }
  else{
      return  number.toFixed(n);
  }
}

export const toFixed1 = function (number,n) {//截取
  if(number.constructor ==String){
      number = number.replace(/[^\d\.-]/g, "");
  }
  if(isNaN(parseFloat(number))){
      return "";
  }
  number = number.toString();
  var edx=-1,digits;
  if((edx=number.indexOf("e"))>0 ||(edx=number.indexOf("E"))>0){
      digits = Math.abs(parseFloat(number.substring(edx+1)));
      number = "0."+new Array(digits).join("0")+number.substring(0,edx);
  }
  if(n <0){
      return number;
  }
  else if(n==0){
      return number.split(".")[0];
  }
  else{
      var arr = number.split("."),pidx=0;
      if(arr.length ==1){
         return number+"."+new Array(n+1).join("0");
      }
      else{
          pidx = arr[1].length;
          if(pidx>=n){
              return arr[0]+"."+arr[1].substr(0,n);
          }
          else {
              return number+new Array(n-pidx+1).join("0");
          }
      }
  }
}

export const big2 = (str, number, val, toFix = 8) => {
  const c = new Big(val);
  return toFixed(
    c[str](number)
      .toFixed(toFix)
  );
}

const toFixed = x => {
  let t = x;
  if (Math.abs(x) < 1.0) {
    const e = parseInt(t.toString().split('e-')[1], 0);
    if (e) {
      const n = t
        .toString()
        .split('e-')[0]
        .split('.');
      const s = n[1] ? n[1].length : 0;
      t = big('times', t, big('pow', 10, e + s));
      t = `0.${new Array(e).join('0') + t}`;
    }
  } else {
    let e = parseInt(t.toString().split('+')[1], 0);
    if (e > 20) {
      e = big('minus', e, 20);
      t = big('div', t, big('pow', 10, e));
      t += new Array(e + 1).join('0');
    }
  }
  return typeof t === 'number' ? t.toFixed() : t;
};

export default toFixed;
