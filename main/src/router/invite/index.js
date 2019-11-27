const inviteIndex = () => import(/* webpackChunkName: "invite" */ '@/views/invite/')
const invite = () => import(/* webpackChunkName: "invite" */ '@/views/invite/invite')
const inviteRules = () => import(/* webpackChunkName: "invite" */ '@/views/invite/rules')
const inviteRecord = () => import(/* webpackChunkName: "invite" */ '@/views/invite/record')
const inviteQrcode = () =>
  import(/* webpackChunkName: "invite" */ '@/views/invite/qrcode')

export default {
  path: '/invite',
  component: inviteIndex,
  children: [{
    path: '/',
    name: 'invite',
    component: invite,
    meta: {
      title: '邀请好友',
      noAuth: true
    }
  }, {
    path: 'invite-rules',
    name: 'invite-rules',
    component: inviteRules,
    meta: {
      title: '奖励规则',
      noAuth: true
    }
  }, {
    path: 'invite-record',
    name: 'invite-record',
    component: inviteRecord,
    meta: {
      title: '获得奖励'
    }
  }, {
    path: 'invite-qrcode',
    name: 'invite-qrcode',
    component: inviteQrcode,
    meta: {
      title: '二维码'
    }
  }, {
    path: 'trick',
    name: 'trick',
    component: resolve =>
      require(['@/views/invite/test'], resolve),
    meta: {
      title: '二维码'
    }
  }]
}
