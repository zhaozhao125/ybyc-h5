import activityIndex from '@/views/activity/'
import temporary from './tmporary'
import signinRoutes from './signin'
import freeOrderRoutes from './free-order'
import longRentInviteRoutes from './long-rent-invite'

export default {
  path: '/activity',
  component: activityIndex,
  children: [
    ...temporary,
    ...signinRoutes,
    ...freeOrderRoutes,
    ...longRentInviteRoutes
  ]
}
