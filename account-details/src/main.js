import Vue from 'vue'
import App from './app'
import axios from "axios";
import router from './router'
import {
    InfiniteScroll
} from 'mint-ui';
import {
    Spinner
} from 'mint-ui';
import {
    MessageBox
} from "mint-ui";
Vue.use(InfiniteScroll);
Vue.component(Spinner.name, Spinner);

const Axios = axios.create({
    // baseURL: "http://test.1byongche.cn:8520/v26/", //测试地址
    // baseURL: "https://pre.1byongche.cn:7101/v26/", //测试地址
    // baseURL: "http://101.132.26.45:8089/v26", //开发地址
    // baseURL: "http://api.1byongche.com:7001/v26/", //正式地址
    baseURL: "https://api.1byongche.com:7101/v26/", //正式地址
    timeout: 10000, //超时时间
    responseType: "json",
    withCredentials: false, //是否携带cookie
    headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    }
});
Vue.prototype.$ajax = Axios;
Vue.config.productionTip = false

// 获取与原生通信的bridge
let setupWebViewJavascriptBridge = function (callback) {
    if (window.WebViewJavascriptBridge) {
        return callback(window.WebViewJavascriptBridge);
    } else {
        document.addEventListener(
            "WebViewJavascriptBridgeReady",
            function () {
                callback(window.WebViewJavascriptBridge);
            },
            false
        );
    }
    if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement("iframe");
    WVJBIframe.style.display = "none";
    WVJBIframe.src = "wvjbscheme://__BRIDGE_LOADED__";
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
        document.documentElement.removeChild(WVJBIframe);
    }, 0);
};

setupWebViewJavascriptBridge(bridge => {
    /* Initialize your app here */
    if (!bridge) {
        return;
    }
    Vue.prototype.$bridge = bridge
    bridge.callHandler("getUser", {}, res => {
        try {
            let user;
            if (typeof res == "string") {
                user = JSON.parse(res);
            } else {
                user = res;
            }
            if (user.userId) {
                Vue.prototype.$user = user
            } else {
                alert("用户信息获取失败，请重新登录!");
            }
            new Vue({
                el: '#app',
                router,
                render: h => h(App)
            })
        } catch (e) {
            alert('用户信息获取失败，请重新登录');
        }
    });
});