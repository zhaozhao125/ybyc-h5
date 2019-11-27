import wallet from './children/wallet.js'
import deposit from './children/deposit.js'
import balance from './children/balance.js'
import activity from './children/activity.js'
import redPacket from './children/red-packet'
import timeShareCard from './children/time-share-card'
export default {
  ...wallet,
  ...deposit,
  ...balance,
  ...activity,
  ...redPacket,
  ...timeShareCard
}
