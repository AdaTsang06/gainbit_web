const config = {
  BTC: {
    value: 0,
    fee: 0.001,
    min: 0.01,
    deposit: 0.0005,
    times: 6,
  },
  BCH: {
    value: 3,
    fee: 0.0001,
    min: 0.01,
    deposit: 0.005,
    times: 6,
  },
  ETH: {
    value: 2,
    fee: 0.01,
    min: 0.015,
    deposit: 0.005,
    times: 12,
  },
  LTC: {
    value: 6,
    fee: 0.001,
    min: 0.1,
    deposit: 0.05,
    times: 6,
  } /*
  ETC: {
    value: 1,
    fee: 0.01,
    min: 0.5,
    deposit: 0,
    times: 12,
  },*/,
  DASH: {
    value: 7,
    fee: 0.002,
    min: 0.02,
    deposit: 0.004,
    times: 6,
  },
  MONA: {
    value: 8,
    fee: 0.01,
    min: 20,
    deposit: 10,
    times: 6,
  },
  USDT: {
    value: 9,
    fee: 10,
    min: 200,
    deposit: 100,
    times: 6,
  }
};
const defaultValue = {
  value: -1,
  fee: 0,
  min: 0,
  deposit: 0,
};


export const coinType = name => {
  if (name in config) {
    return config[name].value;
  }
  return -1;
};

export const revertCoinType = value => {
  const keys = Object.keys(config);
  let result = 'Unrecognized';
  for (let i = 0; i < keys.length; i += 1) {
    if (config[keys[i]].value === value) {
      result = keys[i];
      break;
    }
  }
  return result;
};

export const getCoin = name => {
  if (name in config) {
    return config[name];
  }
  return defaultValue;
};
