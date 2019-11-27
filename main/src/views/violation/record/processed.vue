<template>
  <div class="violation-processed">
    <violation-list status="finish"></violation-list>
  </div>
</template>

<script>
import violationList from './components/violation-list'
import { disableScrollBounce } from '@/util/dom.js'
export default {
  components: {
    violationList
  },

  data() {
    return {}
  },

  mounted() {
    disableScrollBounce(this.$el)
  }
}
</script>

<style lang="scss">
</style>
