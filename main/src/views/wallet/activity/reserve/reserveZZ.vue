<template>
  <div class="reserve-car-zz">
    <div class="reserve-wrapper">
      <div class="reserve-list">
        <ul>
          <li>
            <div class="reserve-item" @click.prevent="handleChooseCar(0)">
              <div class="car-img">
                <img src="./img/car-d1.png" alt="">
                <p>知豆D1</p>
              </div>
              <div class="reserve-info">
                <h3>租15天</h3>
                <p>租金
                  <span class="highlight">650元</span>
                </p>
                <p>送券
                  <span class="highlight">149元</span>
                  <small>(预定送50元+取车送99元)</small>
                </p>
                <p>
                  <small>交纳分时保证金即可，无需再交纳押金</small>
                </p>
                <a href="javascript:;" class="select-btn" :class="{active: selectedCarIndex==0}">{{selectedCarIndex==0?'已选择':'选我吧'}}</a>
              </div>
            </div>
          </li>
          <!-- <li>
            <div class="reserve-item" @click.prevent="handleChooseCar(1)">
              <div class="car-img">
                <img src="./img/car-d2s.png" alt="">
                <p>知豆D2S</p>
              </div>
              <div class="reserve-info">
                <h3>租15天</h3>
                <p>租金
                  <span class="highlight">750元</span>
                </p>
                <p>送券
                  <span class="highlight">218元</span>
                  <small>(预定送50元+取车送168元)</small>
                </p>
                <p>
                  <small>交纳分时保证金即可，无需再交纳押金</small>
                </p>
                <a href="javascript:;" class="select-btn" :class="{active: selectedCarIndex==1}">{{selectedCarIndex==1?'已选择':'选我吧'}}</a>
              </div>
            </div>
          </li> -->
          <li>
            <div class="reserve-item" @click.prevent="handleChooseCar(2)">
              <div class="car-img">
                <img src="./img/car-hm.png" alt="">
                <p>海马爱尚</p>
              </div>
              <div class="reserve-info">
                <h3>租15天</h3>
                <p>租金
                  <span class="highlight">850元</span>
                </p>
                <p>送券
                  <span class="highlight">218元</span>
                  <small>(预定送50元+取车送168元)</small>
                </p>
                <p>
                  <small>交纳分时保证金即可，无需再交纳押金</small>
                </p>
                <a href="javascript:;" class="select-btn" :class="{active: selectedCarIndex==2}">{{selectedCarIndex==2?'已选择':'选我吧'}}</a>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="reserve-form">
        <div class="title">
          <img src="./img/copy-reserve.png" alt="">
        </div>
        <div class="selectors">
          <div class="selector" @click="handleClickCity">
            <span v-if="selectedCity">{{selectedCity}}</span>
            <span class="gray-text" v-else>请选择预计用车城市</span>
            <i>
              <img src="~@/assets/img/arrow-right.png" alt="">
            </i>
          </div>
          <div class="selector" @click="handleClickDate">
            <span v-if="selectedDate">{{selectedDate}}</span>
            <span class="gray-text" v-else>请选择预计取车时间</span>
            <i>
              <img src="~@/assets/img/arrow-right.png" alt="">
            </i>
          </div>
        </div>
        <a href="" class="reserve-btn" @click.prevent="handlePay">支付定金 100元</a>
      </div>
      <div class="reserve-rule">
        <div class="title">
          <img src="./img/copy-rule.png" alt="">
        </div>
        <ul class="rules">
          <li>
            活动流程：
            <ul>
              <li>支付定金(不予退还)</li>
              <li>支付成功短信通知</li>
              <li>前往郑州市网点进行取车、签订协议</li>
              <li>协议约定时间前完成还车</li>
            </ul>
          </li>
          <li>100元定金将从你的钱包充值余额中扣除，取车时可抵用车租金，定金不可退还；</li>
          <li>支付定金即赠送50元优惠券，取车时再次赠送优惠券，活动赠券均为分时用车优惠券包；</li>
          <li>更多活动详情，可咨询客服
            <a href="tel:400-111-1818">400-111-1818</a>
          </li>
        </ul>
      </div>
    </div>
    <mt-popup v-model="cityPopupVisible" position="bottom" popup-transition="popup-fade" :closeOnClickModal="false">
      <div class="selector-btn clearfix">
        <div class="btn-cancel" @click="handleCancelCity">取消</div>
        <div class="btn-confirm" @click="handleConfirmCity">确定</div>
      </div>
      <mt-picker ref="citySelector" :slots="citySlots"></mt-picker>
    </mt-popup>
    <mt-popup v-model="datePopupVisible" position="bottom" popup-transition="popup-fade" :closeOnClickModal="false">
      <div class="selector-btn clearfix">
        <div class="btn-cancel" @click="handleCancelDate">取消</div>
        <div class="btn-confirm" @click="handleConfirmDate">确定</div>
      </div>
      <mt-picker ref="dateSelector" :slots="dateSlots"></mt-picker>
    </mt-popup>
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
import { Picker, Popup} from 'mint-ui'
// import city from './city.js'
import getDate from './getDate.js'
let dateList = getDate()
let cityList = ['郑州', '洛阳', '焦作', '开封', '济源', '许昌', '漯河', '平顶山', '新乡', '鹤壁']
export default {

  name: 'reserve-car',

  components: {
    mtPicker: Picker,
    mtPopup: Popup
  },

  data() {
    return {
      options: [{
        carModel: '知豆D1',
        rentDays: 15
      }, {
        carModel: '知豆D2S',
        rentDays: 15
      }, {
        carModel: '海马爱尚',
        rentDays: 15
      }],
      cityPopupVisible: false,
      datePopupVisible: false,
      citySlots: [{
        flex: 1,
        values: cityList,
        className: 'city',
        textAlign: 'center',
        defaultIndex: 0
      }],
      selectedCity: null,
      dateSlots: [{
        flex: 1,
        values: dateList,
        textAlign: 'center',
        defaultIndex: 0
      }],
      selectedDate: null,
      selectedCarIndex: -1,
      payPopupVisible: false
    }
  },

  methods: {
    lockScroll() {
      this.$el.style.overflow = 'hidden'
    },
    unlockScroll() {
      this.$el.style.overflow = 'auto'
    },
    handleClickCity() {
      this.lockScroll()
      this.cityPopupVisible = true
    },
    handleClickDate() {
      this.lockScroll()
      this.datePopupVisible = true
    },
    handleConfirmCity() {
      this.unlockScroll()
      let selectedValues = this.$refs.citySelector.getValues()
      this.selectedCity = selectedValues[0]
      this.cityPopupVisible = false
    },
    handleCancelCity() {
      this.unlockScroll()
      this.cityPopupVisible = false
    },
    handleConfirmDate() {
      this.unlockScroll()
      let selectedValues = this.$refs.dateSelector.getValues()
      this.selectedDate = selectedValues[0]
      this.datePopupVisible = false
    },
    handleCancelDate() {
      this.unlockScroll()
      this.datePopupVisible = false
    },
    handleChooseCar(index) {
      this.selectedCarIndex = index
    },
    handlePay() {
      if (this.selectedCarIndex < 0) {
        this.$toast('请选择预定车辆')
        return
      }
      if (!this.selectedCity) {
        this.$toast('请选择预计用车城市')
        return
      }
      if (!this.selectedDate) {
        this.$toast('请选择预计取车时间')
        return
      }
      let user = this.$store.getters.user
      if (!user || !user.id) {
        this.$toast('当前未登录，请登录')
        return
      }
      let pickCarDate = new Date(this.selectedDate) / 1000
      this.$service.checkReserveCar(pickCarDate, 'zz').then(res => {
        this.payPopupVisible = true
      })
    },
    handleClosePayConfirm() {
      this.payPopupVisible = false
    },
    handleConfirmPay() {
      this.payPopupVisible = false
      let pickCarDate = new Date(this.selectedDate) / 1000
      let carModel = this.options[this.selectedCarIndex].carModel
      let rentDays = this.options[this.selectedCarIndex].rentDays
      this.$service.payReserveCar(carModel, rentDays, this.selectedCity, pickCarDate, 'zz').then(res => {
        this.$message.alert('定金支付成功，我们的工作人员稍后将与你联系')
      })
    }
  },

  mounted() {
    this.$refs.citySelector.setSlotValue(0, cityList[0])
    this.$refs.dateSelector.setSlotValue(0, dateList[0])
  }
}
</script>
<style lang="scss" scoped>
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

