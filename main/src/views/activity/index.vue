<template>
  <transition :name="transitionName">
    <!-- <keep-alive include="free-order-index"> -->
      <router-view class="router"></router-view>
    <!-- </keep-alive> -->
  </transition>
</template>
<script>
import routerTransition from '@/mixins/router-transition'
export default {
  name: 'activity-index',

  mixins: [routerTransition]
}
</script>
<style lang="scss">
</style>
