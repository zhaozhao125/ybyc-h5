<template>
  <div id="receive-award" class="overflow-hidden">
    <div class="bg-content width-100 height-100 position-relative">
      <img src="./img/left-top.png" class="img-1" :class="{'move-1':moveImg}" />
      <img src="./img/right-top.png" class="img-2" :class="{'move-2':moveImg}" />
      <img src="./img/right-top.png" class="img-3" :class="{'move-3':moveImg}" />
      <img src="./img/left-top.png" class="img-4" :class="{'move-4':moveImg}" />
    </div>
    <div class="success-content flex-col align-items-center justify-content-center position-absolute margin-auto left-0 right-0 top-0 bottom-0" :class="{'scale-content':moveImg}">
      <h2>充电成功</h2>
      <span class="span-1">感谢你的参与</span>
      <span class="money flex-row justify-content-center font-bold">{{money}}</span>
      <span class="span-2">已放入钱包-红包账户</span>
      <div v-if="showFreeOrder" style="width:74%;margin:0 auto;">
        <img @click="handleGoToFreeOrder" src="@/assets/img/free-order-charge.png" v-if="showFreeOrder" alt="" class="width-100 display-block" style="margin-bottom:3vw">
        <mt-button plain>去分享</mt-button>
      </div>
      <template v-else>
        <div class="share bg-yellow public-bottom text-center color-dark" @click="goSharePage">去分享</div>
        <div class="back-home public-bottom text-center color-dark" @click="jumpBackToHome">返回首页</div>
      </template>
    </div>
  </div>

</template>
<script>
import { useChargeShare } from '@/config/share'

export default {
  name: 'receive-award',
  data() {
    return {
      moveImg: false,
      money: null,
      // 显示免单活动按钮
      showFreeOrder: false,
      orderSn: '',
      // 免单活动token
      freeOrderAccessToken: ''
    }
  },
  mounted() {
    setTimeout(() => {
      this.moveImg = true
      // 测试环境
      if (process.env.NODE_ENV !== 'production') {
        let orderSn = 'TO201808161713533413'
        this.orderSn = orderSn
        this.userAcceptPrize(orderSn, 'CO201806211750411667')
        if (this.orderSn) {
          this.checkFreeOrder(this.orderSn)
        }
      } else {
        // 线上环境
        if (this.$callHandler) {
          this.$callHandler('shortTimeChargeSuccess', {}).then(data => {
            this.userAcceptPrize(
              data.shortTimeUseCarOrderSn,
              data.chargeOrderSn
            )
            this.orderSn = data.shortTimeUseCarOrderSn
            if (this.orderSn) {
              this.checkFreeOrder(this.orderSn)
            }
          })
        }
      }
    }, 20)
  },
  methods: {
    userAcceptPrize(orderSn, chargingOrderSn) {
      this.$service
        .postUserAcceptPrize({
          orderSn: orderSn,
          chargingOrderSn: chargingOrderSn,
          awardType: 'chargingPile'
        })
        .then(res => {
          if (res.data.errCode === 0) {
            this.money = res.data.data.bonus
          }
          // if (res.data.data.showFreeorderActivity) {
          //   this.freeOrderAccessToken = res.data.data.accesstoken
          //   this.showFreeOrder = true
          // }
        })
    },
    jumpBackToHome() {
      this.$callHandler('backToHome')
    },
    goSharePage() {
      this.$callHandler('callShare', {
        url: useChargeShare.url,
        shareTitle: `我在一步用车领到了${this.money}元红包，一起来吧！`,
        shareContent: useChargeShare.shareContent,
        shareImg: useChargeShare.shareImg
      })
    },
    // 免单活动检测
    checkFreeOrder(orderSn) {
      this.$fetch('/v26/free-order-activity/check', {
        order_sn: orderSn
      }).then(res => {
        console.log('====res====', res)
        if (res.data.data.accesstoken) {
          this.freeOrderAccessToken = res.data.data.accesstoken
          console.log(
            '====this.freeOrderAccessToken====',
            this.freeOrderAccessToken
          )
          this.showFreeOrder = true
        }
      })
    },
    handleGoToFreeOrder() {
      this.$track('h5FreeOrderChargeSuccessClickFree')
      this.$router.replace({
        name: 'freeOrder',
        query: {
          orderSn: this.orderSn,
          accesstoken: this.freeOrderAccessToken
        }
      })
    }
  }
}
</script>
<style lang='scss'>
$move: 11vw;
$fontSize: 4.8vw;
$time: 0.8s;
#receive-award {
  background: #fedc01;
  .bg-content {
    img {
      transform: translate3d(0, 0, 0); //css3动画渲染加速
      backface-visibility: hidden; //隐藏动画
      transform-style: preserve-3d;
      position: absolute;
      width: 100%;
      transition: transform $time ease-out;
    }

    .img-1 {
      z-index: 10;
      top: -92vw;
      left: -42vw;
    }
    .img-2 {
      z-index: 9;
      top: -60vw;
      right: -35vw;
    }
    .img-3 {
      z-index: 11;
      bottom: -30vw;
      left: -33vw;
      transform: rotate(360deg);
    }
    .img-4 {
      z-index: 7;
      bottom: -80vw;
      right: -40vw;
      transform: rotate(360deg);
    }
    .move-1 {
      transform: translate3d(-$move, -$move, 0);
    }

    .move-2 {
      transform: translate3d($move, -$move, 0);
    }

    .move-3 {
      transform: translate3d(-$move, $move, 0);
    }

    .move-4 {
      transform: translate3d($move, $move, 0);
    }
  }

  .success-content {
    z-index: 999;
    width: 92vw;
    height: 138vw;
    background: url('./img/bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    transition: transform $time 0s;
    transform: scale(0.5);
    white-space: nowrap;
    h2 {
      margin-top: 9vw;
      font-size: 9.6vw;
    }
    .span-1 {
      font-size: $fontSize;
      margin-bottom: 5vw;
    }
    .span-2 {
      font-size: 3.7333333333333334vw;
      color: #979797;
      margin-bottom: 7vw;
    }
    .money {
      font-size: 25.6vw;
      &::after {
        content: '元';
        position: relative;
        top: 18vw;
        font-size: $fontSize;
        color: #979797;
        font-weight: normal;
      }
    }
    .public-bottom {
      width: 66vw;
      line-height: 11.733333333333333vw;
      font-size: 4.266666666666667vw;
      border-radius: 0.5333333333333333vw;
    }
    .share {
      &:active {
        background: $color-active-yellow;
      }
    }
    .back-home {
      border: 1px solid #979797;
      margin: 5.333333333333333vw 0 15.133333333333333vw 0;
      &:active {
        background: $color-gray;
        // border: none;
        color: #ffffff;
      }
    }
  }
  .scale-content {
    transform: scale(1);
  }
}
</style>
