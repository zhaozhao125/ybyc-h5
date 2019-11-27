import feedback from './children/feedback.js'
import { fetch } from '@/service/fetch.js'
import api from './api'
let carPriceList = data => {
  return fetch(api.POST_CAR_PRICE_LIST, data, 'post')
}
export default {
  ...feedback,
  carPriceList
}
