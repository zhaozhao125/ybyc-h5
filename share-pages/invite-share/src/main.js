import Vue from 'vue'
import App from './App.vue'
import config from './config'

import sa from 'sa-sdk-javascript'

window.sa = sa
let saConfig = {
  // sensorsdata.min.js 文件的地址，请从 GitHub 获取并且放在你们自己网站目录下。
  sdk_url: 'https://static.sensorsdata.cn/sdk/1.9.13/sensorsdata.min.js',
  // SDK 使用的一个默认的全局变量，如定义成 sa 的话，后面接可以使用 sa.track() 用来跟踪信息。为了防止变量名重复，你可以修改成其他名称比如 sensorsdata 等 。
  name: 'sa',
  // 数据接收地址。
  server_url: config.shenceURL,
  // （1.9以上版本新加） heatmap.min.js 文件的地址，在热力分析渲染页面时会用到，采集数据时候不会加载。
  heatmap_url: 'https://static.sensorsdata.cn/sdk/1.9.13/heatmap.min.js',
  // 设置成 true 后，表示在根域下设置 cookie 。也就是如果你有 zhidao.baidu.com 和 tieba.baidu.com 两个域，且有一个用户在同一个浏览器都登录过这两个域的话，我们会认为这个用户是一个用户。如果设置成 false 的话，会认为是两个用户。默认 true。
  corss_subdomain: false
}

// if (process.env.NODE_ENV === 'production') {
//   saConfig.server_url =
//     'https://analysis.1byongche.com:8106/sa?project=production_user'
// }

sa.init(saConfig)

new Vue({
  el: '#app',
  render: h => h(App)
})
