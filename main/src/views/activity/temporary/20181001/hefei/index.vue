<template>
  <div class="guoqing-2018 guoqing-hefei text-center">
    <div class="main-content overflow-hidden" v-if="!success">
      <h2 class="fz-18">赏月团圆会亲友，自由出行黄金周</h2>
      <h3 class="fz-40">7天租低至399元</h3>
      <!-- <h4 class="fz-14 bg-yellow">租车还送60元充电券，4000 根充电桩，充电便捷</h4> -->
      <mt-button type="default" @click="handleGetCoupon">领券用车，7天低至399</mt-button>
      <a href="#" @click.prevent="ruleVisible=true" class="detail-rule fz-14 text-decoration-underline">详细规则</a>
    </div>
    <div class="success-page overflow-hidden" v-if="success">
      <h3 class="fz-24">已发放短租优惠券
        <span>3张</span>
      </h3>
      <div class="coupon position-relative">
        <img src="../img/coupon.png" alt="" class="width-100">
        <span class="position-absolute">91</span>
      </div>
      <p class="copy1 fz-12 color-gray">节假日期间车辆紧缺，心动就赶紧提前预定吧，手慢就没有了哦~</p>
      <div class="tips fz-14">
        <div class="tips-title bg-yellow">用车小贴士</div>
        <ul>
          <li>1.点击首页顶部“短/长租”标签</li>
          <li>2.选择取还网点、取还时间、车型</li>
          <li>3.确认订单时选择优惠券</li>
          <li>4.支付订单费用，开始用车</li>
        </ul>
      </div>
      <p class="copy2 fz-14 color-gray">短租用车如需帮助可拨打客服电话4001111818</p>
    </div>
    <div class="rules position-fixed fullscreen flex-col align-items-center justify-content-center" v-show="ruleVisible">
      <div class="mask position-fixed fullscreen" @click="ruleVisible=false"></div>
      <div class="rule-container position-relative zindex-99 bg-white">
        <header class="bg-dark color-yellow fz-18">详细规则</header>
        <ul class="fz-16 text-left">
          <li>1.点击领取3张91元优惠券。</li>
          <li>2.每张优惠券满490可用，不限车型，江淮7天短租低至399元。</li>
          <li>3.优惠券使用期2018.9.20-2018.10.8。</li>
          <li>4.领券活动有效期2018.9.20-2018.10.8。</li>
          <li>5.本活动仅限合肥地区。</li>
        </ul>
      </div>
      <img src="@/assets/img/close.png" alt="" class="close-rule positive-relative zindex-99" @click="ruleVisible=false">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleVisible: false,
      success: false
    }
  },

  mounted() {
    this.$track('h5Activity20181001hfPageOpen')
  },

  methods: {
    handleGetCoupon() {
      let user = this.$store.getters.user
      if (!user || !user.id) {
        this.$toast('请登录后再领取')
        return
      }
      this.$fetch('/php-service/activity/simple/mid-autumn-activity/anhui', {
        user_phone: user.phone
      }).then(res => {
        console.log('====res====', res)
        this.success = true
      })
    }
  }
}
</script>

<style lang="scss">
.guoqing-hefei {
  .main-content {
    min-height: 100%;
    background-image: url('../img/bg-hf.png');
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: 0 16vw;
    h2 {
      margin-top: 7.5vw;
    }
    h3 {
      margin-top: 2vw;
    }
    h4 {
      width: 89.5%;
      margin: 3vw auto 0;
      border: 1px solid #3d3d3d;
      border-radius: 100px;
      padding: 1.5vw 0;
    }
    button {
      margin-top: 101vw;
      width: 86%;
      background-image: linear-gradient(-180deg, #3d3d3d 0%, #181818 100%);
      height: px2vw(49);
    }
    a {
      margin-top: 5vw;
      display: block;
      color: #6a9be4;
    }
  }

  .success-page {
    h3 {
      margin-top: 10vw;
      span {
        color: red;
      }
    }
    .coupon {
      width: 61%;
      margin: 3.5vw auto 0;
      span {
        font-size: px2vw(37);
        color: #fff6cc;
        left: 33%;
        top: 38%;
      }
    }
    .copy1 {
      margin-top: 6vw;
    }
    .tips {
      margin-top: 15vw;
      .tips-title {
        display: inline-block;
        line-height: 27px;
        width: 108px;
        border-radius: 100px;
        border: 1px solid #3d3d3d;
      }
      ul{
        margin-top: 4vw;
      }
      li{
        margin-bottom: 1vw;
      }
    }
    .copy2{
      margin-top: 12vw;
    }
  }

  .rules {
    .mask {
      background: rgba(135, 135, 135, 0.6);
    }
    .rule-container {
      width: 77%;
      header {
        line-height: px2vw(64);
      }
      ul {
        padding: 5vw;
      }
      li{
        margin-bottom: 1vw;
      }
    }
    .close-rule {
      width: px2vw(50);
      height: px2vw(50);
      padding: px2vw(12);
      margin-top: 3vw;
    }
  }
}
</style>
