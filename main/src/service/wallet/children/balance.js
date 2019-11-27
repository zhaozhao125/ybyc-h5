import {
  fetch
} from '@/service/fetch.js'
import api from '../api/' // 导出所有api对象
import fillParams from '@/util/fillParams'
import store from '@/store'
// console.log(api)
// post 调用
let getBalance = function (userId) {
  return fetch(fillParams(api.GET_BALANCE, {
    userId
  }))
}
let recharge = function (uid, prepaidCardNumber, prepaidCardPassword) {
  return fetch(api.BALANCE_RECHARGE, {
    uid,
    'prepaid_card_number': prepaidCardNumber,
    'prepaid_card_password': prepaidCardPassword
  }, 'post')
}

// 获取分时余额退款原因
const getUserMoneyRefundReasons = () => {
  return fetch(fillParams(api.GET_BALANCE_REFUND_REASONS, {
    userId: store.getters.user.id
  }))
}

// 用户退款能力检验
const getBalanceRefundAbility = () => {
  return fetch(fillParams(api.GET_REFUND_ABILITY, {
    userId: store.getters.user.id
  }), {
    userMoneyType: 'balance'
  })
}

/**
 * 判断退款时是否需要输入银行卡信息
 * @param {Number} amount 退款申请金额
 */
const getBalanceRefundCondition = (amount) => {
  return fetch(fillParams(api.GET_REFUND_CONDITION, {
    userId: store.getters.user.id
  }), {
    amount,
    userMoneyType: 'balance'
  })
}

/**
 * 申请余额退款
 * @param {Number} amount 申请退款金额
 * @param {String} reason 选择的退款原因代号
 * @param {String} reasonText 输入的退款原因
 * @param {String} bankId 退款银行id，可为空
 * @param {String} bankCardNumber 退款银行卡号，可为空
 * @param {String} bankCardUsername 银行账户名，可为空
 */
const submitBalanceRefund = (amount, reason, reasonText, bankId, bankCardNumber, bankCardUsername) => {
  let data = {
    amount,
    userMoneyType: 'balance',
    isToBalance: false,
    amountRate: 'full',
    refundsResonsStr: JSON.stringify([{
      reason: reason,
      reasonText: reasonText
    }])
  }
  if (bankId) {
    data.bankId = bankId
    data.bankCardNumber = bankCardNumber
    data.bankCardUsername = bankCardUsername
  }
  return fetch(fillParams(api.SUBMIT_BALANCE_REFUND, {
    userId: store.getters.user.id
  }), data)
}
export default {
  getBalance,
  recharge,
  getUserMoneyRefundReasons,
  getBalanceRefundAbility,
  getBalanceRefundCondition,
  submitBalanceRefund
}
