import { fetch } from '@/service/fetch.js'
import api from '../api/'

let timeShareCardRecharge = (
  userId,
  prepaidCardNumber,
  prepaidCardPassword
) => {
  return fetch(api.TIME_SGARE_CARD_RECHARGE, {
    userId,
    prepaidCardNumber,
    prepaidCardPassword
  })
}
let timeShareCardMoney = userId => {
  return fetch(
    `/service-user/apiUser/finance/userMoney/${userId}/card/info`,
    {}
  )
}
export default {
  timeShareCardRecharge,
  timeShareCardMoney
}
