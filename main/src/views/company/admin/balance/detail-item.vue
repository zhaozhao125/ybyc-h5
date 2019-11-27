<template>
  <div class="company-detail-item">
    <div class="money-content">
      <span>金额</span>
      <span :class="[{'yellow':detailItemData.actionIncDecType==='INC'}]">{{detailItemData.actionIncDecType==='INC'?'+':''}}{{detailItemData.amount}}元</span>
    </div>
    <div class="item-content" v-for="item in arr" :key="item.recordSn">
      <span v-html="item.name"></span>
      <span v-html="item.content"></span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    detailItemData() {
      return this.$route.params.detailItemData
    },
    arr() {
      return [{
        name: '操作类型',
        content: this.detailItemData.actionCodeText
      }, {
        name: `时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间`,
        content: this.detailItemData.addTime
      }, {
        name: '流&nbsp;&nbsp;水&nbsp;&nbsp;号',
        content: this.detailItemData.recordSn
      }, {
        name: '凭&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;证',
        content: this.detailItemData.evidenceNote
      }]
    }
  }
}
</script>

<style lang="scss">
.company-detail-item {
  @function vw($px) {
    @return px2vw($px);
  }
  padding: 0 vw(10);
  .money-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: vw(77);
    border-bottom: 1px solid #e7e7e7;
    > span {
      font-size: vw(22);
      &:first-child {
        color: #999999;
      }
      &:last-child {
        font-weight: bold;
      }
    }
    .yellow {
      color: #fdd000;
    }
  }
  .item-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    > span {
      text-align: right;
      margin: vw(18.2) 0;
      font-size: 3.9vw;

      &:first-child {
        color: #999999;
      }
    }
  }
}
</style>
