<template>
  <div class="invoice-info">
    <!-- 发票内容 -->
    <div :style="{ height: wrapperHeight + 'vw' }" ref="wrapper" class="content">
      <div v-if="orderArr.length" v-infinite-scroll="loadMore" :infinite-scroll-disabled="infiniteScrollDisabled" infinite-scroll-distance="10" infinite-scroll-immediate-check>
        <!-- item -->
        <div class="item" @click="select(index,item)" v-for="(item,index) in orderArr" :key="index" :class="{'margin-bottom':index===orderArr.length-1}">
          <div class="item-1">
            <img src="./../img/xuanzhong.png" class="xuanzhong" v-if="item.isSelectItem">
            <span class="circle" v-else></span>
          </div>
          <div class="item-2">
            <div>
              <img src="./../img/order.png">
              <span>{{item.orderTime|getFormatDate}}</span>
            </div>
            <div>
              <img :src="imgUrl(item.orderType)">
              <span>{{item.startStation}}</span>
            </div>
            <div v-if="item.orderType!=='chargingPile'">
              <img src="./../img/huan.png">
              <span>{{item.endStation}}</span>
            </div>
          </div>
          <div class="item-3">{{item.invoiceMoney.toFixed(2)}}</div>
        </div>
        <span class="tip">2018年10月10号以前支付的订单请联系客服开票</span>
        <div v-if="showBottomLoading" class="loading">
          <mt-spinner type="fading-circle" :size="20"></mt-spinner>
          <span>努力加载中...</span>
        </div>
      </div>
      <div v-if="!orderArr.length&&isShowData" class="no-order">
        <img src="./../img/no-data.png">
        <span>暂无可开票的订单哦~</span>
      </div>
    </div>
    <!-- 底部固定 -->
    <footer class="bottom" v-if="orderArr.length">
      <span v-show="checkAmount">
        <i>{{checkAmount}}</i>个订单，共
        <i>{{handleTotalMoney}}</i>元</span>
      <div>
        <div>
          <div @click="checkAll">
            <img src="./../img/xuanzhong.png" class="xuanzhong" v-if="ischeckAll">
            <span class="circle" v-else></span>
          </div>
          <span class="tip">全选, 对开票金额有疑问</span>
          <img src="./../img/tishi.png" class="tishi" @click="openMessageBox" />
        </div>
        <button :class="{gray:!checkAmount}" @click="jumpApplyPage">下一步</button>
      </div>
    </footer>
  </div>
</template>
<script>
import { MessageBox } from 'mint-ui'
import { mixinFilter, mixinLoadMore } from './../mixin/mixin'
export default {
  name: 'invoiceInfo',
  mixins: [mixinFilter, mixinLoadMore],
  data() {
    return {
      ischeckAll: false,
      isSelectItem: false,
      checkAmount: 0, // 选中数量
      totalMoney: 0, // 订单金额
      orderType: '', // 订单类型
      orderArr: [],
      orderIds: [],
      wrapperHeight: 0,
      totalSize: 0 // 总条数数
    }
  },
  computed: {
    handleTotalMoney() {
      return this.totalMoney.toFixed(2)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.wrapperHeight = (document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top) / 3.75
      this.orderType = this.$route.query.orderType
      this.request(true)
    })
  },

  methods: {
    imgUrl(type) {
      return require(`./../img/${type !== 'chargingPile' ? 'qu' : 'zhan'}.png`)
    },
    /**
     * 数据请求
     */
    request(showLoading) {
      this.$service.enableInvoiceOrders(this.orderType, this.pageNo, this.pageSize, showLoading).then(res => {
        this.isShowData = true
        let data = res.data.data
        this.totalSize = data.totalElements
        this.totalPages = data.totalPages
        this._getResult(data.records)
      })
    },
    /**
     * 跳转
     */
    jumpApplyPage() {
      if (this.checkAmount) {
        this.$service.invoicePreview({
          orderIds: this.orderIds.join(','),
          orderType: this.orderType
        }).then(res => {
          this.$router.push({
            name: 'invoiceApply',
            params: res.data.data
          })
        })
      }
    },
    /**
     * 处理数据
     */
    _getResult(data) {
      data.forEach(item => {
        item.isSelectItem = this.ischeckAll
      })
      if (!this.isEmpty) {
        Array.prototype.push.apply(this.orderArr, data)
      } else {
        this.orderArr = data
        this.isEmpty = false
      }
      if (!this.orderArr || this.pageSize * this.pageNo >= this.totalSize) {
        this.infiniteScrollDisabled = true
        this.showBottomLoading = false
      } else {
        this.infiniteScrollDisabled = false

        this.showBottomLoading = true
      }
      this.pageNo++
    },
    /**
     * 处理选择数据
     */
    handleSelectData(data) {
      data.forEach(item => {
        item.isSelectItem = this.ischeckAll
        if (this.ischeckAll) {
          this.orderIds.push(item.id)
          this.checkAmount++
          this.totalMoney += item.invoiceMoney
        }
      })
    },
    /**
     * 选择订单
     */
    select(ind, data) {
      if (data.isSelectItem) {
        // 取消
        this.checkAmount--
        this.totalMoney -= data.invoiceMoney
        this.orderIds.splice(this.orderIds.indexOf(data.id), 1)
      } else {
        // 添加
        this.checkAmount++
        this.totalMoney += data.invoiceMoney
        this.orderIds.push(data.id)
      }
      this.orderArr.forEach((item, index) => {
        if (ind === index) {
          item.isSelectItem = !item.isSelectItem
        }
      })
    },
    /**
     * 全选
     */
    checkAll() {
      this.ischeckAll = !this.ischeckAll
      this.checkAmount = 0
      this.totalMoney = 0
      this.orderIds = []
      if (this.ischeckAll && this.orderArr.length !== this.totalSize) {
        this.$service.enableInvoiceOrders(this.orderType, 1, this.totalSize, true).then(res => {
          this.isShowData = true
          let data = res.data.data
          this.orderArr = data.records
          this.infiniteScrollDisabled = true
          this.showBottomLoading = false
          this.handleSelectData(this.orderArr)
        })
      } else {
        this.handleSelectData(this.orderArr)
      }
      console.log(this.orderIds, '=====id=======')
    },
    /**
     * 弹框
    */
    openMessageBox() {
      MessageBox({
        message: `仅第三方支付和充值余额支付的金额支持开发票；企业支付、赠送余额支付，出行卡支付部分不支持开发票`,
        confirmButtonText: '我知道了',
        showCancelButton: false
      })
    }
  },
  watch: {
    totalMoney() {
      this.ischeckAll = this.orderArr.length === this.checkAmount
    }
  }
}
</script>

