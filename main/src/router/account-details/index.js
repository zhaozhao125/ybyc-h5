const accountDetailIndex = () =>
  import(/* webpackChunkName: "accountDetails" */ '@/views/account-details/')
const bill = () =>
  import(/* webpackChunkName: "accountDetails" */ '@/views/account-details/bill')
const detail = () =>
  import(/* webpackChunkName: "accountDetails" */ '@/views/account-details/detail')

export default {
  path: '/account-details',
  component: accountDetailIndex,
  children: [
    {
      path: '/',
      name: 'account-details',
      component: bill,
      meta: {
        title: '收支明细'
      }
    },
    {
      path: 'detail',
      name: 'expense-detail',
      component: detail,
      meta: {
        title: '收支明细'
      }
    }
  ]
}
