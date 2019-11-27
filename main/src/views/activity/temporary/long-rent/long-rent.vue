<template>
  <div class="activity-long-rent">
    <img class="top-bg" src="./img/bg.png" alt="">
    <swiper ref="swiper" :options="swiperOption" class="swiper-container" v-for="(swiper, swiperIndex) in activityData" :key="swiperIndex">
      <swiper-slide class="swiper-slide rent-card" v-for="(item, index) in swiper.plan" :key="index">
        <div class="swiper-item" @click="handleSelect(swiperIndex, index)">
          <img :src="imagePath(swiper.img)" alt="" class="car-bg">
          <div class="intro-text">
            <h1 class="car-model">{{swiper.carModel}}</h1>
            <h2 class="rent-name">{{item.duration}}套餐</h2>
            <h3>费用</h3>
            <p>租金
              <span class="text-highlight">{{item.price}}</span>
            </p>
            <p>车辆押金
              <span class="text-highlight">{{item.carDeposit}}元</span>&nbsp;&nbsp;违章押金
              <span class="text-highlight">{{item.violationDeposit}}元</span>
            </p>
            <hr>
            <h3>奖励</h3>
            <p>优惠券
              <span class="text-highlight">{{item.reward}}元</span>&nbsp;(预定送{{item.reserveReward}}元+取车送{{item.takeReward}}元)</p>
          </div>
          <div class="card-checkbox" :class="{'active': carIndex == swiperIndex && planIndex == index}"></div>
        </div>
      </swiper-slide>
    </swiper>
    <div class="reserve-input">
      <h1>预定车辆</h1>
      <div class="form-container">
        <template v-if="!needSend">
          <p v-if="planIndex >= 0 && !moreThan6M">
            <small style="color:#3d3d3d;margin-bottom:1vw;display:inline-block;">该套餐无需到门店取车，可就近分时网点取车</small>
          </p>
          <div class="input-item" @click="handleShowStation">
            <p v-if="selectedStation" class="darker">{{selectedStation}}</p>
            <p v-else>
              <span v-if="!moreThan6M">请选择取物料网点(充电枪等)</span>
              <span v-else>请选择取车网点</span>
            </p>
            <div class="input-arrow"></div>
          </div>
          <div class="input-item" @click="handleShowDate">
            <p v-if="formatDate" class="darker">{{formatDate}}</p>
            <p v-else>
              <span v-if="!moreThan6M">请选择取物料时间</span>
              <span v-else>请选择取车时间</span>
            </p>
            <div class="input-arrow"></div>
          </div>
        </template>
        <template v-else>
          <div class="input-item">
            <p>是否需要充电枪等物料</p>
            <mt-switch v-model="needChargeGun"></mt-switch>
          </div>
          <div class="input-item" @click="handleShowDate">
            <p v-if="formatDate" class="darker">{{formatDate}}</p>
            <p v-else>请选择送车时间</p>
            <div class="input-arrow"></div>
          </div>
        </template>
        <div class="input-item">
          <p>送车上门服务(100元)</p>
          <mt-switch v-model="needSend" @change="handleChangeNeedSend"></mt-switch>
        </div>
        <div class="submit-btn" @click="handleSubmit">支付定金 100元</div>
      </div>
    </div>
    <div class="activity-rule">
      <div>
        <h1>活动规则</h1>
      </div>
      <ul class="rules">
        <li>
          活动流程：
          <ul>
            <li>支付定金(不予退还)</li>
            <li>6个月以下套餐，就近分时网点取车后，前往门店取充电枪等物料，同时开始长租订单</li>
            <li>6个月及以上套餐，需前往指定门店取车，取车时开始长租订单</li>
            <li>若选择了送车上门服务，与您联系后，将车辆与物料送至指定地点（仅限四环内），服务费100元将与租金一并支付</li>
          </ul>
        </li>
        <li>100元定金将从你的钱包充值余额中扣除，取车时可抵用车租金，定金不可退还</li>
        <li>支付定金即赠送50元优惠券，取车时再次赠送优惠券，活动赠券均为分时用车优惠券包</li>
        <li>大科园店地址：西三环电厂路国家大学科技园12号楼底层商铺；航海路店地址：航海路城东路向南50米路东；天伦路店地址：中州大道天伦路向西200米路北</li>
        <li>更多活动详情，可咨询客服
          <a href="tel:400-111-1818">
            <strong>400-111-1818</strong>
          </a>
        </li>
      </ul>
    </div>
    <mt-actionsheet :actions="stationActions" v-model="stationVisilbe">
    </mt-actionsheet>
    <mt-datetime-picker ref="datePicker" v-model="dateModel" type="date" :startDate="startDate" :endDate="endDate" year-format="{value} 年" month-format="{value}月" date-format="{value}日" hour-format="{value}时" minute-format="" @confirm="handleConfirmDate">
    </mt-datetime-picker>
    <mt-popup v-model="payPopupVisible" position="center">
      <div class="pay-confirm">
        <p>100元定金将从你的</p>
        <p>
          <strong>钱包余额-充值余额</strong>中扣除</p>
        <p>支付后即赠送
          <span class="highlight">50元优惠券</span>噢~</p>
        <a href="" class="pay-btn" @click.prevent="handleConfirmPay">确认支付</a>
        <span class="close-pay" @click="handleClosePayConfirm">
          <img src="./img/close.png" alt="">
        </span>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import { Popup, Switch, Actionsheet, DatetimePicker } from 'mint-ui'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import activityData from './activity-data.js'
