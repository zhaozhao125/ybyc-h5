<template>
  <transition :name="transitionName">
    <router-view class="router"></router-view>
  </transition>
</template>
<script>
import routerTransition from '@/mixins/router-transition'
export default {

  name: 'cover-charge-index',

  mixins: [routerTransition]

}
</script>
<style lang="scss">
</style>
