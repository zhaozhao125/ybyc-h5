const balance = () =>
  import(/* webpackChunkName: "wallet" */ '@/views/wallet/balance/balance')
const paymoney = () =>
  import(/* webpackChunkName: "wallet" */ '@/views/wallet/balance/children/card-pay')
const payBalanceResult = () =>
  import(/* webpackChunkName: "wallet" */ '@/views/wallet/balance/children/pay-result')
const balanceRefund = () =>
  import(/* webpackChunkName: "wallet" */ '@/views/wallet/balance/children/balance-refund')
const balanceRefundSubmit = () =>
  import(/* webpackChunkName: "wallet" */ '@/views/wallet/balance/children/balance-refund-submit')

export default [{
  path: 'balance',
  name: 'balance',
  meta: {
    title: '余额'
  },
  component: balance
},
{
  path: 'cardpay',
  name: 'cardpay',
  meta: {
    title: '余额充值'
  },
  component: paymoney
},
{
  path: 'balance/payResult',
  redirect: {
    name: 'payBalanceResult'
  }
},
{
  path: 'balance/pay-result',
  name: 'payBalanceResult',
  meta: {
    title: '余额充值'
  },
  component: payBalanceResult
},
{
  path: 'balance/refund',
  name: 'balanceRefund',
  meta: {
    title: '退款'
  },
  component: balanceRefund
},
{
  path: 'balance/refund-submit',
  name: 'balanceRefundSubmit',
  meta: {
    title: '退款'
  },
  component: balanceRefundSubmit
}
]
