<template>
  <div class="red-packet-details">
    <ul class="detail-list margin-auto" v-infinite-scroll="loadData" :infinite-scroll-disabled="loading || loadFinished" :infinite-scroll-distance="10">
      <li v-for="(item, index) in detailData" :key="index">
        <div class="detail-item flex-row align-items-center justify-content-between">
          <div class="left-title">
            <p class="detail-title fz-18 color-dark">{{item.actionCodeText}}</p>
            <p class="detail-date fz-14">{{item.addTime | timeFilter}}</p>
          </div>
          <div class="right-money fz-18" :class="{'color-yellow':item.amount>0}">
            <span>{{item.amount | moneyFilter}}</span>
          </div>
        </div>
      </li>
    </ul>
    <div class="detail-loading flex-row justify-content-center align-items-center text-center">
      <mt-spinner type="snake" v-if="!loadFinished"></mt-spinner>
      <p v-else>
        <span v-if="detailData && detailData.length>pageSize">加载完毕</span>
        <span v-else-if="!detailData.length">无明细数据</span>
      </p>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/util/common'
export default {
  data() {
    return {
      page: 1,
      pageSize: 20,
      loading: false,
      loadFinished: false,
      detailData: []
    }
  },

  mounted() {
    // this.loadData()
  },

  filters: {
    timeFilter(val) {
      return formatDate(val)
    },
    moneyFilter(val) {
      if (val === 0) {
        return '0.00'
      }
      let arr = String(val).split('.')
      if (val > 0) {
        arr[0] = '+' + arr[0]
      }
      if (arr.length === 1) {
        return arr[0] + '.00'
      }
      if (arr[1].length === 1) {
        return arr.join('.') + '0'
      }
      return arr.join('.')
    }
  },

  methods: {
    loadData() {
      if (this.loadFinished) {
        return
      }
      this.loading = true
      this.$service
        .getRedPacketDetail(this.$store.getters.user.id, this.page++, this.pageSize)
        .then(res => {
          this.loading = false
          let result = res.data.data.rows
          if (!result || result.length < this.pageSize) {
            this.loadFinished = true
          }
          result.forEach(item => {
            this.detailData.push(item)
          })
          // this.detailData = res.data.data.rows
        })
        .catch(err => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss">
.red-packet-details {
  .detail-list {
    width: 95%;
    li {
      border-bottom: 1px solid $color-gray-border;
      &:last-of-type {
        border: 0;
      }
    }
    .detail-item {
      height: 20vw;
    }
  }
  .detail-loading {
    padding: 3vw 0 5vw;
  }
}
</style>
