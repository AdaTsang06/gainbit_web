import checkList from './check-list'; // check error list

const checkPassword = value =>
  value.length < 8
    ? 'error_length'
    : !checkList.password.test(value) && 'error_password';

const checkEmail = value => !checkList.email.test(value) && 'error_email';
const checkCreditAmount = value => value < 50 && 'credit_amount_email';
const checkCreditBirth = value => {
  const isLegal = new Date().getFullYear() - value.split('-')[0];
  return isLegal < 18 && 'credit_birth';
};
const checkVerify = value => {
  return value == '1' && 'verify_mode';
};
const getFieldErr = (name, value, require) => {
  if (!value) return require && 'required';
  switch (name) {
    case 'password':
      return checkPassword(value);
    case 'email':
      return checkEmail(String(value).trim());
    case 'credit-amount':
      return checkCreditAmount(value);
    case 'credit-birth':
      return checkCreditBirth(value);
    case 'verify-mode':
      return checkVerify(value);
    default:
      return false;
  }
};
export default getFieldErr;
