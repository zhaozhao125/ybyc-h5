// 免单活动
const freeOrder = () =>
  import(/* webpackChunkName: "freeOrder" */ '@/views/activity/free-order/')
const freeOrderList = () =>
  import(/* webpackChunkName: "freeOrder" */ '@/views/activity/free-order/children/list')
// 好友贡献榜
const freeOrderFriendsRank = () =>
  import(/* webpackChunkName: "freeOrder" */ '@/views/activity/free-order/children/friends-rank')
// 免单攻略
const freeOrderRules = () =>
  import(/* webpackChunkName: "freeOrder" */ '@/views/activity/free-order/children/rules')
const freeOrderShareTimeline = () =>
  import(/* webpackChunkName: "freeOrder" */ '@/views/activity/free-order/children/share-timeline')

export default [{
  path: 'free-order',
  name: 'freeOrder',
  component: freeOrder,
  meta: {
    title: '分享免单'
  }
}, {
  path: 'free-order/list',
  name: 'freeOrderList',
  component: freeOrderList,
  meta: {
    title: '免单红包列表'
  }
}, {
  path: 'free-order/friends-rank',
  name: 'freeOrderFriendsRank',
  component: freeOrderFriendsRank,
  meta: {
    title: '好友贡献榜'
  }
}, {
  path: 'free-order/rules',
  name: 'freeOrderRules',
  component: freeOrderRules,
  meta: {
    title: '免单攻略'
  }
}, {
  path: 'free-order/share-timeline',
  name: 'freeOrderShareTimeline',
  component: freeOrderShareTimeline,
  meta: {
    title: '分享'
  }
}]
