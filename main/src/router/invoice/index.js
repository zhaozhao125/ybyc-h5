const invoiceIndex = () =>
  import(/* webpackChunkName: "invoice" */ '@/views/invoice/')
const invoice = () =>
  import(/* webpackChunkName: "invoice" */ '@/views/invoice/components/index')
const invoiceInfo = () =>
  import(/* webpackChunkName: "invoice" */ '@/views/invoice/components/info')
const invoiceHistory = () =>
  import(/* webpackChunkName: "invoice" */ '@/views/invoice/components/history')
const invoiceApplyDetail = () =>
  import(/* webpackChunkName: "invoice" */ '@/views/invoice/components/apply-or-detail')
const invoiceRule = () =>
  import(/* webpackChunkName: "invoice" */ '@/views/invoice/components/rule')
export default {
  path: '/invoice',
  component: invoiceIndex,
  children: [
    {
      path: 'index',
      name: 'invoice',
      component: invoice,
      meta: {
        title: '开具发票'
      }
    },
    {
      path: 'info',
      name: 'invoiceInfo',
      component: invoiceInfo,
      meta: {
        title: '开具发票'
      }
    },
    {
      path: 'history',
      name: 'invoiceHistory',
      component: invoiceHistory,
      meta: {
        title: '开票历史'
      }
    },
    {
      path: 'apply',
      name: 'invoiceApply',
      component: invoiceApplyDetail,
      meta: {
        title: '申请开票'
      }
    },
    {
      path: 'detail',
      name: 'invoiceDetail',
      component: invoiceApplyDetail,
      meta: {
        title: '开票详情'
      }
    },
    {
      path: 'rule',
      name: 'invoiceRule',
      component: invoiceRule,
      meta: {
        title: '开票规则'
      }
    }
  ]
}
