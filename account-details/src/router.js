import Vue from 'vue'
import Router from 'vue-router'
import Bill from './bill'
import Detail from './detail'
Vue.use(Router)

let router = new Router({
  routes: [{
      path: '/',
      redirect: '/bill'
    },
    {
      path: '*',
      redirect: '/bill'
    },
    {
      path: '/bill',
      name: 'Billlist',
      component: Bill
    },
    {
      path: '/detail',
      name: 'Detail',
      component: Detail
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (Vue.prototype.$bridge && Vue.prototype.$bridge.callHandler) {
    Vue.prototype.$bridge.callHandler('pageRedirect', {
      title: to.meta.title || document.title,
      url: to.fullPath,
      name: to.name
    }, function responseCallback(responseData) {})
  }
  next()
})

export default router
