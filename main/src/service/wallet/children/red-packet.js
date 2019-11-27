import {
  fetch
} from '@/service/fetch.js'
import api from '../api/'
import fillParams from '@/util/fillParams'

const getRedPacketInfo = (userId) => {
  return fetch(fillParams(api.GET_RED_PACKET_INFO, {
    userId
  }), {}, 'post')
}

const transferRedPacketToUserBalance = (userId, amount) => {
  return fetch(api.TRANSFER_RED_PACKET_TO_BALANCE, {
    userId,
    amount
  }, 'post')
}

const getRedPacketDetail = (userId, page = 1, pageSize = 20) => {
  // let arr = new Array(20)
  // arr.fill({'id': 3.0, 'sn': '201805161750485720000966576554', 'userId': 96657.0, 'userName': '赵勃闻', 'userPhone': '18860387916', 'actionCode': 'toUserMoneyPresentation', 'amount': -2.0, 'addTime': 1.526464249E12, 'userRedPacket': 0.0, 'userRedPacketBefore': 2.0, 'remark': '', 'createdOn': 1.526464248E12, 'modifiedOn': 1.526464248E12, 'actionCodeText': '转赠送余额'})
  // if (Math.random() < 0.3) {
  //   arr = []
  // }
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve({data: {'errCode': 0, 'errMsg': 'ok', 'data': {'page': 2.0, 'total': 2.0, 'pages': 1.0, 'rows': arr}}})
  //   }, 1000)
  // })
  return fetch(fillParams(api.GET_RED_PACKET_DETAIL, {
    userId
  }), {
    page,
    pageSize
  }, 'post')
}

// 绑定微信
const bindWechat = (code) => {
  return fetch(api.BIND_WECHAT, {
    code: code
  })
}

// 红包提现
const redPacketWithdraw = (userId, amount, appVersion) => {
  return fetch(api.RED_PACKET_WITHDRAW, {
    userId,
    amount,
    accountTransferType: 'weiXin',
    appVersion
  })
}

// 获取绑定的第三方账户信息
const getBindAccounts = () => {
  return fetch(api.GET_BIND_ACCOUNTS)
}

export default {
  getRedPacketInfo,
  transferRedPacketToUserBalance,
  getRedPacketDetail,
  bindWechat,
  redPacketWithdraw,
  getBindAccounts
}
