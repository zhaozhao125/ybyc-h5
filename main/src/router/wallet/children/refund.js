const refund = () => import(/* webpackChunkName: "wallet" */ '@/views/wallet/refund/refund')
const refundReason = () => import(/* webpackChunkName: "wallet" */ '@/views/wallet/refund/refund-reason')

export default [{
  path: 'refund',
  name: 'refund',
  meta: {
    title: '保证金退款'
  },
  component: refund
}, {
  path: 'refund-reason',
  name: 'refundReason',
  meta: {
    title: '退款原因'
  },
  component: refundReason
}, {
  path: 'refundReason',
  redirect: {
    name: 'refundReason'
  }
}]
