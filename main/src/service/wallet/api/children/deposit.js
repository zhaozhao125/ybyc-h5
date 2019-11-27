export default {
  // 获取分时保证金详情
  GET_SHARE_DEPOSIT_DETAIL: '/service-user/apiUser/finance/userMoney/:userId/timeShareRentDeposit/info',
  // 获取长租保证金详情
  GET_RENT_DEPOSIT_DETAIL: '/service-user/apiUser/finance/userMoney/:userId/longTermRentDeposit/info',
  // 获取芝麻信用优惠设置
  GET_SESAME_CONFIG: '/service-user/apiUser/finance/userMoney/zhimaConfig/list',
  // 撤销退款
  CANCEL_REFUND: 'service-user/apiUser/finance/userMoneyRefund/:userId/cancel'
}
