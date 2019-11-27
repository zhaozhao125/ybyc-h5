const DEV_MODE = false

let url = DEV_MODE ? 'https://pre.1byongche.cn:7101/v26/user/invite-user-by-coach' : 'https://api.1byongche.com:7101/v26/user/register-user-by-phone'
let shenceURL = DEV_MODE ? 'http://analysis.1byongche.com:8106/sa' : 'http://analysis.1byongche.com:8106/sa?project=production_user'

export default {
  url: url,
  shenceURL: shenceURL,
  activeName: '老带新',
  version: 270,
  CERTKEY: '4drafaedaehb'
}
