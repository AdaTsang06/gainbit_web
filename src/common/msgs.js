const msgs = {
  login_success: 'login_success',
  register_step_one: 'register_step_one',
  register_success: 'register_success',
  get_reset_code_success: 'get_reset_code_success',
  reset_password_success: 'reset_password_success',
  get_mobile_code_success: 'get_mobile_code_success',
  submit_success: 'submit_success',
  send_success: 'send_success',
  bind_success: 'bind_success',
  unbind_success: 'unbind_success',
  change_password_success: 'change_password_success',
  add_crypto_withdraw_addrss_success: 'add_crypto_withdraw_addrss_success',
  add_bank_account_success: 'add_bank_account_success',
  apply_withdraw_success: 'apply_withdraw_success',
  kyc_submit_success: 'kyc_submit_success',
  delete_success: 'delete_success',
  copy_success: 'copy_success',
  add_success: 'add_success',
  place_order_success: 'place_order_success',
  cancle_order_success: 'cancle_order_success',
};
const getMsgType = name => {
  if (name in msgs) {
    return msgs[name];
  }
  return 'success';
};

export default getMsgType;
