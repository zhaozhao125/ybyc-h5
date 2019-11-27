const lockIndex = () => import(/* webpackChunkName: "lock" */ '@/views/lock/')
const lock = () =>
  import(/* webpackChunkName: "lock" */ '@/views/lock/lock.vue')

export default {
  path: '/lock',
  component: lockIndex,
  children: [
    {
      path: '/',
      name: 'lock',
      component: lock,
      meta: {
        title: '智能车位列表'
      }
    }
  ]
}
