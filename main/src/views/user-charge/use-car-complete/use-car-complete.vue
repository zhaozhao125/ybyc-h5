<template>
  <div id="use-car-complete" class="flex-col align-items-center">
    <img src="./img/success.png" alt="充电完成图标" class="success-icon">
    <span class="finish-tip fz-18 color-dark">行程已完成</span>
    <span class="tip fz-14 color-gray-light">绿色低碳生活，一步与你同行</span>
    <img @click="handleGoToFreeOrder" src="@/assets/img/free-order.png" v-if="showFreeOrder" alt="" style="width:93%">
    <mt-button v-else @click="jumpBackToHome" type="default" plain class="return-home">返回首页</mt-button>
    <div v-if="adList.length" class="activity-title flex-row justify-content-center align-items-center">
      <span class="line"></span>
      <span>最新活动</span>
      <span class="line"></span>
    </div>
    <!-- 活动 -->
    <div class="charge-content text-center">
      <img v-if="isScanCodeCharge" src="./img/activity-1.png" alt="扫码充电" @click='jumpScanCodeCharge'>
      <img v-if="adList.length" :src="adList[0].image" alt="" @click="handleClickAd(adList[0])">
      <img v-if="adList.length>1 && !isScanCodeCharge" :src="adList[1].image" alt="" @click="handleClickAd(adList[1])">
    </div>
    <div class="free-popup position-absolute top-0 left-0 right-0 bottom-0 flex-col justify-content-center align-items-center bg-mask" v-if="freePopupVisible" @click="handleClickPopup">
      <div class="free-container position-relative">
        <img class="width-100" src="./img/red-packet.png" alt="">
        <div class="text-container position-absolute top-0 left-0 width-100 text-center fz-20">
          <h4 class="fz-20">你有一个免单红包待领取</h4>
          <p class="fz-14">
            1秒即可分享给好友<br> 无需下载App，1秒即可帮砍单成功
            <br> 红包可提现噢
          </p>
          <img @click="handleGoToFreeOrder" src="./img/open-packet.png" alt="">
        </div>
      </div>
      <img @click="freePopupVisible=false" class="close-popup" src="@/assets/img/close.png" alt="">
    </div>
  </div>
</template>
<script>
import { getCurrentCityCode } from '@/util/common.js'
export default {
  data() {
    return {
      isScanCodeCharge: false,
      // 显示免单活动按钮
      showFreeOrder: false,
      orderSn: '',
      // 免单活动token
      freeOrderAccessToken: '',
      // 显示免单活动弹出层
      freePopupVisible: false,
      adList: []
    }
  },
  mounted() {
    if (process.env.NODE_ENV !== 'production') {
      let sn = 'TO201808081451126256'
      this.getFindBySn(sn)
    } else if (this.$callHandler) {
      this.$callHandler('getReturnStationSn', {}).then(sn => {
        this.getFindBySn(String(sn))
      })
    }
  },
  methods: {
    getFindBySn(sn) {
      getCurrentCityCode(this)
        .then(cityCode => {
          console.log('====cityCode====', cityCode)
          this.getAdList(sn, cityCode)
        })
        .catch(err => {
          console.log('====err====', err)
          this.getAdList(sn)
        })
    },
    getAdList(stationSn, cityId = '') {
      this.$service.getFindBySn(stationSn, cityId).then(res => {
        if (res.data.errCode === 0) {
          console.log(res.data.data.showTip)
          this.isScanCodeCharge = res.data.data.showTip
          this.adList = res.data.data.advRows || []
        }
        this.orderSn = res.data.data.order_sn
        if (res.data.data.showFreeorderActivity) {
          this.freeOrderAccessToken = res.data.data.accesstoken
          this.showFreeOrder = true
          if (this.$route.query.noFree != 1) {
            this.freePopupVisible = true
            this.$router.replace({
              path: '/use-car-complete',
              query: {
                noFree: 1
              }
            })
          }
        }
      })
    },
    jumpBackToHome() {
      this.$callHandler('backToHome')
    },
    jumpScanCodeCharge() {
      this.$callHandler('toScanCharge')
    },
    // 邀请好友
    jumpInvite() {
      this.handleUrl(
        'http://test.1byongche.cn/h5/app/main/#/invite?from=finishorder',
        'https://h5.1byongche.com/app/invite/#/?from=finishorder'
      )
    },
    // 每周三单
    jumpThreeOrders() {
      this.handleUrl(
        'http://test.1byongche.cn/h5/app/main/#/activity/three-orders',
        'https://h5.1byongche.com/app/main/#/activity/three-orders'
      )
    },
    // 处理url
    handleUrl(devUrl, depUrl) {
      window.location.href = process.env.BUILD_ENV === 'test' ? devUrl : depUrl
    },
    // 跳转到免单活动
    handleGoToFreeOrder() {
      this.$track('h5FreeOrderUseCarCompleteClickFree')
      this.$router.push({
        name: 'freeOrder',
        query: {
          orderSn: this.orderSn,
          accesstoken: this.freeOrderAccessToken
        }
      })
    },
    handleClickPopup(e) {
      console.log('====e====', e)
      if (e.target.classList.contains('free-popup')) {
        this.freePopupVisible = false
      }
    },
    // 打开广告链接
    handleClickAd(ad) {
      let url = ad.advertisement_link
      this.$track('appAdvertisementClick', {
        advertisementId: Number(ad.advertisement_id),
        advertisementTitle: ad.advertisement_title,
        advertisementType: ad.advertisement_type_txt,
        distinctId: this.$store.getters.user.id
      })
      setTimeout(() => {
        window.location.href = url
        // if (
        //   url.match('test.1byongche.cn/h5/app/main/#/') ||
        //   url.match('h5.1byongche.com/app/main/#/')
        // ) {
        //   this.$router.push({
        //     path: url.split('#').pop()
        //   })
        // } else {
        //   // window.open(url)
        //   window.location.href = url
        // }
      }, 100)
    }
  }
}
</script>
<style lang="scss">
#use-car-complete {
  * {
    flex-shrink: 0;
  }
  .success-icon {
    width: 24vw;
    margin: 6.9vw 0 6.9vw 0;
  }
  .return-home {
    width: 94.66vw;
  }

  .tip {
    margin-top: 1.8667vw;
    margin-bottom: 4.8vw;
  }
  .activity-title {
    margin: 5.33333vw 0 2.6666vw 0;
    .line {
      opacity: 0.1;
      width: 11.466667vw;
      height: 1px;
      background: #979797;
    }
    span {
      opacity: 0.5;
      &:nth-child(2) {
        padding: 0 3vw;
        font-size: 3.73333334vw;
        color: #a1a1a1;
      }
    }
  }
  .charge-content {
    img {
      border-radius: 1vw;
      width: 93.8666666vw;
      height: 28.26666666vw;
      margin-bottom: 2.66665vw;
      object-fit: contain;
      &:first-child {
        margin-top: 1vw;
      }
      &:last-child {
        margin-bottom: 11.46666667vw;
      }
    }
  }
  .free-popup {
    .free-container {
      width: 73.6%;
      .text-container {
        color: #ffcf96;
        h4 {
          margin-top: 11vw;
        }
        p {
          color: #ffcf96;
          margin-top: 6vw;
        }
        img {
          width: 22vw;
          margin-top: 8vw;
        }
      }
    }
    .close-popup {
      width: 12vw;
      height: 12vw;
      padding: 2vw;
      margin-top: 2vw;
    }
  }
}
</style>
