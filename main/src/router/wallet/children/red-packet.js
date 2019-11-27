const redPacket = () => import(/* webpackChunkName: "wallet" */ '@/views/wallet/red-packet/red-packet')
const redPacketDetails = () => import(/* webpackChunkName: "wallet" */ '@/views/wallet/red-packet/details')
const redPacketRules = () => import(/* webpackChunkName: "wallet" */ '@/views/wallet/red-packet/rules')

export default [{
  path: 'red-packet',
  name: 'red-packet',
  meta: {
    title: '红包'
  },
  component: redPacket
}, {
  path: 'red-packet-details',
  name: 'red-packet-details',
  meta: {
    title: '红包明细'
  },
  component: redPacketDetails
}, {
  path: 'red-packet-rules',
  name: 'red-packet-rules',
  meta: {
    title: '红包规则'
  },
  component: redPacketRules
}]
