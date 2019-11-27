<template>
  <div class="qingming-2018">
    <div class="top-title">
      <h3>预订就送券 / 还车后再返还优惠金额</h3>
      <p>活动时间 2018/04/02 - 2018/04/08</p>
    </div>
    <ul class="car-list">
      <li v-for="(car, index1) in activityData" :key="index1">
        <div class="car-card">
          <div class="car-img">
            <img :src="car.carImg" alt="">
          </div>
          <div class="car-name">
            {{car.carModel}}
          </div>
          <div class="price-container">
            <div class="price-item" v-for="(item, index2) in car.priceList" :key="index2" @click="handleSelect(index1, index2)">
              <span>{{item.days}}天</span>
              <span>{{item.price}}元</span>
              <div class="discount">
                <del>原{{item.originalPrice}}元</del>
                <span>省{{item.originalPrice - item.price}}元</span>
              </div>
              <i class="check-circle" :class="{active: index1==carIndex&&index2==priceIndex}"></i>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div class="reserve-input">
      <h3>预定车辆</h3>
      <div class="form-container">
        <div class="input-item">
          <p>是否需要充电枪等物料</p>
          <mt-switch v-model="needChargeGun"></mt-switch>
        </div>
        <template v-if="needChargeGun">
          <div class="input-item" @click="handleShowStation">
            <p v-if="selectedStation" class="darker">{{selectedStation}}</p>
            <p v-else>
              <span>请选择取物料网点(充电枪等)</span>
            </p>
            <div class="input-arrow"></div>
          </div>
          <div class="input-item" @click="handleShowDate">
            <p v-if="formatDate" class="darker"> {{formatDate}}</p>
            <p v-else>
              <span>请选择取物料时间</span>
            </p>
            <div class="input-arrow"></div>
          </div>
        </template>

        <div class="submit-btn" @click="handleSubmit">支付定金 20元</div>
      </div>
    </div>
    <div class="activity-rule">
      <h3>活动规则</h3>
      <ul class="rules">
        <li>
          活动流程：
          <ul>
            <li>预定：支付定金后，即成功参与本活动，同时赠送20元优惠券</li>
            <li>取车：4月2号-4月8号期间，前往任一分时网点下单用车即可</li>
            <li>还车：根据已预定的套餐时长，前往任一分时网点还车</li>
            <li>结算：还车后3个工作日，系统自动将优惠直接充值到钱包余额</li>
          </ul>
        </li>
        <li>20元定金将从你的钱包充值余额中扣除，还车后结算将与优惠金额一同返还</li>
        <li>若填写了取物料信息，在取车后即可前去取物料，还车前需归还</li>
        <li class="rule-zhengzhou" v-if="currentCity=='zhengzhou'">大科园店地址：西三环电厂路国家大学科技园12号楼一楼知豆体验店；<br>
          <!-- 航海路店地址：航海路城东路向南50米路东；<br> -->天伦路店地址：中州大道天伦路向西200米路北</li>
        <li class="rule-hefei" v-if="currentCity=='hefei'">文曲路创新产业园地址：高新区文曲路创新产业园二期F5栋402</li>
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
        <p>20元定金将从你的</p>
        <p>
          <strong>钱包余额-充值余额</strong>中扣除</p>
        <p>支付后即赠送
          <span class="highlight">20元优惠券</span>噢~</p>
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
import activityData from './activity-data'
export default {
  components: {
    mtPopup: Popup,
    mtSwitch: Switch,
    mtActionsheet: Actionsheet,
    mtDatetimePicker: DatetimePicker
  },

  data() {
    return {
      carIndex: 0,
      priceIndex: 0,
      stationVisilbe: false,
      needChargeGun: false,
      selectedStation: '',
      zhengzhouStationActions: [
        {
          name: '大科园网点',
          method: value => {
            this.selectedStation = value.name
          }
        },
        // {
        //   name: '航海路网点',
        //   method: value => {
        //     this.selectedStation = value.name
        //   }
        // },
        {
          name: '天伦路网点',
          method: value => {
            this.selectedStation = value.name
          }
        }
      ],
      hefeiStationActions: [
        {
          name: '文曲路创新产业园',
          method: value => {
            this.selectedStation = value.name
          }
        }
      ],
      dateModel: null,
      startDate: new Date(2018, 4 - 1, 2),
      endDate: new Date(2018, 4 - 1, 8),
      payPopupVisible: false,
      selectedDate: null
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
    currentCity() {
      let ret = 'zhengzhou'
      if (this.$route.query && this.$route.query.city === 'hefei') {
        ret = 'hefei'
      }
      return ret
    },
    activityData() {
      if (this.currentCity === 'zhengzhou') {
        return activityData.zhengzhou
      }
      return activityData.hefei
    },
    stationActions() {
      if (this.currentCity === 'hefei') {
        return this.hefeiStationActions
      }
      return this.zhengzhouStationActions
    }
  },

  methods: {
    handleSelect(carIndex, priceIndex) {
      this.carIndex = carIndex
      this.priceIndex = priceIndex
    },
    handleShowStation() {
      this.stationVisilbe = true
    },
    handleShowDate() {
      this.$refs.datePicker.open()
    },
    getRequestParams() {
      return {
        activity_code: '2018_qingming',
        activity_city: this.currentCity === 'hefei' ? 'hf' : 'zz',
        use_car_gener: this.activityData[this.carIndex].carModel,
        use_car_days: this.activityData[this.carIndex].priceList[this.priceIndex].days,
        is_send_car: 2,
        is_send_material: this.needChargeGun ? 1 : 2,
        take_station_name: this.needChargeGun ? this.selectedStation : '',
        take_car_date: this.needChargeGun
          ? Math.floor(this.selectedDate / 1000)
          : '',
        send_car_date: ''
      }
    },
    checkQualification() {
      this.$fetch(
        '/v26/activity/promotion-activity-check',
        this.getRequestParams(),
        'post'
      )
        .then(res => {
          this.payPopupVisible = true
        })
        .catch(err => {
          // this.payPopupVisible = true
        })
    },
    handleSubmit() {
      if (!this.$store.getters.user || !this.$store.getters.user.id) {
        this.$toast('当前未登录，请登录')
        return false
      }
      if (this.carIndex < 0 || this.priceIndex < 0) {
        this.$toast('请选择套餐')
        return false
      }
      if (this.needChargeGun) {
        if (!this.selectedStation) {
          this.$toast('请选择取物料网点')
          return false
        }
        if (!this.selectedDate) {
          this.$toast('请选择取物料时间')
          return false
        }
      }
      this.checkQualification()
    },
    handleConfirmDate(value) {
      this.selectedDate = value
    },
    handleConfirmPay() {
      this.payPopupVisible = false
      this.$fetch(
        '/v26/activity/promotion-activity-pay',
        this.getRequestParams(),
        'post'
      ).then(res => {
        // this.$toast('定金支付成功')
        this.$message.alert('定金支付成功')
      })
    },
    handleClosePayConfirm() {
      this.payPopupVisible = false
    }
  }
}
</script>

<style lang="scss">
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
.qingming-2018 {
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: #ecfbe6;
  .top-title {
    background-image: url('./img/bg.png');
    background-size: 100% auto;
    text-align: center;
    height: 60vw;
    padding-top: 20vw;
    color: #555;
    margin-bottom: -20vw;
    h3 {
      font-size: 4vw;
    }
    p {
      margin-top: 2vw;
      color: #555;
    }
  }
  .car-list {
    li {
      margin-bottom: 3vw;
    }
    .car-card {
      position: relative;
      width: 90%;
      margin: auto;
      background-color: #fff;
      padding: 0 2vw;
      display: flex;
      flex-direction: row;
      .car-img {
        width: 28%;
        display: flex;
        align-items: center;
        margin-left: 3vw;
        img {
          display: block;
          width: 100%;
        }
      }
      .car-name {
        position: absolute;
        background-color: #fdd000;
        padding: 0.6vw 4vw;
        font-size: 2.9333vw;
        left: -1.3vw;
        bottom: 4vw;
        box-shadow: 0 0.5333vw 1.0667vw 0 rgba(143, 143, 143, 0.5);
        &::after {
          content: '';
          display: block;
          position: absolute;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0.7vw;
          border-color: transparent;
          border-right-color: #d1ad03;
          border-bottom-color: #d1ad03;
          top: -1.33vw;
          left: 0px;
        }
      }
      .price-container {
        margin-left: 5vw;
        flex: 1;
        .price-item {
          font-size: 4.2667vw;
          display: flex;
          flex-direction: row;
          display: flex;
          flex-direction: row;
          padding: 6vw 0;
          position: relative;
          &:first-of-type {
            border-bottom: 1px solid #e9e9e9;
          }
          > span {
            font-size: 4.2667vw;
            margin-right: 5vw;
            font-weight: bold;
          }
          .discount {
            font-size: 3.7333vw;
            position: relative;
            top: 2vw;
            margin-left: 2vw;
            > span {
              position: absolute;
              top: -70%;
              color: #7ac753;
            }
          }
          .check-circle {
            width: 3.5vw;
            height: 3.5vw;
            background: #eaeaea;
            border-radius: 50%;
            display: block;
            align-self: center;
            position: absolute;
            right: 3vw;
            top: 0;
            bottom: 0;
            margin: auto;
            &.active {
              background-color: $color-yellow;
            }
          }
        }
      }
    }
  }
  .reserve-input {
    width: 89%;
    margin: 8vw auto 0;
    h3 {
      font-size: 5vw;
      color: #64a543;
      margin-bottom: 6vw;
    }
    .input-item {
      background: #ecfbe6;
      border: 1px solid #7ac753;
      border-radius: 26.667vw;
      padding: 2.5vw 0 2.5vw 5vw;
      position: relative;
      margin-bottom: 5vw;
      p {
        font-size: 4.26667vw;
        color: #99c583;
        &.darker {
          color: #7ac753;
        }
      }
      .input-arrow {
        &:after {
          border: 0.5333vw solid #7ac753;
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
      box-shadow: 0 2px 4px 0 rgba(202, 202, 202, 0.5);
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
    h3 {
      font-size: 5vw;
      color: #64a543;
      margin-bottom: 6vw;
    }
    .rules {
      color: #99c583;
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
        color: #99c583;
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
