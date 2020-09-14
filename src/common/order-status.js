export const status = {
  A: 'unfilled',
  1: 'part_of_filled',
  2: 'filled',
  0: 'unfilled',
  3: 'filled',
  S: 'filled',
  4: 'canceled',
  G: 'canceled',
  F: 'filled',
};
export const getStatus = key => {
  if (key in status) {
    return status[key];
  }
  return 'unfilled';
};
