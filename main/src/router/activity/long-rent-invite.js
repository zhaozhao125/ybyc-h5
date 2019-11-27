// 长租推荐活动
const longRentInvite = () =>
  import(/* webpackChunkName: "longRentInvite" */ '@/views/activity/long-rent-invite/')

const longRentInviteQrCode = () =>
  import(/* webpackChunkName: "longRentInvite" */ '@/views/activity/long-rent-invite/qrcode')
const longRentInviteRule = () =>
  import(/* webpackChunkName: "longRentInvite" */ '@/views/activity/long-rent-invite/rule')

export default [{
  path: 'long-rent-invite',
  name: 'longRentInvite',
  component: longRentInvite,
  meta: {
    title: '你发券，我返佣'
  }
}, {
  path: 'long-rent-invite/qrcode',
  name: 'longRentInviteQrCode',
  component: longRentInviteQrCode,
  meta: {
    title: '我的二维码'
  }
}, {
  path: 'long-rent-invite/rule',
  name: 'longRentInviteRule',
  component: longRentInviteRule,
  meta: {
    title: '详细规则'
  }
}]
