<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import smoothscroll from 'smoothscroll-polyfill'
export default {
  name: 'app',

  data() {
    return {

    }
  },

  mounted() {
    if (window.FastClick) {
      window.FastClick.attach(document.body)
    }
    let from = this.$route.query.from
    if (from) {
      this.$store.commit('setFrom', from)
    }
    smoothscroll.polyfill()
  }

}
</script>
<style lang="scss">
@import '~@/assets/sass/base.scss';
@import '~@/assets/sass/common.scss';
@import '~@/assets/sass/cover.scss';
#app {
  width: 100%;
  height: 100%;
  overflow: auto;
  color: $color-text;
}
</style>
