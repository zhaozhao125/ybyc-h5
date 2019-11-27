export default {
  // 获取用户钱包信息
  GET_USER_MONEY_DETAIL: '/service-user/apiUser/finance/userMoney/:userId/info',
  // 帐户充值支付
  SUBMIT_ORDER: '/service-user/apiUser/finance/payment/user/recharge/init',
  // 是否能退款
  GET_REFUND_ABILITY: '/service-user/apiUser/finance/userMoneyRefund/:userId/apply/ability',
  // 获取退款原因
  GET_REFUND_REASONS: '/service-user/apiUser/finance/userMoneyRefund/:userId/apply/reasons',
  // 判断退款时是否需要输入银行卡信息
  GET_REFUND_CONDITION: '/service-user/apiUser/finance/userMoneyRefund/:userId/apply/condition',
  // 申请退款
  APPLY_FOR_REFUND: '/service-user/apiUser/finance/userMoneyRefund/:userId/apply',
  // 获取芝麻信用授权地址
  GET_SESAME_AUTH: '/service-user/apiUser/finance/userMoney/:userId/zhima/authorize',
  // 获取充值协议
  GET_RECHARGE_AGREEMENT: '/v26/web/recharge-agreement'
}
