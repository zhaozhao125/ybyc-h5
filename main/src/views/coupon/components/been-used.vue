<template>
  <div id="been-used">
    <!-- 滚动组件 -->
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="infiniteScrollDisabled" infinite-scroll-distance="10">
      <div class="coupon-block">
        <coupon :coupondata="resultData" ref="coupon" :coupontype="2" fontcolor="color: #D6D6D6"></coupon>
        <div v-show="resultData.length&&nocoupon">
          <no-coupon></no-coupon>
        </div>
      </div>
      <div v-show="showBottomLoading" class="loading">
        <mt-spinner type="fading-circle" :size="20"></mt-spinner>
        <span>努力加载中...</span>
      </div>
    </div>
    <!-- 暂无数据 -->
    <div v-show="!resultData.length&&noData">
      <no-data nodata="您暂时还没有已使用的卡券哦~"></no-data>
    </div>
  </div>
</template>

<script>
import coupon from './base/coupon' // 卡券组件
import noCoupon from './base/no-coupon'
import noData from './base/no-data' // 暂无数据
import { publicjs } from './../mixin/mixin'
export default {
  name: 'NullBrace',
  mixins: [publicjs],
  data() {
    return {
      couponType: 1
    }
  },
  methods: {},
  components: {
    coupon,
    noCoupon,
    noData
  }
}
</script>

<style lang="scss" scoped>
@import '~@/views/coupon/style/public-loading.scss';
@import '~@/views/coupon/style/coupon-top.scss';
</style>
