<template>
  <transition :name="transitionName">
    <router-view class="router"></router-view>
  </transition>
</template>
<script>
import dataService from '@/service/account-details/';
import routerTransition from '@/mixins/router-transition'
export default {

  name: 'account-detail-index',

  mixins: [routerTransition],

  beforeCreate() {
    Object.assign(this.$service, dataService)
  }
}
</script>
<style lang="scss">


</style>
