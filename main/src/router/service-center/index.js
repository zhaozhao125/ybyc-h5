const serviceCenterIndex = () =>
  import(/* webpackChunkName: "serviceCenter" */ '@/views/service-center/index')
const serviceCenter = () =>
  import(/* webpackChunkName: "serviceCenter" */ '@/views/service-center/service-center/service-center')
const serviceGuide = () =>
  import(/* webpackChunkName: "serviceCenter" */ '@/views/service-center/guide/index')
const serviceGuideInfo = () =>
  import(/* webpackChunkName: "serviceCenter" */ '@/views/service-center/guide/guide')
const serviceSafety = () =>
  import(/* webpackChunkName: "serviceCenter" */ '@/views/service-center/safety/safety')
const serviceFeedback = () =>
  import(/* webpackChunkName: "serviceCenter" */ '@/views/service-center/feedback/feedback')
// const chargingRules = () =>
//   import(/* webpackChunkName: "serviceCenter" */ '@/views/service-center/charging-rules/charging-rules')
const newUserHelp = () =>
  import(/* webpackChunkName: "serviceCenter" */ '@/views/service-center/service-center/children/sesame-credit-help')

export default {
  path: '/service-center',
  component: serviceCenterIndex,
  children: [
    {
      path: '/',
      name: 'serviceCenter',
      component: serviceCenter,
      meta: {
        title: '客服中心',
        noAuth: true
      }
    },
    {
      path: 'new-user-help',
      name: 'newUserHelp',
      component: newUserHelp,
      meta: {
        title: '新手上路',
        noAuth: true
      }
    },
    // {
    //   path: 'charging-rules',
    //   name: 'chargingRules',
    //   component: chargingRules,
    //   meta: {
    //     title: '分时计费规则',
    //     noAuth: true
    //   }
    // },
    {
      path: 'guide',
      name: 'serviceGuide',
      component: serviceGuide,
      meta: {
        title: '车辆操作指南',
        noAuth: true
      }
    },
    {
      path: 'model',
      name: 'serviceGuideInfo',
      component: serviceGuideInfo,
      meta: {
        title: '车型操作指南',
        noAuth: true
      }
    },
    {
      path: 'safety',
      name: 'serviceSafety',
      component: serviceSafety,
      meta: {
        title: '用车安全四重奏',
        noAuth: true
      }
    },
    {
      path: 'feedback',
      name: 'serviceFeedback',
      component: serviceFeedback,
      meta: {
        title: '反馈与建议',
        noAuth: true
      }
    }
  ]
}
