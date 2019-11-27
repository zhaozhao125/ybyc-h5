// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import loading from './components/loading/index'
import {
  Button,
  Toast,
  MessageBox,
  Spinner,
  InfiniteScroll
} from 'mint-ui'
import {
  fetch
} from '@/service/fetch.js'
import getBridge from '@/util/bridge.js'
import sa from 'sa-sdk-javascript'

// ==========mint-ui===========
Vue.component(Button.name, Button)
Vue.component(Spinner.name, Spinner)
Vue.use(InfiniteScroll)
Vue.prototype.$toast = Toast
Vue.prototype.$message = MessageBox
// ==========mint-ui===========

Object.defineProperty(Vue.prototype, '$loading', {
  value: loading,
  writable: false
})
Object.defineProperty(Vue.prototype, '$service', {
  value: {},
  writable: false
})
Object.defineProperty(Vue.prototype, '$fetch', {
  value: fetch,
  writable: false
})
getBridge()
  .then(bridge => {
    // if (process.env.NODE_ENV !== 'production') {
    //   return
    // }
    bridge.registerHandler('getPayResult', res => {
      try {
        let result = res
        if (typeof res === 'string') {
          result = JSON.parse(res)
        }
        store.commit('setPayResult', result)
      } catch (e) {
        alert(e)
      }
    })
    bridge.registerHandler('refreshWebPage', res => {
      console.log('====call refresh====')
      location.reload()
    })
    bridge.callHandler('getUser', {}, res => {
      try {
        let user
        if (typeof res === 'string') {
          user = JSON.parse(res)
        } else {
          user = res
        }
        console.log('====getUser====', user)
        if (user) {
          store.commit('setUser', {
            id: user.userId,
            phone: user.phone,
            client: user.client,
            uid: user.userId,
            token: user.token,
            version: Number(user.version)
          })
        }
        new Vue({
          el: '#app',
          router,
          store,
          components: {
            App
          },
          template: '<App/>'
        })
      } catch (e) {
        console.log('====用户信息获取失败--main====')
        console.dir(e)
        alert('用户信息获取失败，请重新登录...')
      }
    })
    bridge.callHandler(
      'pageRedirect', {
        name: 'index'
      },
      () => {}
    )
    Object.defineProperty(Vue.prototype, '$bridge', {
      value: bridge,
      writable: false
    })
    Vue.prototype.$callHandler = function callHandler(bridgeName, prarms = {}) {
      return new Promise((resolve, reject) => {
        bridge.callHandler(bridgeName, prarms, function (data) {
          // console.log('====data====', data, typeof data)
          if (typeof data === 'string') {
            let ret
            try {
              ret = JSON.parse(data)
            } catch (e) {
              console.log('====callHandler err====', e)
              ret = data
            }
            return resolve(ret)
          } else {
            return resolve(data)
          }
        })
      })
    }
  })
  .catch(err => {
    alert('bridge error')
    alert(err)
  })

window.sa = sa
let saConfig = {
  // sensorsdata.min.js 文件的地址，请从 GitHub 获取并且放在你们自己网站目录下。
  sdk_url: 'https://static.sensorsdata.cn/sdk/1.9.13/sensorsdata.min.js',
  // SDK 使用的一个默认的全局变量，如定义成 sa 的话，后面接可以使用 sa.track() 用来跟踪信息。为了防止变量名重复，你可以修改成其他名称比如 sensorsdata 等 。
  name: 'sa',
  // 数据接收地址。
  server_url: 'http://analysis.1byongche.com:8106/sa?project=default',
  // （1.9以上版本新加） heatmap.min.js 文件的地址，在热力分析渲染页面时会用到，采集数据时候不会加载。
  heatmap_url: 'http://static.sensorsdata.cn/sdk/1.9.13/heatmap.min.js',
  // 设置成 true 后，表示在根域下设置 cookie 。也就是如果你有 zhidao.baidu.com 和 tieba.baidu.com 两个域，且有一个用户在同一个浏览器都登录过这两个域的话，我们会认为这个用户是一个用户。如果设置成 false 的话，会认为是两个用户。默认 true。
  corss_subdomain: false,
  debug: true
}

if (process.env.BUILD_ENV === 'production') {
  // 如果接口环境为正式环境，则取消神策debug模式
  saConfig.debug = false
  if (process.env.NODE_ENV === 'production') {
    // 如果接口环境为正式且构建代码时，才将神策接口改为正式接口
    saConfig.server_url =
      'http://analysis.1byongche.com:8106/sa?project=production_user'
  }
}

sa.init(saConfig)

Vue.prototype.$track = window.sa.track

Vue.config.productionTip = false

/* eslint-disable no-new */
if (process.env.NODE_ENV !== 'production') {
  store.commit('setUser', {
    client: '1',
    version: 318,
    token: '8071addfe68771d0b5600051250bc658',
    id: 174630,
    phone: '13233223322'
  })
  // store.commit('setUser', {
  //   client: '1',
  //   version: 319,
  //   token: '',
  //   id: '',
  //   phone: ''
  // })
  new Vue({
    el: '#app',
    router,
    store,
    components: {
      App
    },
    template: '<App/>'
  })
}

document.getElementById('loading-wrapper').remove()
