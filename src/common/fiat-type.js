export const fiats = {
  CNY: 0,
  USD: 1,
  EU: 2,
  HKD: 3,
  JPY: 4,
};
export const getFiatType = name => {
  if (name in fiats) {
    return fiats[name];
  }
  return -1;
};

export const getRevertFiatType = value => {
  const keys = Object.keys(fiats);
  let result = 'Unrecognized';
  for (let i = 0; i < keys.length; i += 1) {
    if (fiats[keys[i]] === value) {
      result = keys[i];
      break;
    }
  }
  return result;
};

export default getFiatType;
