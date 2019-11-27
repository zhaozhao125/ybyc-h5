import { fetch } from '@/service/fetch.js'
import api from './api/'

const dashboard = sn => {
  return fetch(api.DASHBOARD, { sn })
}
const companyInfo = sn => {
  return fetch(api.COMPANY_INFO, { sn })
}
export default {
  dashboard,
  companyInfo
}
