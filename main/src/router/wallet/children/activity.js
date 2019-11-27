export default [{
  path: 'activity/reserve',
  name: 'reserveCar',
  meta: {
    title: '一步贺岁档，陪你回家过大年',
    noAuth: true
  },
  component: resolve =>
    require(['@/views/wallet/activity/reserve/index.vue'], resolve)
},
{
  path: 'activity/reserve-zz',
  name: 'reserveCarZZ',
  meta: {
    title: '一步贺岁档，陪你回家过大年',
    noAuth: true
  },
  component: resolve =>
    require(['@/views/wallet/activity/reserve/reserveZZ.vue'], resolve)
}
]
