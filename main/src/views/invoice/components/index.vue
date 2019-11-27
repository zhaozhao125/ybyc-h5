<template>
  <div class="invoice-index">
    <cell-item title='分时订单' addBorderBottom :fontSize='fontSize' @jumpPage="jumpInfo('timeShareRent')"></cell-item>
    <cell-item title='短租订单' addBorderBottom :fontSize='fontSize' @jumpPage="jumpInfo('shortRent')"></cell-item>
    <cell-item title='长租订单' addBorderBottom :fontSize='fontSize' @jumpPage="jumpInfo('longTermRent')"></cell-item>
    <!-- <cell-item title='充电订单' addBorderBottom :fontSize='fontSize' @jumpPage="jumpInfo('chargingPile')"></cell-item> -->
    <cell-item title='开票历史' addBorderBottom style="margin-top:3.2vw" :fontSize='fontSize' @jumpPage="jumpHistory"></cell-item>
    <cell-item title='开票规则' :fontSize='fontSize' @jumpPage="jumpRule()"></cell-item>
  </div>
</template>
<script>
import cellItem from '@/components/cell/cell'
export default {
  name: 'invoiceIndex',
  components: {
    cellItem
  },
  data() {
    return {
      fontSize: '4.27'
    }
  },
  methods: {
    /**
     * 跳转到发票信息页面
     */
    jumpInfo(orderType) {
      this.$router.push({
        name: 'invoiceInfo',
        query: {
          orderType
        }
      })
    },
    jumpRule() {
      this.$router.push({
        name: 'invoiceRule'
      })
    },
    /**
   * 跳转到历史信息页面
   */
    jumpHistory() {
      this.$router.push({
        name: 'invoiceHistory'
      })
    }
  }
}
</script>
<style lang="scss">
.invoice-index {
  padding-top: 2.8vw;
  background-color: #f9f9f9;
}
</style>
