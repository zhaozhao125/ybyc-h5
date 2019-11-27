import CryptoJS from 'crypto-js'
import config from '../config.js'

export function getRnd() {
  let str = CryptoJS.DES.encrypt(String(Math.floor(Date.now() / 1000)), CryptoJS.enc.Utf8.parse(encryptKeys.DES_KEY), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).ciphertext.toString(CryptoJS.enc.Base64)

  return str
}

export function getSign(params) {
  let paramsStr = Object.keys(params).map(item => {
    return `${item}=${params[item]}`
  }).join('&') + '&' + config.CERTKEY
  return CryptoJS.MD5(paramsStr).toString() //.substr(8, 16)
}

export default function encryptParam(user, params) {
  let validation = {
    rnd: getRnd(),
    client: user.client || '',
    uid: user.uid || '',
    token: user.token || '',
    version: user.version || config.VERSION
  }
  params = Object.assign(params || {}, validation)
  params.sign = getSign(params)
  return params
}