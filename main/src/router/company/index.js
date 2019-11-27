import empolyeeRouter from './empolyee'
import port from '@/service/company/index'
const companyIndex = () =>
  import(/* webpackChunkName: "company" */ '@/views/company/')
const intro = () =>
  import(/* webpackChunkName: "company" */ '@/views/company/intro')
const registger = () =>
  import(/* webpackChunkName: "company" */ '@/views/company/register/')
const personalPage = () =>
  import(/* webpackChunkName: "company" */ '@/views/company/personal-page/')
const companyPage = () =>
  import(/* webpackChunkName: "company" */ '@/views/company/admin/company-page/')
const companyHelp = () =>
  import(/* webpackChunkName: "company" */ '@/views/company/admin/company-page/company-help')
const companyInfo = () =>
  import(/* webpackChunkName: "company" */ '@/views/company/admin/company-page/company-info/index')
const order = () =>
  import(/* webpackChunkName: "company" */ '@/views/company/admin/order/')
const balance = () =>
  import(/* webpackChunkName: "company" */ '@/views/company/admin/balance/balance')
const accountDetails = () =>
  import(/* webpackChunkName: "company" */ '@/views/company/admin/balance/account-details')
const detailItem = () =>
  import(/* webpackChunkName: "company" */ '@/views/company/admin/balance/detail-item')
export default {
  path: '/company',
  component: companyIndex,
  children: [
    {
      path: '/',
      name: 'company',
      component: intro,
      meta: {
        title: '企业用车'
      }
    },
    {
      path: 'intro',
      name: 'company-intro',
      component: intro,
      meta: {
        title: '企业用车'
      }
    },
    {
      path: 'registger',
      name: 'company-registger',
      component: registger,
      meta: {
        title: '创建企业账户'
      }
    },
    {
      path: 'personal-page',
      name: 'company-personal-page',
      component: personalPage,
      meta: {
        title: '企业用车'
      }
    },
    {
      path: '/help',
      name: 'company-help',
      component: companyHelp,
      meta: {
        title: '使用帮助'
      }
    },
    {
      path: 'company-page',
      name: 'company-page',
      component: companyPage,
      meta: {
        title: '企业用车'
      },
      beforeEnter (to, from, next) {
        console.log(to, from, next, '路由栈')
        port.applyProgress().then(res => {
          // ===============================逻辑=============================
          // 是否申请企业 //是否待审核
          // 是否是企业员工
          // 企业创建成功 之后 这两个都是false 需要添加员工  跳转到添加员工界面
          // 首先判断是否是企业员工
          // 不是企业员工还能再申请 申请成功之后还能再申请
          // 判断是否是企业员工
          // 是企业员工

          if (res.data.data.companyStaff) {
            // 跳转到企业主页
            // let role
            // // tudu 判断是否是管理员
            // if (res.data.data.role === 'general') {
            //   // 普通企业员工
            //   role = 'general'
            // } else if (res.data.data.role === 'manager') {
            //   // 企业管理员
            //   role = 'manager'
            // }
            to.params.companyInfo = res.data.data
            next()
          } else {
            // 不是企业员工跳转到宣传首页
            next({ name: 'company-intro', replace: true })
          }
        })
      }
    },
    {
      path: 'info',
      name: 'company-info',
      component: companyInfo,
      meta: {
        title: '企业信息'
      }
    },
    {
      path: 'order',
      name: 'company-order',
      component: order,
      meta: {
        title: '订单列表'
      }
    },
    {
      path: 'balance',
      name: 'company-balance',
      component: balance,
      meta: {
        title: '余额'
      }
    },
    {
      path: 'account-details',
      name: 'company-account-details',
      component: accountDetails,
      meta: {
        title: '收支明细'
      }
    },
    {
      path: 'detail-item',
      name: 'company-detail-item',
      component: detailItem,
      meta: {
        title: '收支明细'
      }
    },
    ...empolyeeRouter
  ]
}
