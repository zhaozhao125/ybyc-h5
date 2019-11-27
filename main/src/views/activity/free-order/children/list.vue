<template>
  <div class="free-order-list">
    <ul v-if="freeOrderList&&freeOrderList.length">
      <li v-for="(item, index) in freeOrderList" :key="index">
        <div class="free-order-item bg-white">
          <div class="item-top">
            <h3 class="fz-18">{{item.amount}}元免单红包</h3>
            <p class="fz-14 color-dark">好友已帮你免了{{item.free_activity_consume}}元，还剩{{item.left_amount}}元</p>
          </div>
          <div class="item-bottom flex-row justify-content-between align-items-center">
            <p class="fz-14 color-gray">
              <span v-if="item.free_activity_status=='finished'||item.free_activity_status=='finshed'">免单成功</span>
              <span v-else-if="item.free_activity_status=='start'">距活动结束还剩：{{item.leftTime|leftTimeFilter}}</span>
            </p>
            <button class="plain-button color-dark fz-14" @click="$router.push({name: 'freeOrder', query: {orderSn: item.order_sn}})">
              <span v-if="item.free_activity_status=='finished'||item.free_activity_status=='finshed'">领取红包</span>
              <span v-else>我要免单</span>
            </button>
          </div>
        </div>
      </li>
    </ul>
    <p v-else class="fz-14 text-center" style="margin-top:10vw">暂无数据</p>
  </div>
</template>

<script>
function addZero(val) {
  if (String(val).length == 1) {
    return '0' + val
  }
  return val
}
export default {
  data() {
    return {
      freeOrderList: []
    }
  },

  created() {
    this.$fetch('/v26/free-order-activity/free-order-activity-list').then(
      res => {
        console.log('====res====', res)
        this.freeOrderList = res.data.data
      }
    )
  },

  methods: {},

  filters: {
    leftTimeFilter(val) {
      return `${addZero(
        Math.floor(val / 3600) % 60
      )}小时${addZero(Math.floor(val / 60) % 60)}分钟`
    }
  }
}
</script>

<style lang="scss">
.free-order-list {
  background-color: #f7f7f7;
  li {
    margin-bottom: 3vw;
  }
  .free-order-item {
    .item-top {
      padding: 4vw;
      border-bottom: 1px solid #efefef;
      h3 {
        margin-bottom: 1vw;
      }
    }
    .item-bottom {
      padding: 3vw 4vw;
      button {
        background-image: linear-gradient(-202deg, #ffea00 0%, #fdd000 96%);
        border-radius: 2px;
        width: px2vw(93);
        height: px2vw(32);
      }
    }
  }
}
</style>
