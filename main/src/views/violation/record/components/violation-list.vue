<template>
  <div class="violation-list">
    <div class="no-data text-center"
         v-if="dataList && !dataList.length">
      <img src="@/views/violation/img/no-data.png"
           alt=""
           class="mb-2">
      <p class="fz-14 color-gray-white">
        <span v-if="status=='dealing'">暂无违章记录<br>继续保持好习惯</span>
        <span v-else>暂无记录</span>
      </p>
    </div>
    <ul v-infinite-scroll="loadMore"
        infinite-scroll-disabled="infiniteScrollDisabled"
        infinite-scroll-distance="10">
      <li v-for="(item, index) in dataList"
          :key="index"
          @click="handleGoToDetail(item)">
        <div class="item-title mb-1">
          <strong class="car-number fz-18 font-weight-normal">{{item.carNumber}}</strong>
          <span class="item-info fz-11 ml-1">
            <span>罚款：{{item.carViolationInfo.price}}元</span>
            <span v-if="item.carViolationInfo.score>0">记分：{{item.carViolationInfo.score}}分</span>
          </span>
        </div>
        <div class="item-content">
          <p>时间：{{item.carViolationInfo.time}}</p>
          <p>地点：{{item.carViolationInfo.address}}</p>
          <p>行为：{{item.carViolationInfo.content}}</p>
        </div>
        <div class="remain-days fz-14 mt-2 pt-2"
             v-if="status=='dealing' && item.dealStatusVal == 'create'">
          剩余处理日期：
          <span v-if="item.remainDays>0">{{item.remainDays}}天</span>
          <span v-else>已逾期</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      // 待处理-dealing 已处理-finish
      type: String,
      required: true,
      validator: function(value) {
        return ['dealing', 'finish'].indexOf(value) !== -1
      }
    }
  },

  data() {
    return {
      page: 1,
      loading: false,
      allLoaded: false,
      dataList: null
    }
  },

  computed: {
    infiniteScrollDisabled() {
      return this.loading || this.allLoaded
    }
  },

  mounted() {
    console.log('====router====', this.$router)
  },

  methods: {
    loadMore() {
      this.loading = true
      this.$service
        .getViolationList(this.status, this.page)
        .then(res => {
          let result = res.data.data
          if (!this.dataList) {
            this.dataList = []
          }
          this.dataList.push(...result.records)
          if (result.totalPages <= this.page) {
            this.allLoaded = true
          } else {
            this.page++
          }
          this.loading = false
        })
        .catch(err => {
          this.loading = false
          this.allLoaded = true
        })
    },
    handleGoToDetail(item) {
      this.$router.push({
        name: 'violationDetail',
        params: {
          id: item.id
        }
      })
    }
  }
}
</script>

<style lang="scss">
.violation-list {
  padding: 2.7vw;
  .no-data {
    margin-top: 8vh;
    img {
      width: px2vw(80);
    }
  }
  li {
    box-shadow: 0 0 6px 0 rgba(216, 216, 216, 0.7);
    border-radius: px2vw(4);
    margin-bottom: 2.7vw;
    padding: 3vw 4vw;
  }
  .item-info {
    background: #ffeded;
    border-radius: px2vw(2);
    color: rgba(243, 20, 47, 0.6);
    padding: 1vw 0;
    span {
      padding: 0 1vw;
      display: inline-block;
      line-height: 3vw;
    }
    span:nth-of-type(even) {
      border-left: 1px solid rgba(243, 20, 47, 0.6);
    }
  }
  .item-content {
    p {
      font-size: px2vw(14);
      color: $color-dark;
      margin-bottom: 1vw;
    }
  }
  .remain-days {
    border-top: 1px solid #e6e6e6;
  }
}
</style>
