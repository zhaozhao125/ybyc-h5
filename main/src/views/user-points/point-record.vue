<template>
  <div class="point-record bg-light">
    <!-- <section class="point-statistics">
      <header>
        <div class="header-title">
          <img src="./img/icon-statistics.png" alt="">
          <h3>我的积分统计</h3>
        </div>
        <img class="share" src="./img/share-dark.png" alt="">
      </header>
      <div class="content flex-row">
        <div class="left-part flex-1 text-center">
          <p class="fz-22 color-dark">1000</p>
          <p class="fz-12 color-gray">积分收入</p>
        </div>
        <div class="right-part flex-1 text-center">
          <p class="fz-22 color-dark">512</p>
          <p class="fz-12 color-gray">积分支出</p>
        </div>
      </div>
    </section> -->
    <section class="point-detail" v-infinite-scroll="loadMore" infinite-scroll-disabled="infiniteScrollDisabled" infinite-scroll-distance="10">
      <header>
        <div class="header-title">
          <img src="./img/icon-detail.png" alt="">
          <h3>积分收支明细</h3>
        </div>
        <drop-down :listName="selectList" @command="handleChangeRange">
          <span class="fz-14 color-gray">{{currentSelect}}</span>
        </drop-down>
      </header>
      <ul>
        <li v-for="(item, index) in dataList" :key="index">
          <div class="list-item">
            <div class="item-left">
              <div>{{item.actionName}}</div>
              <p>{{item.createdTime | timeFilter}}</p>
            </div>
            <div class="item-right positive" v-if="item.incDecType=='INC'">
              +{{item.scoreChange}}
            </div>
            <div class="item-right" v-else>
              -{{item.scoreChange}}
            </div>
          </div>
        </li>
      </ul>
      <div class="common-loading" v-show="!allLoaded">
        <mt-spinner type="snake"></mt-spinner>
      </div>
    </section>
  </div>
</template>

<script>
import dropDown from '@/components/drop-down'
import { formatDate } from '@/util/common'
export default {
  components: {
    dropDown
  },
  data() {
    return {
      selectList: ['全部', '收入', '支出'],
      currentSelect: '全部',
      dataList: [], // new Array(15).fill(1),
      page: 1,
      loading: false,
      allLoaded: false,
      type: '' // 收入（INC）还是支出（DEC）
    }
  },

  computed: {
    infiniteScrollDisabled() {
      return this.loading || this.allLoaded
    }
  },

  mounted() {
    this.$track('h5UserPointsRecordPageOpen')
  },

  filters: {
    timeFilter(val) {
      return formatDate(val)
    }
  },

  methods: {
    handleChangeRange(command) {
      console.log('====command====', command)
      this.currentSelect = this.selectList[command]
      switch (command) {
        case 1:
          this.type = 'INC'
          break
        case 2:
          this.type = 'DEC'
          break
        default:
          this.type = ''
          break
      }
      this.page = 1
      this.allLoaded = false
      this.dataList = []
      this.loadMore()
    },
    loadMore() {
      this.loading = true
      this.$service.getUserPointsDetail(this.page, this.type).then(res => {
        console.log('====res====', res)
        let result = res.data.data
        this.dataList = this.dataList.concat(result.records)
        if (result.totalPages <= this.page) {
          this.allLoaded = true
        } else {
          this.page++
        }
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
.point-record {
  .point-statistics {
    .share {
      width: px2vw(24);
    }
    .content {
      padding: 4.5vw 0;
      .left-part {
        border-right: 1px solid #e7e7e7;
      }
    }
  }
  .point-detail {
    li {
      width: 91.5%;
      margin: auto;
    }
    .list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .item-left {
        div {
          font-size: px2vw(14);
        }
        p {
          font-size: px2vw(12);
        }
      }
      .item-right {
        font-size: px2vw(16);
        &.positive {
          color: #fdc600;
        }
      }
    }
  }
}
</style>
