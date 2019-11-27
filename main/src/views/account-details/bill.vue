<template>
  <div class="account-detail">
    <!-- 滚动组件 开始-->
    <div :style="{ height: wrapperHeight + 'px' }" ref="wrapper">
      <div v-infinite-scroll="loadMore" infinite-scroll-disabled="infiniteScrollDisabled" infinite-scroll-distance="10" infinite-scroll-immediate-check="true">
        <div class="bill-block border-1px" v-for="item in result" :key="item.accountRecordId" @click="jumpDetail(item)">
          <div class="bill-left">
            <span class="car-type">{{item.typeText+'-'+item.actionCodeText}}</span>
            <div>
              <span class="time">{{item.addTime}}</span>
            </div>
          </div>
          <div :class="[item.actionIncDecType==='INC' ?  'bill-right-yellow' : 'bill-right-black']" class="money">
            {{ item.actionIncDecType==="INC" ? `+${item.amount}` : `${item.amount}`}}
          </div>
        </div>
        <div v-show="showBottomLoading" class="loading">
          <mt-spinner type="fading-circle" :size="20"></mt-spinner>
          <span>加载中...</span>
        </div>
        <div class="no-coupon" v-show="result.length&&nocoupon">我是有底线的哦~</div>
      </div>
      <!-- 暂无数据 开始-->
      <div v-show="!result.length&&noData" class="no-result">
        <img src="@/assets/img/nodata@2x.png" alt="暂无数据">
        <span>您暂时还没有收支明细</span>
      </div>
      <!-- 暂无数据结束 -->
    </div>
    <!-- 滚动组件结束 -->
  </div>
</template>
<script>
import { MessageBox } from 'mint-ui'

export default {
  name: 'app',
  data() {
    return {
      result: [], // 返回数据
      noData: false, // 暂无数据
      nocoupon: false, // 没有更多优惠券
      userId: '',
      page: 1, // 初始页数
      pageNo: 1, // 当前页数
      pageSize: 10, // 当前数量
      totalSize: 0, // 总条数数
      noCoupo: false,
      infiniteScrollDisabled: true, // 是否加载到底部
      showBottomLoading: false,
      isEmpty: true, // 加载数据标志位
      wrapperHeight: 0,
      user: null
    }
  },
  mounted() {
    setTimeout(() => {
      this.wrapperHeight =
        document.documentElement.clientHeight -
        this.$refs.wrapper.getBoundingClientRect().top
      // 获取bridge
      this.userId = this.$store.getters.user.id
      this.request()
    }, 20)
  },
  methods: {
    // 收支详情跳转
    jumpDetail(item) {
      this.$router.push({
        name: 'expense-detail',
        query: {
          userId: item.userId,
          id: item.accountRecordId
        }
      })
    },
    loadMore() {
      this.request()
      this.infiniteScrollDisabled = true
    },
    // 请求数据
    request() {
      this.$service.getExpenseRecord(this.userId, this.pageNo, this.pageSize).then(res => {
        if (res.data.errCode == 0) {
          this.totalSize = res.data.data.total
          this._genResult(res.data.data.rows)
        } else {
          let errMsg = res.data.errMsg || '请求错误'
          MessageBox('提示', errMsg)
        }
      })
        .catch(error => {
          console.log(error)
        })
        .then(res => {
          this.noData = true // 显示暂无数据
        })
    },
    // 处理数据
    _genResult(list) {
      const arr = []
      list.forEach((item, index) => {
        const element = {
          typeText: item.typeText,
          userId: item.userId, // 用户名
          accountRecordId: item.accountRecordId, // 收支明细id
          addTime: item.addTime, // 时间
          actionCodeText: item.actionCodeText, // 账户类型
          addTimeStr: item.addTimeStr, // 时间
          amount: item.amount.toFixed(2), // 金钱
          actionIncDecType: item.actionIncDecType // 区分颜色和金钱的正负
        }
        arr.push(element)
      })
      if (!this.isEmpty) {
        this.result = this.result.concat(arr)
      } else {
        this.result = arr
        this.isEmpty = false
      }
      if (!this.result || this.pageSize * this.pageNo >= this.totalSize) {
        this.nocoupon = true
        this.infiniteScrollDisabled = true
        this.showBottomLoading = false
      } else {
        this.infiniteScrollDisabled = false
        this.showBottomLoading = true
      }
      this.pageNo++
    }
  }
}
</script>
<style lang='scss'>
@import './../../assets/sass/account-detail.scss';
</style>
