import CryptoJS from 'crypto-js'
import encryptKeys from '@/config/encrypt.js'

export function getRnd () {
  let str = CryptoJS.DES.encrypt(
    String(Math.floor(Date.now() / 1000)),
    CryptoJS.enc.Utf8.parse(encryptKeys.DES_KEY),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }
  ).ciphertext.toString(CryptoJS.enc.Base64)

  return str
}

export function getSign (params) {
  let paramsStr =
    Object.keys(params)
      .map(item => {
        return `${item}=${params[item]}`
      })
      .join('&') +
    '&' +
    encryptKeys.CERTKEY
  return CryptoJS.MD5(paramsStr).toString() // .substr(8, 16)
}

export default function encryptParam (user, params) {
  if (!user) {
    console.log('====no user====')
    user = {}
  }
  let validation = {
    rnd: getRnd(),
    client: user.client || '',
    uid: user.id || '',
    token: user.token || '',
    version: user.version || encryptKeys.VERSION
  }
  params = Object.assign(params || {}, validation)
  params.sign = getSign(params)
  return params
}

// console.log(getSign({
//   version: 270,
//   uid: '',
//   type: 'completeAudit',
//   idNewuser: 101570
// }))
