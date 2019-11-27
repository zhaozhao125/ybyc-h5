const pay = () =>
  import(/* webpackChunkName: "wallet" */ '@/views/wallet/pay/pay')
const bonusPay = () =>
  import(/* webpackChunkName: "wallet" */ '@/views/wallet/pay/children/bonus-2018-11-02')
const rechargeAgreement = () =>
  import(/* webpackChunkName: "wallet" */ '@/views/wallet/pay/children/recharge-agreement')

export default [{
  path: 'pay',
  name: 'pay',
  meta: {
    title: '支付'
  },
  component: pay
},
{
  path: 'bonus-pay',
  name: 'bonusPay',
  meta: {
    title: '支付'
  },
  component: bonusPay
},
{
  path: 'pay/agreement',
  name: 'rechargeAgreement',
  meta: {
    title: '充值协议'
  },
  component: rechargeAgreement
}]
