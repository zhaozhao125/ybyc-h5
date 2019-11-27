export default {
  // 获取余额信息
  GET_BALANCE: '/service-user/apiUser/finance/userMoney/:userId/balance/info',
  // 余额充值卡充值（废弃）
  BALANCE_RECHARGE: '/v26/user-money/recharge',
  // 获取分时余额退款原因
  GET_BALANCE_REFUND_REASONS: '/service-user/apiUser/finance/userMoneyRefund/:userId/apply/balanceReasons',
  // 提交退款申请
  SUBMIT_BALANCE_REFUND: '/service-user/apiUser/finance/userMoneyRefund/:userId/apply'
}
