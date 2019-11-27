export default {
  paymentPluginList: [{
    value: 'alipayMobilePlugin',
    label: '支付宝',
    icon: 'icon-alp.png'
  }, {
    value: 'weixinpayMobilePlugin',
    label: '微信支付',
    icon: 'icon-wx.png'
  }],
  paymentType: {
    balance: 'balanceRecharge',
    share: 'timeShareRentDepositRecharge',
    rentOffence: 'longTermRentViolationDepositRecharge',
    rentCar: 'longTermRentCarDepositRecharge'
  }
}