<style lang='scss'>
@import './../style/no-data.scss';
.invoice-info {
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #f9f9f9;
  overflow: hidden;
  .circle {
    background: #ffffff;
    border-radius: 50%;
    height: vw(18);
    width: vw(18);
    border: 1px solid #c0c0c0;
    display: block;
  }
  .xuanzhong {
    height: vw(18);
    width: vw(18);
  }

  .content {
    .tip {
      width: 100%;
      font-size: 3.46667vw;
      color: #7c7c7c;
      display: inline-block;
      text-align: center;
      margin-bottom: vw(11);
    }
    flex: 1;
    overflow-y: scroll;
    width: vw(355.1);
    margin: 0 vw(10);
    .item {
      margin-top: vw(11);
      background-color: #ffffff;
      box-shadow: 0 0 vw(4) 0 rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      padding: vw(15);
      &.margin-bottom {
        margin-bottom: vw(11);
      }
      > div {
        margin-left: auto;
        margin-right: auto;
      }
      .item-2 {
        flex: 1;
        margin-left: vw(15);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
        height: 100%;
        > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          img {
            height: vw(12);
            width: vw(12);
            margin-right: vw(12);
          }
          span {
            flex: 1;
            line-height: vw(25);
            // line-height: vw(100);
            font-size: vw(13);
            color: #7c7c7c;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      .item-3 {
        font-size: vw(22);
        color: #3d3d3d;
        &::after {
          content: '元';
          font-size: vw(13);
          color: #7c7c7c;
        }
      }
    }
    .loading {
      text-align: center;
      width: 100%;
      color: #7c7c7c;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: vw(5);
    }
  }
  .bottom {
    width: 100%;
    background-color: #ffffff;
    > span {
      padding-left: vw(25);
      height: vw(30);
      line-height: vw(30);
      font-size: vw(12);
      width: 100%;
      display: block;
      border-top: 1px solid $color-button-white;
      i {
        font-style: normal;
        color: #f5a623;
      }
    }
    > div {
      display: flex;
      align-items: center;
      padding: vw(5.5) vw(10) vw(5.5) vw(25);
      justify-content: space-between;
      border-top: 1px solid $color-button-white;

      button {
        height: vw(44);
        width: vw(130);
        border: none;
        background: #3d3d3d;
        border-radius: vw(2);
        font-size: vw(16);
        color: #ffffff;
      }
      .gray {
        background-color: #c0c0c0;
      }
      > div {
        display: flex;
        align-items: center;
      }
      .tishi {
        width: vw(12);
        height: vw(12);
      }
      .tip {
        font-size: vw(13);
        color: #7c7c7c;
        margin-right: vw(7);
        margin-left: vw(15);
      }
    }
  }
}
</style>
