const useCarCompleteIndex = () =>
  import(/* webpackChunkName: "useCarComplete" */ '@/views/user-charge/index')
const useCarComplete = () =>
  import(/* webpackChunkName: "useCarComplete" */ '@/views/user-charge/use-car-complete/use-car-complete')
const chargeSuccess = () =>
  import(/* webpackChunkName: "useCarComplete" */ '@/views/user-charge/charge-success/charge-success')
const chargeGuideType = () =>
  import(/* webpackChunkName: "useCarComplete" */ '@/views/user-charge/charge-guide/charge-guide-type')
export default {
  path: '/',
  component: useCarCompleteIndex,
  children: [
    {
      path: '/use-car-complete',
      name: 'useCarComplete',
      component: useCarComplete,
      meta: {
        title: '用车完成',
        noAuth: true
      }
    },
    {
      path: '/charge-success',
      name: 'chargeSuccess',
      component: chargeSuccess,
      meta: {
        title: '来领一步用车奖励金',
        noAuth: true
      }
    },
    {
      path: '/charge-guide/type1',
      name: 'type1',
      component: chargeGuideType,
      meta: {
        title: '充电指引',
        noAuth: true
      }
    },
    {
      path: '/charge-guide/type2',
      name: 'type2',
      component: chargeGuideType,
      meta: {
        title: '充电指引',
        noAuth: true
      }
    },
    {
      path: '/charge-guide/type3',
      name: 'type3',
      component: chargeGuideType,
      meta: {
        title: '充电指引',
        noAuth: true
      }
    },
    {
      path: '/charge-guide/type4',
      name: 'type4',
      component: chargeGuideType,
      meta: {
        title: '充电指引',
        noAuth: true
      }
    }
  ]
}
