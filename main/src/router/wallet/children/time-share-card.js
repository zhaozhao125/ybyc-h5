const timeShareCard = () =>
  import(/* webpackChunkName: "wallet" */ '@/views/wallet/time-share-card/time-share-card')

export default [
  {
    path: 'time-share-card',
    name: 'timeShareCard',
    meta: {
      title: '分时出行卡'
    },
    component: timeShareCard
  }
]
