export default [{
  path: '20181001-zz',
  name: '20181001-zz',
  component: resolve =>
    require(['@/views/activity/temporary/20181001/zhengzhou/'], resolve),
  meta: {
    title: '双节7天租低至499',
    noAuth: true
  }
}, {
  path: '20181001-hf',
  name: '20181001-hf',
  component: resolve =>
    require(['@/views/activity/temporary/20181001/hefei/'], resolve),
  meta: {
    title: '双节7天租低至399',
    noAuth: true
  }
}]

/**
 * 过期的活动
 */
// const old = [{
//   path: 'long-rent',
//   name: 'activity-long-rent',
//   component: resolve =>
//     require(['@/views/activity/temporary/long-rent/long-rent'], resolve),
//   meta: {
//     title: '长租新玩法，降押金还送券',
//     noAuth: true
//   }
// },
// {
//   path: '2018wuyi',
//   name: '2018wuyi',
//   component: resolve =>
//     require(['@/views/activity/temporary/wuyi-duanzu/wuyi-duanzu'], resolve),
//   meta: {
//     title: '五动心情，清爽一夏',
//     noAuth: true
//   }
// },
// {
//   path: 'three-orders',
//   name: 'threeOrders',
//   component: resolve => require(['@/views/activity/temporary/three-orders/'], resolve),
//   meta: {
//     title: '每周开三单，立领50元优惠券',
//     noAuth: true
//   }
// }]
