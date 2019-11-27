import {
  fetch
} from '@/service/fetch.js'
import api from './api.js'

/**
 * 用户个人违章列表
 * @param {String} status 处理状态：dealing-待处理  finish-已处理
 * @param {Number} page 页码
 * @param {Number} pageSize 分页大小
 */
function getViolationList(status, page = 1, pageSize = 20) {
  return fetch(api.GET_VIOLATION_LIST, {
    status,
    page,
    size: pageSize
  })
}

/**
 * 用户个人违章详情
 * @param {String} id 违章ID
 */
function getViolationDetail(id) {
  return fetch(api.GET_VIOLATION_DETAIL, {
    id
  })
}

/**
 * 用户提交凭证
 * @param {String} id 违章记录id
 * @param {String} voucherImage 凭证图片
 * @param {String} remark 备注文字
 */
function submitViolationVoucher(id, voucherImage, remark) {
  return fetch(api.SUBMIT_VIOLATION_VOUCHER, {
    id,
    voucherImage,
    remark
  })
}

export default {
  getViolationList,
  getViolationDetail,
  submitViolationVoucher
}
