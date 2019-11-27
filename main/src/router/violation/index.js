const violationIndex = () => import(/* webpackChunkName: "violation" */ '@/views/violation/')
const violationRecord = () => import(/* webpackChunkName: "violation" */ '@/views/violation/record/')
const violationToBeProcessed = () => import(/* webpackChunkName: "violation" */ '@/views/violation/record/to-be-processed')
const violationProcessed = () => import(/* webpackChunkName: "violation" */ '@/views/violation/record/processed')
const violationDetail = () => import(/* webpackChunkName: "violation" */ '@/views/violation/detail/')
const violationUpload = () => import(/* webpackChunkName: "violation" */ '@/views/violation/upload')

export default {
  path: '/violation',
  component: violationIndex,
  redirect: {
    name: 'violationRecord'
  },
  children: [{
    path: 'record',
    name: 'violationRecord',
    component: violationRecord,
    meta: {
      title: '违章记录'
    },
    redirect: {
      name: 'violationToBeProcessed'
    },
    children: [{
      path: 'to-be-processed',
      name: 'violationToBeProcessed',
      component: violationToBeProcessed,
      meta: {
        title: '违章记录'
      }
    },
    {
      path: 'processed',
      name: 'violationProcessed',
      component: violationProcessed,
      meta: {
        title: '违章记录'
      }
    }
    ]
  },
  {
    path: 'detail/:id',
    name: 'violationDetail',
    component: violationDetail,
    meta: {
      title: '违章详情'
    }
  },
  {
    path: 'upload',
    name: 'violationUpload',
    component: violationUpload,
    meta: {
      title: '上传凭证'
    }
  }
  ]
}
