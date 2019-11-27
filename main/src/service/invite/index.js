import {fetch} from '@/service/fetch.js'
import api from './api.js'
const getInviteRecord = () => {
  return fetch(api.GET_INVITE_RECORD, null, 'post')
}

export default {
  getInviteRecord
}
