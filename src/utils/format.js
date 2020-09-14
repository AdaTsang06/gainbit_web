export const toFixed = (num, fixed) => {
  const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
  return Number.parseFloat(num.toString().match(re)[0]);
};
export const stringifyVolumn = (number, precision) => {
  let tempVar;
  const tempPrecision = precision || 2;
  if (number === undefined || number == null || Number.isNaN(number)) {
    return '-';
  }
  if (typeof number === 'string') {
    tempVar = parseFloat(number);
  } else {
    tempVar = number;
  }
  return tempVar.toFixed(tempPrecision).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  // return toFixed(tempVar, tempPrecision)
  //   .toFixed(tempPrecision)
  //   .replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
};

export default stringifyVolumn;
