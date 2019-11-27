const carPrice = () => import(/* webpackChunkName: "carPrice" */ '@/views/price/')

export default {
  path: '/car-price',
  component: carPrice,
  name: 'carPrice',
  meta: {
    title: '分时计费规则',
    noAuth: true
  }
}
