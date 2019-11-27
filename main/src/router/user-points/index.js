const pointsIndex = () =>
  import(/* webpackChunkName: "userPoints" */ '@/views/user-points/')
const myPoints = () =>
  import(/* webpackChunkName: "userPoints" */ '@/views/user-points/my-points')
const record = () =>
  import(/* webpackChunkName: "userPoints" */ '@/views/user-points/point-record')
const rule = () =>
  import(/* webpackChunkName: "userPoints" */ '@/views/user-points/point-rule')
const mall = () =>
  import(/* webpackChunkName: "userPoints" */ '@/views/user-points/point-mall')

export default {
  path: '/user-points',
  component: pointsIndex,
  children: [{
    path: '/',
    redirect: {
      name: 'myPoints'
    }
  }, {
    path: 'my-points',
    name: 'myPoints',
    component: myPoints,
    meta: {
      title: '我的积分'
    }
  }, {
    path: 'record',
    name: 'pointRecord',
    component: record,
    meta: {
      title: '积分记录'
    }
  }, {
    path: 'rule',
    name: 'pointRule',
    component: rule,
    meta: {
      title: '积分规则'
    }
  }, {
    path: 'mall',
    name: 'pointMall',
    component: mall,
    meta: {
      title: '积分商城'
    }
  }]
}
