import {
  fetch
} from '@/service/fetch.js'

/**
 * 获取用户积分
 */
function getUserPoints() {
  return fetch('/service-user/apiPromotion/score/userScoreIntegral/info')
}

/**
 * 查询每日签到情况
 */
function getUserSignState() {
  return fetch('/service-user/apiPromotion/score/userScoreIntegral/actionToday/activitySign')
}

/**
 * 积分签到
 */
function signFromUserPoints() {
  return fetch('/service-user/apiPromotion/score/userScoreIntegral/handle', {
    actionCode: 'activitySign'
  })
}

/**
 * 获取积分收支明细
 * @param {Number} page
 * @param {String} incDecType 收入：INC 支出：DEC
 * @param {Number} pageSize
 */
function getUserPointsDetail(page = 1, incDecType, pageSize = 50) {
  let params = {
    page,
    pageSize
  }
  if (incDecType) {
    params.incDecType = incDecType
  }

  return fetch('/service-user/apiPromotion/score/userScoreIntegral/record/page', params, {
    showLoading: false
  })
}

/**
 * 获取积分商城商品
 */
function getPointMallGoods() {
  return fetch('/service-user/apiPromotion/score/userScoreShopping/shoppingCommodity')
}

/**
 * 积分兑换商品
 * @param {String} itemId 商品ID
 */
function pointExchange(itemId) {
  return fetch('/service-user/apiPromotion/score/userScoreShopping/exchangeCommodity', {
    commodityId: itemId
  })
}

export default {
  getUserPoints,
  getUserSignState,
  signFromUserPoints,
  getUserPointsDetail,
  getPointMallGoods,
  pointExchange
}
