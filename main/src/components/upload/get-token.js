import {
  fetch
} from '@/service/fetch'

export default async function getToken() {
  let res = await fetch('http://test.1byongche.cn:8531/common/qiniu/yongche/uptoken', null, 'get')
  return res.data.data.token
}
