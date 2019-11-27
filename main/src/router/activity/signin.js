// 签到活动
const signin = () =>
  import(/* webpackChunkName: "signin" */ '@/views/activity/signin/signin')
// 签到记录
const signinRecord = () =>
  import(/* webpackChunkName: "signin" */ '@/views/activity/signin/record')

export default [{
  path: 'signin',
  name: 'signin',
  component: signin,
  meta: {
    title: '签到有礼',
    noAuth: true
  }
},
{
  path: 'signin-record',
  name: 'signinRecord',
  component: signinRecord,
  meta: {
    title: '我的战绩',
    noAuth: true
  }
}
]