.reserve-car-zz {
  .reserve-wrapper {
    width: 100%;
    padding: 49vw 3vw 5vw;
    background-color: #fffdfc;
    background-image: url('./img/top-bg-zz.jpg');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: top;
  }
  img {
    width: 100%;
  }

  .reserve-list {
    li {
      background-image: url('./img/card-bg.png');
      background-size: 100% 100%;
      margin-bottom: 3vw;
      .reserve-item {
        display: flex;
        flex-direction: row;
        padding: 3vw 0;
        .car-img {
          width: 43%;
          padding: 0 2vw;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding-top: 2vw;
          img {
            width: 80%;
            height: auto;
          }
          p {
            margin-top: 1vw;
          }
        }
        .reserve-info {
          h3 {
            font-size: 4.8vw;
            line-height: 7vw;
            font-weight: bold;
          }
          p {
            font-size: 3.45vw;
            color: #3d3d3d;
            margin: 0.6vw 0;
            span {
              color: #b05144;
              margin-left: 1vw;
            }
            small {
              font-size: 2.667vw;
              color: #3d3d3d;
            }
          }
          .select-btn {
            @include red-button(28vw, 7.2vw);
            margin-top: 2.66vw;
            display: inline-block;
            &.active {
              border: 1px solid #b05144;
              background-color: #fffcf4;
              color: #b05144;
            }
          }
        }
      }
    }
  }
  .reserve-form {
    margin: 10vw 0 0;
    .title {
      margin: 3vw 0 0;
    }
    .selectors {
      .selector {
        margin: 5vw 0;
        border: 1px solid #bd5749;
        border-radius: 2px;
        height: 12vw;
        line-height: 12vw;
        padding: 0 3vw;
        .gray-text {
          color: $color-gray-light;
        }
        i {
          float: right;
          img {
            width: 2vw;
          }
        }
      }
    }
    .reserve-btn {
      @include red-button(100%, 12vw);
      margin-top: 8vw;
      font-size: 4.26667vw;
    }
  }
  .reserve-rule {
    margin-top: 10vw;
    .rules {
      margin-top: 5vw;
      font-size: 3.4667vw;
      list-style: decimal;
      padding-left: 5vw;
      > li {
        margin: 3vw 0;
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
  .mint-popup-bottom {
    width: 100%;
    overflow: hidden;
  }
  .selector-btn {
    > div {
      padding: 3vw;
    }
    .btn-cancel {
      float: left;
    }
    .btn-confirm {
      float: right;
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
    }
  }
}

.mint-toast-text {
  line-height: 1.5;
}
</style>
