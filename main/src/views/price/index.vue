<template>
  <div class="car-price">
    <div class="car-info text-center overflow-hidden">
      <div class="car-bg position-absolute width-100 top-0 left-0"></div>
      <img v-if="carImg"
           :src="carImg"
           alt="car"
           class="car-img position-relative zindex-9 display-block">
      <div v-else
           class="img-place position-relative zindex-9 display-block"></div>
      <p class="fz-14 color-dark">{{carName}}
        <span class="dot">•</span> {{carSeat}}座</p>
    </div>
    <div class="price-rule width-90">
      <h2 class="text-center title-with-line color-gray">
        <span class="fz-12">计费标准</span>
      </h2>
      <ul class="fz-14 width-90 margin-auto">
        <li v-for="(item, index) in priceList"
            :key="index"
            class="mb-4">
          <div class="flex-row justify-content-between">
            <span>{{item.title}}</span>
            <span>{{item.price}}{{item.explain}}</span>
          </div>
        </li>
      </ul>
    </div>
    <p class="ps">
      <small>注1：以上为分时用车基础规则，若有夜租等套餐需求，可在支付时选择套餐活动，进行抵扣</small>
    </p>
    <p class="ps">
      <small>注2：若有＞1天的短/长租需求，可至短/长租模块进行浏览下单</small>
    </p>
  </div>
</template>

<script>
export default {
  name: 'carPrice',
  data() {
    return {
      priceList: [],
      carImg: '',
      carSeat: '-',
      carName: '加载中...',
      notice: ''
    }
  },

  mounted() {
    if (this.$callHandler) {
      if (this.$route.query.from == 'order') {
        // 从订单中查看计费规则
        this.$callHandler('getCarPrice').then(res => {
          this.priceList = [{
            title: '行驶计费',
            price: res.onMinutePrice,
            explain: '元/分钟'
          }, {
            title: '熄火计费',
            price: res.offMinutePrice,
            explain: '元/分钟'
          }, {
            title: '日封顶',
            price: res.dayMaxPrice,
            explain: '元/天'
          }]
          this.carName = res.carGenreName
          this.carSeat = res.carSeat
          this.carImg = res.carGenreImg
        })
      } else {
        // 从用车页查看计费规则
        this.$callHandler('getCarInfo', {})
          .then(res => {
            let params = {
              carGenreId: res.carGenreId,
              cityId: res.cityId
            }
            this.getCarPrice(params)
          })
          .catch(err => {
            this.$toast(err)
          })
      }
    } else if (process.env.NODE_ENV !== 'production') {
      let params = {
        carGenreId: 1,
        cityId: 410100
      }
      this.getCarPrice(params)
    }
  },

  methods: {
    getCarPrice(params) {
      // let user = this.$store.getters.user
      // if (!user || !user.id) {
      //   this.$toast('请先登录')
      //   return
      // }
      this.$fetch(
        '/service-order-timeshare/timeshareOrder/app/v30/carModelPrices',
        params
      ).then(res => {
        let result = res.data.data
        this.priceList = result.carBillingRule
        this.carName = result.carGenreName
        this.carSeat = result.carSeat
        this.carImg = result.carGenreImg
        this.notice = result.notice
      })
    }
  }
}
</script>

<style lang="scss">
$color-dot: #7a7a7a;
.car-price {
  .car-info {
    .car-bg {
      height: 24vw;
      background-color: #f4f4f4;
    }
    img {
      width: 50%;
      margin: 8vw auto 3vw;
    }
    .img-place {
      width: 50%;
      height: 29.155vw;
      margin: 8vw auto 3vw;
    }
  }
  .price-rule {
    margin: 8vw auto 8vw;
    border-bottom: 1px solid #f4f4f4;
    padding-bottom: 4vw;
    h2 {
      margin: 0 0 4vw;
    }
  }
  .ps {
    width: 83%;
    margin: 0 auto 3vw;
  }
}
</style>
