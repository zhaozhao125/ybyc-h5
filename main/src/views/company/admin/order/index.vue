<template>
  <div class="company-order bg-light">
    <div class="order-container flex-col height-100">
      <order-list></order-list>
    </div>
  </div>
</template>

<script>
import orderList from '@/components/order-list/'
export default {
  components: {
    orderList
  },

  data() {
    return {}
  }
}
</script>

<style lang="scss">
</style>
