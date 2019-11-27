import balance from './children/balance.js'
import depositShare from './children/deposit-share'
import depositRent from './children/deposit-rent'
import pay from './children/pay'
import refund from './children/refund.js'
import redPacket from './children/red-packet'
import timsShareCard from './children/time-share-card'
// import activity from './children/activity'
const walletIndex = () =>
  import(/* webpackChunkName: "wallet" */ '@/views/wallet/')
const wallet = () =>
  import(/* webpackChunkName: "wallet" */ '@/views/wallet/wallet')

export default {
  path: '/wallet',
  component: walletIndex,
  children: [
    {
      path: '/',
      name: 'wallet',
      meta: {
        title: '我的钱包'
      },
      component: wallet
    },
    ...balance,
    ...depositShare,
    ...depositRent,
    ...pay,
    ...refund,
    ...redPacket,
    ...timsShareCard
  ]
}
