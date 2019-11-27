const coverChargeIndex = () =>
  import(/* webpackChunkName: "coverCharge" */ '@/views/cover-charge/')
const coverCharge = () =>
  import(/* webpackChunkName: "coverCharge" */ '@/views/cover-charge/cover-charge')

export default {
  path: '/cover-charge',
  component: coverChargeIndex,
  children: [
    {
      path: '/',
      name: 'cover-charge',
      component: coverCharge,
      meta: {
        title: '城郊服务费'
      }
    },
    {
      path: 'cover-charge',
      name: 'coverCharge',
      component: coverCharge,
      meta: {
        title: '城郊服务费'
      }
    }
  ]
}
