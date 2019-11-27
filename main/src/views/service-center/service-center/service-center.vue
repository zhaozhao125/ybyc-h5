<template>
  <div id="service-center">
    <div class="upper-part">
      <div class="title">
        <h1>问题反馈</h1>
      </div>
      <div class="top-content">
        <div>
          <div class="breakdown" @click="jumpCarFeedBackApp">
            <img src="./img/car-breakdown.png" alt="车辆图片">
            <p>车辆</p>
          </div>
          <div class="breakdown" @click="jumpChargeFeedBackApp">
            <img src="./img/charge-breakdown.png" alt="充电桩图片">
            <p>充电桩</p>
          </div>
        </div>
      </div>
      <div class="center-content">
        <h1>常见问题</h1>
        <div>
          <cell-item title='新手上路' addBorderBottom @jumpPage='jumpNewbie'></cell-item>
          <!-- <cell-item title='计费规则' addBorderBottom @jumpPage='jumpChargingRules'></cell-item> -->
          <cell-item title='车辆操作指南' addBorderBottom @jumpPage='jumpGuide'></cell-item>
          <cell-item title='更多常见问题' @jumpPage='jumpMoreQuestionApp'></cell-item>
          <cell-item title='对我们的意见或建议' fontBlod class="last-item" @jumpPage='jumpFeedback'></cell-item>
        </div>
      </div>
    </div>
    <div class="under-part">
      <a href="tel:4001111818" class="tel-service" @click="sensorsData('serviceCenterClickPhoneService')">电话客服</a>
      <div class="online-service" @click="jumpOnlineServiceApp">
        <img src="./img/headset.png" alt="在线客服图片">
        <span>在线客服</span>
      </div>
    </div>
  </div>
</template>

<script>
import cellItem from '@/components/cell/cell'
export default {
  name: 'service-center',

  components: {
    cellItem
  },

  data() {
    return {
      showFrame: false,
      showContent: true
    }
  },

  mounted() {
    console.log(this.$bridge)
  },

  methods: {
    jumpChargeFeedBackApp() {
      this.$callHandler('chargeFeedBack')
      this.sensorsData('serviceCenterClickChargeIssue')
    },
    jumpCarFeedBackApp() {
      this.$callHandler('carFeedBack')
      this.sensorsData('serviceCenterClickCarIssue')
    },
    jumpNewbie() {
      this.$router.push({
        name: 'newUserHelp'
      })
      this.sensorsData('serviceCenterClickNewbie')
    },
    // jumpChargingRules() {
    //   this.$router.push({
    //     name: 'chargingRules'
    //   })
    //   this.sensorsData('serviceCenterClickPriceRule')
    // },
    jumpGuide() {
      this.$router.push({
        name: 'serviceGuide'
      })
      this.sensorsData('serviceCenterClickCarGuide')
    },
    jumpFeedback() {
      this.$router.push({
        name: 'serviceFeedback'
      })
      this.sensorsData('serviceCenterClickSuggestion')
    },

    jumpMoreQuestionApp() {
      this.$callHandler('moreQuestion')
      this.sensorsData('serviceCenterClickFAQ')
    },
    jumpOnlineServiceApp() {
      this.$callHandler('serviceChat')
      this.sensorsData('serviceCenterClickOnlineService')
    },
    // 神侧埋点
    sensorsData(name) {
      window.sa.track(name)
    }
  }
}
</script>
<style lang="scss">
$marginTop: 2.67vw;
#service-center {
  // transform: translate3d(0, 0, 0); //css3动画渲染加速
  // backface-visibility: hidden; //隐藏动画
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  display: flex;
  flex-direction: column;
  .full {
    width: 100%;
    height: 100%;
    overflow: auto;
    z-index: 999;
  }
  h1 {
    padding-top: 4.266666666666667vw;
    font-size: 4.8vw;
    padding: 4.266666666666667vw 5.3% 0 5.3%;
    background: #ffffff;
    color: #3d3d3d;
    // letter-spacing: 2px;
    font-weight: bold;
  }
  .upper-part {
    flex: 1;
    overflow-y: scroll;
    // margin-bottom: 2vw;
    .title {
      width: 100%;
    }
    // 顶部
    .top-content {
      display: flex;
      width: 100%;
      height: 30.133333333333333vw;
      background: #ffffff;
      > div {
        display: flex;
        width: 50%;
        margin: auto;
        justify-content: space-between;
        .breakdown {
          text-align: center;
          img {
            height: 13.333333333333334vw;
            width: 13.333333333333334vw;
          }
          p {
            white-space: nowrap;
            font-size: 3.466666666666667vw;
            color: #3d3d3d;
          }
        }
      }
    }
    //   中间
    .center-content {
      margin-top: $marginTop;
      > div {
        background: $color-button-white;
        .last-item {
          margin-top: $marginTop;
        }
      }
    }
  }

  //   底部
  .under-part {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 20vw;
    padding: 0 5.3%;
    background: #ffffff;
    margin-top: 1vw;
    > a,
    div {
      white-space: nowrap;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 58.7%;
      font-size: 4.266666666666667vw;
      color: #3d3d3d;
      border-radius: 0.5333333333333333vw;
    }
    .tel-service {
      width: 30.666666666666668vw;
      border: 1px solid #979797;
      a {
        width: 100%;
        height: 100%;
      }
      &:active {
        opacity: 0.6;
        background-color: #000;
        border-color: #000;
        color: #ffffff;
        outline: none;
      }
    }
    .online-service {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 53.333333vw;
      background: #3d3d3d;
      &:active {
        opacity: 0.7;
      }
      img {
        width: 5.866666666666666vw;
        height: 5.866666666666666vw;
      }
      span {
        margin-left: 2.6666666666666665vw;
        color: #ffffff;
      }
    }
  }
}
</style>
