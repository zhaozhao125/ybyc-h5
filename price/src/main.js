import Vue from 'vue'
import App from './App.vue'
import fetch from './util/fetch.js'
import {
  Toast
} from 'mint-ui'
Vue.prototype.$toast = Toast

Vue.use(fetch)

// 获取与原生通信的bridge
var setupWebViewJavascriptBridge = function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge);
  } else {
    document.addEventListener('WebViewJavascriptBridgeReady', function() {
      callback(window.WebViewJavascriptBridge);
    }, false);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function() {
    document.documentElement.removeChild(WVJBIframe);
  }, 0);
};

setupWebViewJavascriptBridge(function(bridge) {
  /* Initialize your app here */
  if (!bridge) {
    alert('no bridge')
    return;
  }
  
  Vue.prototype.$callHandler = function callHandler(bridgeName, prarms = {}) {
    return new Promise((resolve, reject) => {
      try {
        bridge.callHandler(bridgeName, prarms, function(data) {
          if (typeof data === 'string') {
            return resolve(JSON.parse(data))
          }
          return resolve(data)
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  new Vue({
    el: '#app',
    render: h => h(App)
  })
});

if (process.env.NODE_ENV !== 'production') {
  new Vue({
    el: '#app',
    render: h => h(App)
  })
}