import { fetch } from '@/service/fetch.js'
import api from './api.js'
import fillParams from '@/util/fillParams'
// import store from '@/store'

const getExpenseRecord = (userId, page = 1, pageSize = 10) => {
  return fetch(
    fillParams(api.GET_EXPENSE_RECORD, {
      userId
    }),
    {
      // userId,
      page,
      pageSize
    },
    'post',
    {
      showLoading: false
    }
  )
}

const getExpenseDetail = (userId, accountRecordId) => {
  return fetch(
    fillParams(api.GET_EXPENSE_DETAIL, {
      userId,
      accountRecordId
    }),
    {
      // userId,
      // accountRecordId
    },
    'post'
  )
}

export default {
  getExpenseRecord,
  getExpenseDetail
}
