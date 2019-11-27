import axios from 'axios'
import qs from 'qs' // 序列化表单数据
import {
  Toast
} from 'mint-ui'
import loading from '@/components/loading/'
import store from '@/store/'
import encryptParam from '@/util/encryptParam.js'
import baseUrl from '@/config/base-url'

const Axios = axios.create({
  baseURL: baseUrl || '/',
  timeout: 20000,
  // responseType: 'json',
  withCredentials: false, // 是否允许带cookie这些
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
})

// POST传参序列化(添加请求拦截器)
Axios.interceptors.request.use(
  req => {
    if (req.config && req.config.showLoading !== false) {
      loading.open()
    }
    // 在发送请求之前做某件事
    if (
      req.method === 'post' ||
      req.method === 'put' ||
      req.method === 'delete'
    ) {
      let user = store.getters.user
      // if (!user) {
      //   return Promise.reject(new Error('请先登录'))
      // }
      if (req.config.requestBodyType === 'json' || req.config.type == 'json') {
        req.data = JSON.stringify(encryptParam(user, req.data))
        req.headers = {
          'Content-Type': 'application/json;charset=utf-8'
        }
      } else {
        req.headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
        req.data = qs.stringify(encryptParam(user, req.data))
      }
      // if (config.type === 'formData') {
      //     config.data = qs.stringify(config.data);
      //     config.headers = {
      //         'Content-Type': 'application/x-www-form-urlencoded'
      //     }
      // }  {
      //     config.data = JSON.stringify(config.data)
      //     config.headers = {
      //         'Content-Type': 'application/json;charset=utf-8'
      //     }
      // }
      // config.data = qs.stringify(encryptParam(user, config.data))
    }

    return req
  },
  error => {
    Toast({
      message: error
    })
    return Promise.reject(error)
  }
)

// 返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
  res => {
    loading.close()
    if (!res.data.errCode) {
      return res
    }
    // 对响应数据做些事
    if (res.data && res.data.errCode != 0) {
      if (res.config.config && !res.config.config.noErrorMsg) {
        let msg = res.data.errMsg || res.data.data.errorMsg
        if (msg) {
          Toast({
            message: msg
          })
        } else {
          Toast({
            message: '请求出错'
          })
        }
      }
      return Promise.reject(res.data)
    }
    return res
  },
  error => {
    let msg = ''
    try {
      msg = error.response.data.message || '请求出错'
    } catch (e) {
      msg = error.message || '请求超时，请稍后再试'
    }
    if (msg.match('timeout')) {
      msg = '请求超时，请稍后再试'
    }
    if (msg.match('Network Error')) {
      msg = '无法连接到网络'
    }
    loading.close()
    Toast({
      message: msg || error
    })
    return Promise.reject(error)
  }
)

// 对axios的实例重新封装成一个plugin ,方便 Vue.use(xxxx)
export default {
  install: function (Vue, Option) {
    Object.defineProperty(Vue.prototype, '$http', {
      value: Axios
    })
  }
}

export function fetch(url, data = {}, method = 'post', config = {}) {
  // config={showLoading:''false,requestBodyType:'json'}
  if (typeof method === 'object') {
    config = method
    method = config.method || 'post'
  }
  if (typeof config.query === 'object') {
    url += ('?' + Object.keys(config.query).map(key => `${key}=${config.query[key]}`).join('&'))
  }
  let options = {
    method: method,
    url: url,
    config
  }
  if (method.toLowerCase().match(/post|put|patch/i)) {
    options.data = data
  } else {
    options.params = data
  }
  return Axios(options)
}
