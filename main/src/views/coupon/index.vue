<template>
  <transition :name="transitionName">
    <router-view class="router"></router-view>
  </transition>
</template>
<script>
import dataService from '@/service/coupon/'
import routerTransition from '@/mixins/router-transition'
export default {
  name: 'coupon-index',

  mixins: [routerTransition],

  beforeCreate() {
    Object.assign(this.$service, dataService)
  }
}

</script>
<style lang="scss">

</style>
