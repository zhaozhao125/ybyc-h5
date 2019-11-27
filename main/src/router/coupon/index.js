const couponIndex = () =>
  import(/* webpackChunkName: "coupon" */ '@/views/coupon/')
const coupon = () =>
  import(/* webpackChunkName: "coupon" */ '@/views/coupon/coupon')

export default {
  path: '/coupon',
  component: couponIndex,
  children: [
    {
      path: '/',
      name: 'coupon',
      component: coupon,
      meta: {
        title: '我的卡券'
      }
    }
  ]
}
