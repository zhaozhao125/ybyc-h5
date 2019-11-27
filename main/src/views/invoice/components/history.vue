<template>
  <div class="invoice-history">
    <!-- 发票内容 -->
    <div ref="wrapper">
      <div v-if="records.length" v-infinite-scroll="loadMore" :style="{paddingBottom:showBottomLoading?0:4+'vw'}" ref="wrapperContent" :infinite-scroll-disabled="infiniteScrollDisabled" infinite-scroll-distance="10" infinite-scroll-immediate-check>
        <div class="history-item" v-for='(item,index) in records' :key="index" @click='jumpDetailPage(item.sn)'>
          <!-- 上部 -->
          <div class="up">
            <div>
              <img src="./../img/order.png">
              <span>{{item.applyTime|getFormatDate}}</span>
            </div>
            <div>
              <span>{{item.status=='pending'?'待处理':'已处理'}}</span>
              <img src="./../img/arrow.png" class="arrow">
            </div>
          </div>
          <!-- 下部 -->
          <div class="down">
            <div>
              <span>{{item.type=='electronic'?'电子':'纸质'}}发票</span>
              <span>{{handleOrderType(item.orderType)}}订单</span>
            </div>
            <span class="money">{{item.money.toFixed(2)}}</span>
          </div>
        </div>
        <div v-if="showBottomLoading" class="loading">
          <mt-spinner type="fading-circle" :size="20"></mt-spinner>
          <span>努力加载中...</span>
        </div>
      </div>
      <div class="no-order" v-if="!records.length&&isShowData">
        <img src="./../img/no-data.png" alt="">
        <span>还没有开票记录哦~</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mixinFilter, mixinLoadMore } from './../mixin/mixin'
export default {
  name: 'invoiceHistory',
  mixins: [mixinFilter, mixinLoadMore],
  data() {
    return {
      records: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.request()
    })
  },
  methods: {
    request(showLoading) {
      this.$service.invoiceHistory(this.pageNo, this.pageSize, showLoading).then(res => {
        let data = res.data.data
        this.totalPages = data.totalPages
        this.isShowData = true
        this._getResult(data.records)
      }).catch(err => {

      })
    },
    /**
   * 处理数据
   */
    _getResult(data) {
      if (!this.isEmpty) {
        Array.prototype.push.apply(this.records, data)
      } else {
        this.records = data
        this.isEmpty = false
      }
      if (!this.records || this.pageNo >= this.totalPages) {
        this.infiniteScrollDisabled = true
        this.showBottomLoading = false
      } else {
        this.infiniteScrollDisabled = false
        this.showBottomLoading = true
      }
      this.pageNo++
    },
    jumpDetailPage(sn) {
      this.$service.invoiceDetail(sn).then(res => {
        this.$router.push({
          name: 'invoiceDetail',
          params: res.data.data
        })
      })
    },
    handleOrderType(type) {
      switch (type) {
        case 'timeShareRent':
          return '分时'
        case 'shortRent':
          return '短租'
        case 'longTermRent':
          return '长租'
        case 'chargingPile':
          return '充电'
      }
    }
  }
}
</script>

<style lang='scss'>
@import './../style/no-data.scss';
.invoice-history {
  .loading {
    text-align: center;
    width: 100%;
    color: #7c7c7c;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: vw(10) 0;
  }
  background: #f9f9f9;
  width: 100%;
  .history-item {
    font-size: vw(13);
    color: #7c7c7c;
    width: vw(355);
    margin: vw(10) auto 0 auto;
    padding: vw(15) vw(20);
    background: #ffffff;
    box-shadow: 0 0 vw(4) 0 rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .up {
      display: flex;
      align-items: center;
      justify-content: space-between;
      > div {
        display: flex;
        justify-content: space-between;
        * {
          margin: auto;
        }
        img {
          width: 13px;
          height: 13px;
          margin-right: vw(12);
        }
        .arrow {
          width: vw(18);
          height: vw(18);
          margin-right: 0;
        }
      }
    }
    .down {
      margin-top: vw(12);
      display: flex;
      align-items: center;
      justify-content: space-between;
      > div {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        span {
          &:first-child {
            margin-bottom: vw(5);
          }
        }
      }
      .money {
        font-size: vw(22);
        color: #3d3d3d;
        &::after {
          content: '元';
          font-size: vw(13);
          color: #7c7c7c;
        }
      }
    }
  }
}
</style>
