<template>
  <div id="un-used">
    <!-- 滚动组件开始 -->
    <!-- 滚动的容器是app -->
    <div v-infinite-scroll="loadMore" :infinite-scroll-disabled="infiniteScrollDisabled" infinite-scroll-distance="10" id="couponblock">
      <div>
        <coupon :coupondata="resultData" ref="couponBlock"></coupon>
        <div v-show="resultData.length&&nocoupon">
          <no-coupon></no-coupon>
        </div>
      </div>
      <div v-show="showBottomLoading" class="loading">
        <mt-spinner type="fading-circle" :size="20"></mt-spinner>
        <span>努力加载中...</span>
      </div>
    </div>
    <!-- 滚动组件结束-->
    <!-- 暂无数据 -->
    <div v-show="!resultData.length&&noData">
      <no-data nodata="您暂时还没有卡券哦~" style="margin-top:40vw;"></no-data>
    </div>
  </div>
</template>
<script>
import coupon from './base/coupon' // 卡券组件
import noCoupon from './base/no-coupon'
import noData from './base/no-data' // 暂无数据
import { publicjs } from './../mixin/mixin'
import { Toast } from 'mint-ui'
export default {
  name: 'UnUsed',
  mixins: [publicjs],
  data() {
    return {
      couponType: 0 // 卡券类型
    }
  },
  methods: {
    clear_data() {
      // 外部调用清空状态
      this.params.pageNo = 1
      this.isEmpty = true
      Toast({
        message: '兑换成功',
        duration: 2000
      })
      // setTimeout(() => {
      this.request()
      // }, 100)
    }
  },
  components: {
    coupon,
    noCoupon,
    noData
  }
}
</script>

<style lang="scss" scoped>
@import '~@/views/coupon/style/public-loading.scss';
#un-used {
  margin-top: 30.37vw;
}
</style>
