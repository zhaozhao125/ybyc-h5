<template>
  <div id="charging-rules">
    <div class="upper-part">
      <div class="shade-content"></div>
      <swiper v-if="carPictureArr && carPictureArr.length" :options="swiperOption" ref="mySwiper">
        <!-- slides -->
        <swiper-slide v-for="item in carPictureArr" :key="item.carGenreId">
          <img :src="item.carGenreImg" />
        </swiper-slide>
        <!-- Optional controls -->
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
      </swiper>
      <div v-for="item in renderPriceArr" :key="item.carGenreId" class="charging-content">
        <p class="car-name"> {{item.carGenreName}}
          <span class="dot"></span> {{item.carGenreSeat}}座</p>
        <div class="line-content">
          <span class="line"></span>
          <span class="line-tip">计费标准</span>
          <span class="line"></span>
        </div>
        <ul>
          <li>
            <span>熄火价</span>
            <span>{{item.offMinutePrice}}元/分钟</span>
          </li>
          <li>
            <span>行驶价</span>
            <span>{{item.onMinutePrice}}元/分钟</span>
          </li>
          <li>
            <span>日封顶</span>
            <span>{{item.dayMaxPrice}}元</span>
          </li>
        </ul>
        <p class="tip">注1：以上为分时用车基础规则，若有夜租等套餐需求，可在支付时选择套餐活动，进行抵扣</p>
        <p class="tip">注2：若有＞1天的短/长租需求，可至短/长租模块进行浏览下单</p>
      </div>
    </div>
    <!-- <div class="under-part">
      <p class="tip">以上均为分时车辆规则，若使用长租车辆</p>
      <p class="tip">具体请咨询400-111-1818</p>
    </div> -->
  </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
export default {
  components: {
    swiper: swiper,
    swiperSlide: swiperSlide
  },

  data() {
    let self = this
    return {
      carPictureArr: [],
      renderPriceArr: [],
      swiperOption: {
        loop: true,
        // 前进后退按钮
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        on: {
          slideChangeTransitionStart: function () {
            self.carPictureArr.forEach((item, index) => {
              if (index === this.realIndex) {
                self.renderPriceArr.unshift(item)
              }
            })
            self.renderPriceArr.splice(1, self.renderPriceArr.length)
          }
        }
      }
    }
  },
  mounted() {
    this.carPriceList()
  },
  methods: {
    getPrice(cityCode) {
      this.$service
        .carPriceList({
          cityCode
        })
        .then(res => {
          if (res.data.errCode === 0) {
            this.carPictureArr = res.data.data
          }
        })
    },
    carPriceList() {
      // 测试环境
      if (process.env.NODE_ENV !== 'production') {
        this.getPrice('0371')
      }
      // 线上环境
      if (this.$callHandler) {
        this.$callHandler('getAreaCode', {}).then(data => {
          this.getPrice(String(data))
        })
      }
    }
  }
}
</script>

<style lang='scss'>
$color-border: #f4f4f4;
$color-gray: #bbb;
#charging-rules {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  //   上部分
  .upper-part {
    flex: 1;
    position: relative;
    overflow-y: scroll;
    .swiper-container {
      height: 20vw;
    }
    .shade-content {
      position: absolute;
      left: 0;
      right: 0;
      width: 100%;
      height: 28.6vw;
      padding: 0 6.4vw;
      background: rgba(244, 244, 244, 1);
    }
    .swiper-container {
      margin-top: 2vw;
      width: 100%;
      height: 40.8vw;
      .swiper-slide {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          //   margin-top: 5vw;
          width: 50%;
        }
      }
      .swiper-button-next,
      .swiper-button-prev {
        background-size: 100%;
        background-repeat: no-repeat;

        width: 12.8vw;
        // margin-top: 3vw;
        // height: 12.8vw;
      }
      .swiper-button-next {
        background-image: url('./img/arrow_right.png');
        right: 6.4vw;
      }
      .swiper-button-prev {
        background-image: url('./img/arrow_left.png');
        left: 6.4vw;
      }
    }
    .charging-content {
      width: 90.4vw;
      position: absolute;
      margin: 2vw auto;
      left: 0;
      right: 0;
      .car-name {
        text-align: center;
        white-space: nowrap;
        font-size: 4.266666666666667vw;
        color: #3d3d3d;
        .dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          background-color: #7a7a7a;
          border-radius: 50%;
          vertical-align: middle;
          margin: 0 0.5vw;
        }
      }
      .line-content {
        display: flex;
        align-items: center;
        margin-top: 6vw;
        span {
          height: 1px;
          background: $color-border;
          text-align: center;
        }
        .line {
          flex: 2 1 auto;
        }
        .line-tip {
          font-size: 3.2vw;
          background: #fdfdfe;
          color: $color-gray;
          padding: 0 4vw;
          height: 5vw;
        }
      }
      ul {
        padding: 4vw 0 5vw 0;
        border: 1px solid transparent;
        border-bottom-color: $color-border;
        margin-bottom: 5vw;
        li {
          display: flex;
          justify-content: space-between;
          padding: 1.7vw 6.2vw;
          white-space: nowrap;
          color: #3d3d3d;
          font-size: 3.7333333333333334vw;
        }
      }
    }
  }
  // 下部分
  // .under-part {
  //   width: 100%;
  //   margin-bottom: 5.066666666666666vw;
  //   .tip{
  //     text-align: center;
  //   }
  // }
  .tip {
    font-size: 3.2vw;
    color: $color-gray;
    width: 86%;
    margin:0 auto 3vw;
  }
}
</style>
