<template>
  <div class="three-orders">
    <img src="./img/banner.png" alt="" class="top-banner">
    <div class="order-line">
      <div class="car">
        <img src="./img/car.png" alt="" :style="`left: ${14.2857 * lastIndex}%`">
      </div>
      <div class="line-container">
        <div class="circle" :class="{active: weekData[index].color}" v-for="(item, index) in 7" :key="item"></div>
        <div class="red-line"></div>
      </div>
      <div class="weeks">
        <p v-for="(item, index) in 7" :key="item">{{getWeekDay(index)}}</p>
      </div>
    </div>
    <div class="yellow-btn" @click="handleClickBtn">
      <span v-if="alreadyGet">本周已领50元，下周继续噢</span>
      <span v-else-if="canGet">已完成任务，点此立领50元</span>
      <span v-else>还差{{orderNum}}单噢，继续加油</span>
    </div>
    <a href="#" class="share-btn" @click.prevent="handleShare">分享活动</a>
    <div class="rule">
      <h3>活动规则</h3>
      <ul>
        <li>每单需有效行驶20分钟以上；</li>
        <li>若出现跨周，以订单支付时间所在周为准；</li>
        <li>若一天内多次用车，仅计作1单；</li>
        <li>满足活动条件后，需在活动页面手动点击领取优惠券，每周一清空上周用车次数；</li>
        <li>活动入口：订单支付完成后的活动页面，以及App首页顶部广告条等；</li>
        <li>活动日期 6.19-8.31。</li>
      </ul>
    </div>
  </div>
</template>

<script>
const WEEK = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
export default {
  data() {
    return {
      weekData: [
        { user_car_day: '2018-06-11', user_car_day_cn: '周一', color: false },
        { user_car_day: '2018-06-12', user_car_day_cn: '周二', color: false },
        { user_car_day: '2018-06-13', user_car_day_cn: '周三', color: false },
        { user_car_day: '2018-06-14', user_car_day_cn: '周四', color: false },
        { user_car_day: '2018-06-15', user_car_day_cn: '周五', color: false },
        { user_car_day: '2018-06-16', user_car_day_cn: '周六', color: false },
        { user_car_day: '2018-06-17', user_car_day_cn: '周日', color: false }
      ],
      // 已经领过了
      alreadyGet: false,
      canGet: false,
      orderNum: '-',
      lastIndex: 0
    }
  },

  created() {
    this.fetchData()
    this.$track('activityThreeOrdersPageOpen')
  },

  methods: {
    fetchData() {
      this.$fetch('/v26/order-coupons/get-week-data').then(res => {
        console.log('====res====', res)
        if (res.data.errCode == 0) {
          let result = res.data.data
          // test
          // result.total = 3
          // test
          this.weekData = result.data
          let lastIndex = 0
          this.weekData.forEach((item, index) => {
            if (item.color) {
              lastIndex = index
            }
          })
          this.lastIndex = lastIndex
          console.log('====lastIndex====', lastIndex)
          if (result.weekSendFlag) {
            this.alreadyGet = true
          } else if (result.total >= 3) {
            this.canGet = true
          } else {
            this.orderNum = 3 - result.total
          }
        }
      })
    },
    getWeekDay(day) {
      return WEEK[day]
    },
    handleClickBtn() {
      if (this.canGet) {
        this.$fetch('/v26/order-coupons/send-user-coupons').then(res => {
          console.log('====res====', res)
          if (res.data.errCode == 0) {
            this.$toast('领取成功')
            this.fetchData()
            this.$track('activityThreeOrdersCouponsSuccess')
          }
        })
      }
    },
    handleShare() {
      this.$bridge.callHandler('callShare', {
        url: 'https://h5.1byongche.com/app/share-pages/three-orders-share/',
        shareTitle: '来领50元优惠券',
        shareContent: '每周开3单，立领50元优惠券',
        shareImg: 'https://h5.1byongche.com/static/img/logo.png'
      })
    }
  }
}
</script>

<style lang="scss">
.three-orders {
  .top-banner {
    width: 100%;
  }
  .order-line {
    width: 90%;
    margin: 10vw auto 8vw;
  }
  .line-container,
  .weeks {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .car {
    img {
      width: px2vw(66);
      position: relative;
      transform: translateX(-12%);
    }
  }
  .line-container {
    position: relative;
    .red-line {
      position: absolute;
      width: 100%;
      height: 1px;
      left: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      background-color: #ff8f1b;
    }
    .circle {
      width: px2vw(10);
      height: px2vw(10);
      border-radius: 50%;
      background-image: linear-gradient(-180deg, #e0e0e0 0%, #cccccc 100%);
      position: relative;
      z-index: 9;
      &.active {
        width: px2vw(18);
        height: px2vw(18);
        background-image: linear-gradient(-180deg, #ffea00 0%, #fdd000 100%);
        border: 1px solid #ffffff;
      }
    }
  }
  .weeks {
    margin-top: 3vw;
    p {
      font-size: px2vw(14);
      color: #3d3d3d;
    }
  }
  .yellow-btn {
    background-image: linear-gradient(-180deg, #fdd000 0%, #ebc100 100%);
    border-radius: px2vw(100);
    line-height: px2vw(50);
    text-align: center;
    width: 80%;
    margin: 0 auto;
    border-bottom: 1vw solid #ece0ba;
    box-shadow: 0 px2vw(2) px2vw(4) 0 rgba(138, 104, 51, 0.5);
    font-size: px2vw(18);
    color: #ffffff;
  }
  .rule {
    color: #3d3d3d;
    line-height: px2vw(22);
    width: 90%;
    margin: 5vw auto;
    h3 {
      font-size: px2vw(16);
    }
    ul {
      padding-left: 4vw;
      font-size: px2vw(12);
      list-style: decimal;
    }
  }
  .share-btn {
    text-decoration: underline;
    font-size: 16px;
    color: #3d3d3d;
    display: block;
    text-align: center;
    line-height: 14vw;
  }
}
</style>
