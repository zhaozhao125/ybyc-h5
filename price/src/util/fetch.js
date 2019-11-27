import axios from 'axios'
import qs from 'qs' //序列化表单数据
import {
  Toast
} from 'mint-ui'
import loading from '../components/loading/'
import encryptParam from '../util/encryptParam.js'

const Axios = axios.create({
  // baseURL: "http://test.1byongche.cn:8520/", //测试地址
  // baseURL: "https://pre.1byongche.cn:7101/", //测试地址
  // baseURL: "http://101.132.26.45:8089/", //开发地址
  // baseURL: 'http://api.1byongche.com:7001/', // 正式地址
  baseURL: 'https://api.1byongche.com:7101/', // 正式地址https
  timeout: 10000,
  // responseType: 'json',
  withCredentials: false, // 是否允许带cookie这些
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
})

//POST传参序列化(添加请求拦截器)
Axios.interceptors.request.use(
  config => {
    loading.open()
      // 在发送请求之前做某件事
    if (
      config.method === 'post' ||
      config.method === 'put' ||
      config.method === 'delete'
    ) {
      let user = config.user
      if (!user) {
        return Promise.reject(new Error('无法获取用户信息'))
      }
      config.data = qs.stringify(encryptParam(user, config.data))
        // 序列化
        // config.data = (config.data)
    }
    return config
  },
  error => {
    Toast({
      message: error
    })
    return Promise.reject(error)
  }
)

//返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
  res => {
    loading.close()
    if (!res.data.errCode) {
      return res
    }
    //对响应数据做些事
    if (res.data && (res.data.errCode != 0)) {
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
      return Promise.reject(res.data)
    }
    return res
  },
  error => {
    let msg = ''
    try {
      msg = error.response.data.message
    } catch (e) {
      msg = error.message || '请求超时，请稍后再试'
    }
    if(!msg){
      msg = '请求出错，请稍后再试'
    }
    if (msg.match('timeout')) {
      msg = '请求超时，请稍后再试'
    }
    if (msg.match('Network Error')) {
      msg = '网络出错'
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
  install: function(Vue, Option) {
    Object.defineProperty(Vue.prototype, '$http', {
      value: Axios
    })
  }
}

export function fetch(url, data, method = 'post') {
  let options = {
    method: method,
    url: url
  }
  if (method.toLowerCase().match(/post|put|patch/i)) {
    options.data = data
  } else {
    options.params = data
  }
  return Axios(options)
}