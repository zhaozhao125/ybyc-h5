<template>
  <transition :name="transitionName">
    <keep-alive>
      <router-view class="router"></router-view>
    </keep-alive>
  </transition>
</template>
<script>
import lockService from '@/service/lock/'
import routerTransition from '@/mixins/router-transition'
export default {

  name: 'lock-index',

  mixins: [routerTransition],

  beforeCreate() {
    Object.assign(this.$service, lockService)
  }
}
</script>
<style lang="scss">
</style>