export default {

  components: {
    swiper: swiper,
    swiperSlide: swiperSlide,
    mtPopup: Popup,
    mtSwitch: Switch,
    mtActionsheet: Actionsheet,
    mtDatetimePicker: DatetimePicker
  },

  data() {
    return {
      activityData,
      swiperOption: {
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 6
      },
      swiperList: [],
      needSend: false,
      stationVisilbe: false,
      selectedStation: '',
      stationActions: [{
        name: '大科园网点',
        method: (value) => {
          this.selectedStation = value.name
        }
      }, {
        name: '航海路网点',
        method: (value) => {
          this.selectedStation = value.name
        }
      }, {
        name: '天伦路网点',
        method: (value) => {
          this.selectedStation = value.name
        }
      }],
      dateModel: null,
      selectedDate: null,
      startDate: new Date(),
      endDate: new Date('2018-03-31'),
      needChargeGun: false,
      carIndex: -1,
      planIndex: -1,
      payPopupVisible: false
    }
  },

  computed: {
    formatDate() {
      if (!this.selectedDate) {
        return null
      }
      if (this.selectedDate && this.selectedDate.toLocaleDateString) {
        return this.selectedDate.toLocaleDateString()
      }
      return null
    },
    moreThan6M() {
      if (this.carIndex >= 0 && this.planIndex >= 0) {
        return activityData[this.carIndex].plan[this.planIndex].duration == '6个月' || activityData[this.carIndex].plan[this.planIndex].duration == '12个月'
      }
      return false
    }
  },

  methods: {
    imagePath(imgName) {
      return imgName ? require('@/views/activity/long-rent/img/' + imgName) : ''
    },
    handleShowStation() {
      this.stationVisilbe = true
    },
    handleConfirmDate(value) {
      this.selectedDate = value
    },
    handleShowDate() {
      this.$refs.datePicker.open()
    },
    handleSelect(carIndex, planIndex) {
      // if(this.carIndex != carIndex || this.planIndex != planIndex){
      //   this.$el.querySelector('.reserve-input').scrollIntoView({behavior: 'smooth'})
      // }
      this.carIndex = carIndex
      this.planIndex = planIndex
    },
    handleChangeNeedSend() {
      this.selectedStation = ''
      this.selectedDate = null
    },
    getRequestParams() {
      return {
        activity_code: '201803_long_rent',
        activity_city: 'zz',
        use_car_gener: activityData[this.carIndex].carModelName,
        use_car_days: activityData[this.carIndex].plan[this.planIndex].duration,
        is_send_car: this.needSend ? 1 : 2,
        is_send_material: this.needChargeGun ? 1 : 2,
        take_station_name: this.needSend ? '' : this.selectedStation,
        take_car_date: this.needSend ? '' : Math.floor(this.selectedDate / 1000),
        send_car_date: this.needSend ? Math.floor(this.selectedDate / 1000) : ''
      }
    },
    checkQualification() {
      this.$fetch('/v26/activity/promotion-activity-check', this.getRequestParams(), 'post').then(res => {
        this.payPopupVisible = true
      })
    },
    handleConfirmPay() {
      this.payPopupVisible = false
      this.$fetch('/v26/activity/promotion-activity-pay', this.getRequestParams(), 'post').then(res => {
        this.$toast('定金支付成功')
      })
    },
    handleClosePayConfirm() {
      this.payPopupVisible = false
    },
    handleSubmit() {
      if (!this.$store.getters.user || !this.$store.getters.user.id) {
        this.$toast('当前未登录，请登录')
        return false
      }
      if (this.carIndex < 0 || this.planIndex < 0) {
        this.$toast('请选择套餐')
        return false
      }
      if (!this.needSend) {
        if (!this.selectedStation) {
          this.$toast('请选择网点')
          return false
        }
        if (!this.selectedDate) {
          if (this.moreThan6M) {
            this.$toast('请选择取车时间')
          } else {
            this.$toast('请选择取物料时间')
          }
          return false
        }
      } else {
        if (!this.selectedDate) {
          this.$toast('请选择送车时间')
          return false
        }
      }
      this.checkQualification()
    }
  },

  mounted() {
    setTimeout(() => {
      this.$refs.swiper[0].swiper.slideTo(2)
    }, 500)
  }
}
</script>
<style lang="scss">
$blue: #3c29d1;
@mixin red-button($width, $height) {
  display: block;
  width: $width;
  height: $height;
  line-height: $height;
  background-color: #b05144;
  color: #fefeff;
  text-align: center;
  border-radius: 0.5333vw;
}
.activity-long-rent {
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: $color-yellow;
  .top-bg {
    display: block;
    width: 90.7%;
    margin: 2vw auto 6vw;
  }
  .swiper-container {
    width: 89.34%;
    height: 76vw;
    overflow: visible;
    margin-bottom: 10vw;
  }
  .rent-card {
    position: relative;
    background: #fffcf4;
    box-shadow: 0.5333vw 0.5333vw 3.4667vw 0 rgba(188, 95, 199, 0.5);
    border-radius: 4vw;
    .car-bg {
      position: absolute;
      z-index: 0;
      width: 64%;
      right: 0;
      top: 0;
    }
    .intro-text {
      position: relative;
      z-index: 1;
      padding: 7vw 0 7vw 7vw;
      h1 {
        color: #3c29d1;
        font-size: 5.3333vw;
      }
      h2 {
        font-size: 8.26667vw;
        margin-bottom: 5vw;
        font-weight: bold;
      }
      h3 {
        font-size: 4.65vw;
        font-weight: bold;
      }
      p {
        color: #8c8b8b;
        font-size: 4.1333vw;
      }
      .text-highlight {
        color: $blue;
        font-weight: bold;
      }
    }
    hr {
      opacity: 0.3;
      margin-right: 7vw;
    }
    .card-checkbox {
      position: absolute;
      top: 5vw;
      right: 5vw;
    }
  }
  .card-checkbox {
    box-sizing: border-box;
    display: inline-block;
    background-color: $color-gray-white;
    border-radius: 100%;
    position: relative;
    width: 6vw;
    height: 6vw;
    vertical-align: middle;
    &:after {
      border: 0.6vw solid transparent;
      border-left: 0;
      border-top: 0;
      content: ' ';
      position: absolute;
      top: 0.88vw;
      left: 2vw;
      width: 1.5vw;
      height: 2.7vw;
      -webkit-transform: rotate(45deg) scale(0);
      transform: rotate(45deg) scale(0);
      -webkit-transition: -webkit-transform 0.2s;
      transition: -webkit-transform 0.2s;
      transition: transform 0.2s;
      transition: transform 0.2s, -webkit-transform 0.2s;
      border-color: #fff;
      -webkit-transform: rotate(45deg) scale(1);
      transform: rotate(45deg) scale(1);
    }
    &.active {
      background-color: #ff3f1d;
      &:after {
      }
    }
  }

  .reserve-input {
    width: 100%;
    padding: 0 7%;
    h1 {
      font-size: 7vw;
      margin-bottom: 5vw;
    }
    .input-item {
      background: #ffffff;
      border: 1px solid #3d3d3d;
      border-radius: 26.667vw;
      padding: 3vw 0 3vw 5vw;
      position: relative;
      margin-bottom: 5vw;
      p {
        font-size: 4.26667vw;
        &.darker {
          color: #3d3d3d;
        }
      }
      .input-arrow {
        &:after {
          border: 0.5333vw solid #c8c8cd;
          border-bottom-width: 0;
          border-left-width: 0;
          content: ' ';
          top: 50%;
          right: 6%;
          position: absolute;
          width: 2.6667vw;
          height: 2.6667vw;
          -webkit-transform: translateY(-50%) rotate(45deg);
          transform: translateY(-50%) rotate(45deg);
        }
      }
      .mint-switch {
        position: absolute;
        right: 3vw;
        top: 0;
        bottom: 0;
        margin: auto;
        .mint-switch-input:checked + .mint-switch-core {
          border-color: $color-yellow;
          background-color: $color-yellow;
        }
      }
    }
    .submit-btn {
      background: #3d3d3d;
      box-shadow: 0 2px 8px 0 rgba(153, 80, 201, 0.5);
      border-radius: 26.667vw;
      font-size: 4.26667vw;
      padding: 3vw 0 3vw 5vw;
      text-align: center;
      color: #fefeff;
    }
  }
  .activity-rule {
    width: 86%;
    margin: 8vw auto;
    h1 {
      font-size: 7vw;
      margin-bottom: 5vw;
    }
    .rules {
      margin-top: 5vw;
      font-size: 3.4667vw;
      list-style: decimal;
      padding-left: 5vw;
      > li {
        margin: 1.5vw 0;
        line-height: 5.5vw;
      }
      ul {
        list-style: lower-latin;
        padding-left: 5vw;
        li {
          margin: 0.5vw 0;
        }
      }
      a {
        color: #3d3d3d;
      }
    }
  }
  .pay-confirm {
    width: 78vw;
    text-align: center;
    padding: 10vw 5vw 5vw;
    p {
      font-size: 4.26667vw;
      color: #3d3d3d;
      margin-bottom: 1vw;
      .highlight {
        color: #bd5749;
      }
    }
    .pay-btn {
      @include red-button(100%, 12vw);
      margin-top: 5vw;
      font-size: 4.2667vw;
    }
    .close-pay {
      position: absolute;
      top: 0;
      right: 0;
      width: 8vw;
      padding: 2.2vw;
      img {
        width: 100%;
      }
    }
  }
}
</style>
