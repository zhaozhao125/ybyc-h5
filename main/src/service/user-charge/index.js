import { fetch } from '@/service/fetch.js'
import api from './api'
let postUserAcceptPrize = obj => {
  return fetch(api.USERA_ACCEPT_PRICE, obj, 'post')
}
let getFindBySn = (sn, cityId) => {
  return fetch(
    api.USERA_COMPLETE_FINDBYSN,
    {
      stationSn: sn,
      city_id: cityId
    },
    'post'
  )
}
export default {
  postUserAcceptPrize,
  getFindBySn
}
