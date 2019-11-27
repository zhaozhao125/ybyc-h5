import { fetch } from '@/service/fetch.js'
import api from './api.js'
const listCoupons = data => {
  return fetch(api.POST_LISTCOUPONS, data, 'post', { showLoading: false })
}
const gainCoupons = data => {
  return fetch(api.POST_GAINCOUPONS, data, 'post')
}
const gainRandomCode = data => {
  return fetch(api.POST_RANDOM_CODE, data, 'post')
}
export default {
  listCoupons,
  gainCoupons,
  gainRandomCode
}
