import { fetch } from '@/service/fetch.js'
import api from './api/'

const companyRecord = (companySn, page, pageSize, showLoading) => {
  return fetch(
    api.COMPANYRECORD_PAGE,
    { companySn, page, pageSize },
    'post',
    { showLoading: showLoading },
    {
      requestBodyType: 'noJson'
    }
  )
}

export default {
  companyRecord
}
