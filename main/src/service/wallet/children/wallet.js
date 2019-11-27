import {
  fetch
} from '@/service/fetch.js'
import api from '../api/'
import fillParams from '@/util/fillParams'

/**
 * 获取用户钱包数据
 * @param  {int} userId 用户id
 * @return {Promise}
 */
let getUserMoneyDetail = function (userId) {
  return fetch(fillParams(api.GET_USER_MONEY_DETAIL, {
    userId
  }))
}

/**
 * 帐户充值支付
 * @param  {String} paymentPluginId 第三方支付服务id，不可为空,可选值：
                                    alipayMobilePlugin 支付宝
                                    weixinpayMobilePlugin 微信支付
 * @param  {int} payerId            支付者id，不可为空
 * @param  {BigDecimal} amount      支付金额，不可为空
 * @param  {string} paymentType     充值的对应账户，不可为空,可选值：
                                    balanceRecharge
                                    余额
                                    timeShareRentDepositRecharge
                                    分时保证金
                                    longTermRentViolationDepositRecharge
                                    长租违章押金
                                    longTermRentCarDepositRecharge
                                    长租车辆押金
 * @param  {String} terminalFlag    终端类型，非必填，wx_user_gzh 微信终端用户公众号，必填openid信息
 * @param  {String} openid          [description]
 * @return {Promise}                 {
                                      "data": {
                                          "requestMethod": "get",
                                          "requestCharset": "UTF-8",
                                          "requestUrl": "https://alipay.XXXXX.do",
                                          "parameters": { //支付请求参数键值对，不同支付方式不同
                                              "inputCharset": "1",
                                              "bgUrl": "http://XXX:9000/api/payment/notify/async/ZF2016050308000002.jhtml",
                                              "version": "mobile1.0",
                                              "language": "1",
                                              "signType": "4",
                                              "merchantAcctId": "1007877442501",
                                              "payerIdType": "3",
                                              "payerId": "RF860371000006",
                                              "orderId": "ZF2016050308000002",
                                              "orderAmount": "100",
                                              "orderTime": "20160503040850",
                                              "productName": "帐户充值",
                                              "productDesc": "帐户充值",
                                              "payType": "21",
                                              "mobileGateway": "phone",
                                              "signMsg": "bNPHHg5rikPiXVuQAlt1XHNsYT6j6vPb0aFjQOZykUZZ2SC9zDIjQYNAHLD1I/PjhUbssusF2jQL\r\n/G+HHAyQbyt8QMuX33EkPMO6ZQr/wGS3z7PQZx2joy/SjSVCdet0bKcwxoWcI9UGKCUsIa8ZFpzb\r\noUWLaHUD+9bm08dZIy0="
                                          },
                                      "parameterString": "..." //拼装后的参数键值对字符串序列
                                      }
                                  }
 */
let submitOrder = function (paymentPluginId = '', payerId, amount, paymentType, terminalFlag = '', openid = '') {
  if (Number(amount) <= 0) {
    return new Promise((resolve, reject) => {
      reject(new Error('支付金额不能小于零'))
    })
  }
  return fetch(api.SUBMIT_ORDER, {
    paymentPluginId,
    payerId,
    amount,
    paymentType
  })
}

/**
 * 退款-是否能发起退款申请
 * @param  {int} userId        用户id
 * @param  {String} userMoneyType balance("余额"),
                    timeShareRentDeposit("分时保证金"),
                    longTermRentViolationDeposit("长租违章押金"),
                    longTermRentCarDeposit("长租车辆押金");
 * @return {Promise}
 */
let canRefund = function (userId, userMoneyType) {
  return fetch(fillParams(api.GET_REFUND_ABILITY, {
    userId
  }), {
    userMoneyType
  })
}

/**
 * 退款-退款原因列表
 * @param  {int} userId 用户id
 * @return {Promise}
 */
let getRefundReasons = function (userId) {
  return fetch(fillParams(api.GET_REFUND_REASONS, {
    userId
  }))
}

/**
 * 退款-在线退款条件
 * @param  {int} userId        用户id
 * @param  {BigDecimal} amount        退款申请金额
 * @param  {String} userMoneyType balance("余额"),
                    timeShareRentDeposit("分时保证金"),
                    longTermRentViolationDeposit("长租违章押金"),
                    longTermRentCarDeposit("长租车辆押金");
 * @return {Promise}
 */
let getRefundCondition = function (userId, amount, userMoneyType) {
  return fetch(fillParams(api.GET_REFUND_CONDITION, {
    userId
  }), {
    amount,
    userMoneyType
  })
}

/**
 * 退款-申请退款
 * @param  {int}  userId        用户id
 * @param  {BigDecimal}  amount        退款申请金额
 * @param  {String}   userMoneyType balance("余额"),
                      timeShareRentDeposit("分时保证金"),
                      longTermRentViolationDeposit("长租违章押金"),
                      longTermRentCarDeposit("长租车辆押金");
 * @param  {bool} isToBalance   true 直接退款到余额,false 原路退回
 * @param  {String}  amountRate       full-全额，differ-差额
 * @param  {int}  bankId        退款银行id 可为空
 * @param  {String}  bankName      退款银行名字，如中国银行 可为空
 * @return {Promise}
 */
let applyForRefund = function (userId, amount, userMoneyType, isToBalance, amountRate = 'full', refundsResonsStr = '', bankId = '', bankCardNumber = '', bankCardUsername = '') {
  if (Number(amount) <= 0) {
    return new Promise((resolve, reject) => {
      reject(new Error('退款金额不能小于零'))
    })
  }

  return fetch(fillParams(api.APPLY_FOR_REFUND, {
    userId
  }), {
    amount,
    userMoneyType,
    isToBalance,
    amountRate,
    refundsResonsStr,
    bankId,
    bankCardNumber,
    bankCardUsername
  })
}

// 获取芝麻信用授权地址
let getSesameAuth = function (userId) {
  return fetch(fillParams(api.GET_SESAME_AUTH, {
    userId
  }))
}

// 获取充值协议
let getRechargeAgreement = function () {
  return fetch(api.GET_RECHARGE_AGREEMENT)
}

export default {
  getUserMoneyDetail,
  submitOrder,
  canRefund,
  getRefundReasons,
  getRefundCondition,
  applyForRefund,
  getSesameAuth,
  getRechargeAgreement
}
