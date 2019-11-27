import {
  fetch
} from '@/service/fetch.js'
import api from '../api/'
import fillParams from '@/util/fillParams'
import store from '@/store/'

/**
 * 获取分时保证金详情
 * @param  {String} userId [用户ID]
 * @return {Promise}
 */
let getShareDepositDetail = function(userId) {
  return fetch(fillParams(api.GET_SHARE_DEPOSIT_DETAIL, {
    userId
  }))
}

/**
 * 获取当前芝麻信用优惠设置
 * @return {Promise}
 */
let getSesameConfig = function () {
  return fetch(api.GET_SESAME_CONFIG, null)
}

/**
 * 获取长租保证金详情
 * @param  {String} userId 用户ID
 * @return {Promise}
 */
let getRentDepositDetail = function (userId) {
  return fetch(fillParams(api.GET_RENT_DEPOSIT_DETAIL, {
    userId
  }))
}

/**
 * 撤销分时保证金退款申请
 */
function cancelShareDepositRefund() {
  let userId = store.getters.user.id
  let url = fillParams(api.CANCEL_REFUND, {
    userId
  })
  return fetch(url, {
    userMoneyType: 'timeShareRentDeposit'
  })
}

export default {
  getShareDepositDetail,
  getSesameConfig,
  getRentDepositDetail,
  cancelShareDepositRefund
}
