export default {
  // 获取用户红包信息
  GET_RED_PACKET_INFO: '/service-user/apiPromotion/userRedPacket/:userId/userRedPacket/info',
  // 获取红包流水
  GET_RED_PACKET_DETAIL: '/service-user/apiPromotion/userRedPacket/:userId/record/page',
  // 红包转赠送余额
  TRANSFER_RED_PACKET_TO_BALANCE: '/service-user/apiPromotion/userRedPacket/toUserMoneyPresentation',
  // 绑定微信
  BIND_WECHAT: '/service-user/apiUser/finance/userMoney/withdraw/wechat/bind',
  // 申请提现
  RED_PACKET_WITHDRAW: '/service-user/apiPromotion/userRedPacket/withdraw',
  // 获取绑定的第三方账户信息
  GET_BIND_ACCOUNTS: 'service-user/apiUser/finance/userMoney/withdraw/account'
}
