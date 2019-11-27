import { fetch } from '@/service/fetch.js'
import api from '../api/'
import store from '@/store'

/**
 * 提交反馈与建议
 * @param  {int} content
 * @return {Promise}
 */
let submitFeedback = function (content) {
  return fetch(api.SUBMIT_FEEDBACK, {
    msgContent: content,
    userId: store.getters.user.id
  })
}

export default {
  submitFeedback
}
