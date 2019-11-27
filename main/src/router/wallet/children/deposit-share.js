const depositShare = () =>
  import(/* webpackChunkName: "wallet" */ '@/views/wallet/deposit-share/deposit-share')
const sesameCredit = () =>
  import(/* webpackChunkName: "wallet" */ '@/views/wallet/deposit-share/children/sesame-credit')
const payShareResult = () =>
  import(/* webpackChunkName: "wallet" */ '@/views/wallet/deposit-share/children/pay-result')
const sesameCreditHelp = () =>
  import(/* webpackChunkName: "wallet" */ '@/views/wallet/deposit-share/children/sesame-credit-help')
const shareDepositInstruction = () =>
  import(/* webpackChunkName: "wallet" */ '@/views/wallet/deposit-share/children/instruction')
const sesameAuth = () =>
  import(/* webpackChunkName: "wallet" */ '@/views/wallet/deposit-share/children/sesame-auth')

export default [{
  path: 'deposit-share',
  name: 'depositShare',
  meta: {
    title: '分时保证金'
  },
  component: depositShare
}, {
  path: 'depositShare',
  redirect: {
    name: 'depositShare'
  }
}, {
  path: 'deposit-share/instruction',
  name: 'shareDepositInstruction',
  meta: {
    title: '保证金说明'
  },
  component: shareDepositInstruction
}, {
  path: 'depositShare/instruction',
  redirect: {
    name: 'shareDepositInstruction'
  }
}, {
  path: 'deposit-share/pay-result',
  name: 'payShareResult',
  meta: {
    title: '保证金交纳'
  },
  component: payShareResult
}, {
  path: 'depositShare/payResult',
  redirect: {
    name: 'payShareResult'
  }
}, {
  path: 'sesame-credit',
  name: 'sesameCredit',
  meta: {
    title: '芝麻信用'
  },
  component: sesameCredit
}, {
  path: 'sesameCredit',
  redirect: {
    name: 'sesameCredit'
  }
}, {
  path: 'sesame-credit-help',
  name: 'sesameCreditHelp',
  meta: {
    title: '芝麻信用'
  },
  component: sesameCreditHelp
}, {
  path: 'sesameCreditHelp',
  redirect: {
    name: 'sesameCreditHelp'
  }
}, {
  path: 'sesame-auth',
  name: 'sesameAuth',
  meta: {
    title: '芝麻信用授权'
  },
  component: sesameAuth
}, {
  path: 'sesameAuth',
  redirect: {
    name: 'sesameAuth'
  }
}]
