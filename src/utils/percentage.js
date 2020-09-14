import Big from 'big.js';

const percentage = (val, number) => {
  const c = new Big(val);
  if (c.minus(number).toString() === '0' || !number) {
    return 0;
  }
  if (number === 0) {
    return val;
  }
  return Number(
    c
      .minus(number)
      .div(number)
      .round(4)
      .times(100)
      .toString()
  );
};

export default percentage;
