import { fetch } from '@/service/fetch.js'
import api from './api.js'

const enableInvoiceOrders = (orderType, page, pageSize, showLoading) => {
  return fetch(
    api.ENABLE_INVOICE_ORDERS,
    { orderType, page, pageSize },
    'post',
    {
      showLoading
    }
  )
}
const invoiceApply = params => {
  return fetch(api.INVOICE_APPLY, params)
}
const invoiceHistory = (page, pageSize, showLoading) => {
  return fetch(api.INVOICE_HISTORY, { page, pageSize }, 'post', {
    showLoading
  })
}
const invoiceDetail = sn => {
  return fetch(api.INVOICE_DETAIL, { sn })
}

const invoicePreview = params => {
  return fetch(api.INVOICE_PREVIEW, params)
}
export default {
  enableInvoiceOrders,
  invoiceApply,
  invoiceHistory,
  invoiceDetail,
  invoicePreview
}
