// import baseUrl from '@/config/base-url'
import wallet from './children/wallet.js'
import deposit from './children/deposit.js'
import balance from './children/balance.js'
import activity from './children/activity.js'
import redPacket from './children/red-packet'
import timeShareCard from './children/time-share-card'

let api = {
  ...wallet,
  ...deposit,
  ...balance,
  ...activity,
  ...redPacket,
  ...timeShareCard
}

// Object.keys(api).forEach(key => {
//   api[key] = baseUrl + api[key]
// })

export default api
