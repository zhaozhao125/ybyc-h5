<template>
  <transition :name="transitionName">
    <router-view class="router"></router-view>
  </transition>
</template>
<script>
import companyService from '@/service/company/'
import routerTransition from '@/mixins/router-transition'
export default {

  name: 'company-index',

  mixins: [routerTransition],

  beforeCreate() {
    Object.assign(this.$service, companyService)
  }
}

</script>
<style lang="scss">
</style>
