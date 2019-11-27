<template>
  <transition :name="transitionName">
    <keep-alive>
      <router-view class="router"></router-view>
    </keep-alive>
  </transition>
</template>
<script>
import inviteService from '@/service/invite/'
import routerTransition from '@/mixins/router-transition'
export default {

  name: 'invite-index',

  mixins: [routerTransition],

  beforeCreate() {
    Object.assign(this.$service, inviteService)
  }
}

</script>
<style lang="scss">

</style>
