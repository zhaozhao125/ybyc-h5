import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/'
import { Toast } from 'mint-ui'
import wallet from './wallet/'
import invite from './invite/'
import accountDetails from './account-details/'
import coupon from './coupon/'
import serviceCenter from './service-center/'
import activity from './activity/'
import userCharge from './user-charge'
import coverCharge from './cover-charge'
import company from './company/'
import lock from './lock'
import userPoints from './user-points'
import invoice from './invoice'
import carPrice from './price'
import violation from './violation'
Vue.use(Router)
const router = new Router({
  routes: [
    wallet,
    invite,
    accountDetails,
    coupon,
    serviceCenter,
    activity,
    userCharge,
    coverCharge,
    company,
    lock,
    userPoints,
    invoice,
    carPrice,
    violation
  ]
})

router.pathStack = []
// 路由拦截
router.beforeEach((to, from, next) => {
  if (!to.meta.noAuth && (!store.getters.user || !store.getters.user.id)) {
    console.log(
      '====用户信息获取失败--router====',
      to.meta.noAuth,
      store.getters.user
    )
    Toast('请先登录')
    if (store.getters.version >= 315) {
      console.log('====login====')
      Vue.prototype.$callHandler('login')
    } else {
      console.log('====finishWebView====')
      setTimeout(() => {
        Vue.prototype.$callHandler('finishWebView')
      }, 1500)
    }
    return
  }

  to.query.routeFrom = from.name
  if (
    router.pathStack.length &&
    router.pathStack[router.pathStack.length - 1].fullPath == to.fullPath
  ) {
    to.query.direction = 'back'
    router.pathStack.pop()
    if (
      (from.name == 'wallet' && router.pathStack.length > 1 && to.name) ||
      router.pathStack.length === 0
    ) {
      Vue.prototype.$callHandler('backToHome')
      next(false)
    }
  } else {
    to.query.direction = 'forward'
    router.pathStack.push(from)
  }
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (Vue.prototype.$callHandler) {
    Vue.prototype.$callHandler('pageRedirect', {
      title: to.meta.title || document.title,
      url: to.fullPath,
      name: to.name
    })
  }
  next()
})

export default router
