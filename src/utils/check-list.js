const checkList = {
  email: /\S+@\S+\.\S+/,
  code: /^[0-9]{6}$/,
  reset_code: /^[0-9]{8}$/,
  mobile: /^[0-9]{11}$/,
  password: /^(?=.*?[a-zA-Z])(?=.*?[0-9]).{8,16}$/,
  tradePassword: /^[0-9]{6}$/,
  captchaCode: /^[a-zA-Z]{4}$/,
  idNumber: /^[0-9]{17}[0-9x]$/,
  bic: /^([A-Z]{6}[A-Z2-9][A-NP-Z1-2])(X{3}|[A-WY-Z0-9][A-Z0-9]{2})?$/,
};

export default checkList;
