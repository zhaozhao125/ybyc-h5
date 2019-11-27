const depositRent = () =>
  import(/* webpackChunkName: "wallet" */ '@/views/wallet/deposit-rent/deposit-rent')
const payRentResult = () =>
  import(/* webpackChunkName: "wallet" */ '@/views/wallet/deposit-rent/children/pay-result')

export default [{
  path: 'deposit-rent',
  name: 'depositRent',
  meta: {
    title: '长租保证金'
  },
  component: depositRent
}, {
  path: 'depositRent',
  redirect: {
    name: 'depositRent'
  }
}, {

  path: 'deposit-rent/pay-result',
  name: 'payRentResult',
  meta: {
    title: '保证金交纳'
  },
  component: payRentResult
}, {
  path: 'depositRent/payResult',
  redirect: {
    name: 'payRentResult'
  }
}]
