import { fetch } from '@/service/fetch.js'
import api from './api/'
const applyProgress = () => {
  return fetch(api.APPLY_PROGRESS, {}, 'post')
}
const apply = (uid, companyName) => {
  return fetch(api.APPLY, { uid, companyName }, 'post')
}
export default {
  applyProgress,
  apply
}
