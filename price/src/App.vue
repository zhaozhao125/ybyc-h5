<template>
  <div id="app">
    <div class="wrapper">
      <div class="car-info">
        <div class="car-bg"></div>
        <img v-if="carImg" :src="carImg" alt="car" class="car-img">
        <div v-else class="img-place"></div>
        <p>{{carName}}
          <span class="dot"></span> {{carSeat}}座</p>
      </div>
      <div class="price-rule">
        <h2>
          <span>计费标准</span>
          <div class="line"></div>
        </h2>
        <ul>
          <li v-for="(item, index) in priceList" :key="index">
            <span>{{item.title}}</span>
            <span>{{item.price}}{{item.explain}}</span>
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
  </div>

</template>

<script>
export default {
  name: 'app',
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
    console.log('====mounted====')
    if (this.$callHandler) {
      console.log('====ccc====')
      this.$callHandler('getCarInfo', {}).then(info => {
        this.$http({
          method: 'post',
          url: '/service-order-timeshare/timeshareOrder/app/v30/carModelPrices',
          data: {
            carGenreId: info.carId,
            areaCode: info.areaCode
          },
          user: {
            client: info.client,
            id: info.userId,
            token: info.token,
            version: info.version
          }
        }).then(res => {
          let result = res.data.data
          this.priceList = result.carBillingRule
          this.carName = result.carGenreName
          this.carSeat = result.carSeat
          this.carImg = result.carGenreImg
          this.notice = result.notice
        })
      }).catch(e => {
        this.$toast(e)
      })
    }else if (process.env.NODE_ENV !== 'production') {
      console.log('====gogo====')
      this.$http({
        method: 'post',
        url: '/service-order-timeshare/timeshareOrder/app/v30/carModelPrices',
        data: {
          carGenreId: 1,
          areaCode: '0371'
        },
        user: {
          client: 1,
          id: 96657,
          token: 'e16c6a8f919b33ebea2c4c5843a984dd',
          version: 312
        }
      }).then(res => {
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
$color-gray: #bbb;
$color-dark: #3d3d3d;
$color-dot: #7a7a7a;
$color-bg: #f4f4f4;
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  background-color: #fff;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '\5FAE\8F6F\96C5\9ED1', Arial, sans-serif;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.wrapper {
  text-align: center;
  .car-info {
    .car-bg {
      position: absolute;
      width: 100%;
      height: 24vw;
      top: 0;
      left: 0;
      background-color: $color-bg;
    }
    img {
      position: relative;
      z-index: 9;
      display: block;
      width: 50%;
      margin: 8vw auto 3vw;
    }
    .img-place {
      position: relative;
      z-index: 9;
      display: block;
      width: 50%;
      height: 29.155vw;
      margin: 8vw auto 3vw;
    }
    p {
      position: relative;
      z-index: 9;
      font-size: 3.73333vw;
      .dot {
        display: inline-block;
        width: 4px;
        height: 4px;
        background-color: $color-dot;
        border-radius: 50%;
        vertical-align: middle;
        margin: 0 0.5vw;
      }
    }
  }
  .price-rule {
    width: 90%;
    margin: 0 auto 8vw;
    border-bottom: 1px solid $color-bg;
    padding-bottom: 4vw;
    h2 {
      font-size: 3.2vw;
      margin: 8vw 0 4vw;
      font-weight: normal;
      color: $color-gray;
      position: relative;
      span {
        position: relative;
        background-color: #fff;
        z-index: 3;
        padding: 0 4vw;
      }
      .line {
        background-color: $color-bg;
        width: 100%;
        height: 1px;
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
      }
    }
    ul {
      font-size: 3.73333vw;
      width: 92%;
      margin: auto;
      list-style: none;
      li {
        margin-bottom: 4vw;
        &:after {
          content: '';
          display: block;
          clear: both;
          visibility: hidden;
        }
        span {
          &:first-child {
            float: left;
          }
          &:last-child {
            float: right;
          }
        }
      }
    }
  }
  .ps {
    width: 83%;
    margin: 0 auto 3vw;
    text-align: left;
    small {
      color: $color-gray;
      font-size: 3.2vw;
    }
  }
}
</style>
