<template>
  <transition :name="transitionName">
    <router-view class="router"></router-view>
  </transition>
</template>
<script>
import violationService from '@/service/violation/'
import routerTransition from '@/mixins/router-transition'
export default {

  name: 'violation-index',

  mixins: [routerTransition],

  beforeCreate() {
    Object.assign(this.$service, violationService)
  }
}

</script>
<style lang="scss">
</style>
