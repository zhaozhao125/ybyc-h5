<template>
  <div class="my-points bg-light">
    <div class="point-info flex-row align-items-center color-white">
      <img src="./img/avator.png" alt="" class="avator">
      <div class="point-amount fz-16">
        <strong class="count-number fz-36 font-weight-normal">-</strong>积分
        <img src="./img/share.png" alt="" class="share display-inline-block" @click="handleShowShare">
      </div>
        <div class="point-rule position-absolute fz-12" @click="$router.push({name: 'pointRule'})">积分规则</div>
      </div>
      <section class="earn-point">
        <header>
          <div class="header-title">
            <img src="./img/icon-earn.png" alt="">
            <h3>如何赚取积分</h3>
          </div>
          <div class="right-text" @click="$router.push({name: 'pointRecord'})">积分记录</div>
        </header>
        <ul>
          <li>
            <div class="list-item">
              <div class="item-title">
                <p>每日签到</p>
                <p>每日签到每日送分</p>
              </div>
              <div class="item-point">
                <img src="./img/coin.png" alt="">
                <span>+1</span>
              </div>
              <button :disabled="stateSignIn" @click="handleSignIn" class="item-btn plain-button">
                <span v-if="stateSignIn">已签到</span>
                <span v-else>签到</span>
              </button>
            </div>
          </li>
          <li>
            <div class="list-item">
              <div class="item-title">
                <p>分时租车消费</p>
                <p>按每单实际支付金额发放</p>
              </div>
              <div class="item-point">
                <img src="./img/coin.png" alt="">
                <span>+N</span>
              </div>
              <button @click="handleUseCar" class="item-btn plain-button">去用车</button>
            </div>
          </li>
          <li>
            <div class="list-item">
              <div class="item-title">
                <p>订单评价</p>
                <p>支付订单后24小时内评价发放</p>
              </div>
              <div class="item-point">
                <img src="./img/coin.png" alt="">
                <span>+5</span>
              </div>
              <button @click="handleOrderEval" class="item-btn plain-button">去评价</button>
            </div>
          </li>
          <li>
            <div class="list-item">
              <div class="item-title">
                <p>邀请好友认证</p>
                <p>每有一个好友进行认证</p>
              </div>
              <div class="item-point">
                <img src="./img/coin.png" alt="">
                <span>+30</span>
              </div>
              <button @click="handleInvite" class="item-btn plain-button">去邀请</button>
            </div>
          </li>
          <!-- <li>
          <div class="list-item">
            <div class="item-title">
              <p>完善个人资料</p>
              <p>填写完整资料后一次性发放</p>
            </div>
            <div class="item-point">
              <img src="./img/coin.png" alt="">
              <span>+12</span>
            </div>
            <button :disabled="stateUserInfo" @click="handleUserInfo" class="item-btn plain-button">
              <span v-if="stateUserInfo">已完善</span>
              <span v-else>待完善</span>
            </button>
          </div>
        </li> -->
        </ul>
      </section>
      <section class="use-point">
        <header>
          <div class="header-title">
            <img src="./img/icon-use.png" alt="">
            <h3>如何使用积分</h3>
          </div>
        </header>
        <div class="content flex-row justify-content-between align-items-center" @click="$router.push({name: 'pointMall'})">
          <div>
            <h4 class="fz-14 color-dark font-weight-normal">优惠券包、后续更多礼品</h4>
            <p class="fz-12 color-gray">想换什么都随你</p>
          </div>
          <img src="./img/usecoin_pic.png" alt="">
      </div>
      </section>
      <mt-popup v-model="shareVisible" position="bottom" class="overflow-hidden width-100">
        <div class="share-container bg-white">
          <div class="share-title fz-14 text-center color-gray">分享至</div>
          <div class="share-buttons flex-row justify-content-center">
            <div class="share-button text-center" @click="handleClickShare('wechatTimeline')">
              <img src="@/assets/img/icon-timeline.png" alt="">
              <p class="color-dark">朋友圈</p>
            </div>
            <div class="share-button text-center" @click="handleClickShare('wechatMessage')">
              <img src="@/assets/img/icon-wechat.png" alt="">
              <p class="color-dark">微信好友</p>
            </div>
          </div>
        </div>
      </mt-popup>
    </div>
</template>

<script>
import CountUp from 'countup.js'
import { encrypto } from '@/util/common'
import { Popup } from 'mint-ui'
export default {
  name: 'my-points',

  components: {
    mtPopup: Popup
  },

  data() {
    return {
      userPoints: 0,
      stateSignIn: false,
      shareVisible: false
    }
  },

  computed: {
    // 312版本新增单独的微信好友分享和微信朋友圈分享，老版本不支持该功能
    noSingleShare() {
      if (!this.$store.getters.user) {
        return true
      }
      return this.$store.getters.user.version < 312
    }
  },

  mounted() {
    this.getUserPoints()
    this.$service.getUserSignState().then(res => {
      if (res.data.data.activitySignCount > 0) {
        this.stateSignIn = true
      }
    })
    this.$track('h5UserPointsPageOpen')

    this.$bridge.registerHandler('refreshUserPoints', res => {
      this.getUserPoints()
    })
  },

  watch: {
    $route(route) {
      if (route.query.routeFrom == 'pointMall') {
        this.getUserPoints()
      }
    }
  },

  methods: {
    getUserPoints() {
      this.$service.getUserPoints().then(res => {
        console.log('====res====', res)
        let newUserPoints = res.data.data.integralAvailable
        var numAnim = new CountUp(
          this.$el.querySelector('.count-number'),
          this.userPoints,
          newUserPoints,
          0, // 0位小数
          2, // 动画时间
          {
            useEasing: true,
            useGrouping: false, // 是否数字加逗号分隔
            separator: ',',
            decimal: '.'
          }
        )
        if (!numAnim.error) {
          numAnim.start()
        } else {
          console.error(numAnim.error)
        }

        this.userPoints = newUserPoints
      })
    },
    handleSignIn() {
      this.$service.signFromUserPoints().then(res => {
        this.stateSignIn = true
        this.$toast('签到成功' || res.data.errMsg)
        this.getUserPoints()
      })
    },
    handleUseCar() {
      this.$callHandler('backToHome')
    },
    handleOrderEval() {
      this.$callHandler('goToOrderList')
    },
    handleInvite() {
      this.$router.push({
        name: 'invite'
      })
    },
    getShareParams() {
      let url =
        'https://h5.1byongche.com/app/share-pages/user-points-share/?param=' +
        encrypto(String(this.userPoints), 123, 25) // 分享页面的URL
      if (process.env.BUILD_ENV !== 'production') {
        url =
          'http://test.1byongche.cn/h5/app/share-pages/user-points-share/?param=' +
          encrypto(String(this.userPoints), 123, 25) // 分享页面的URL
      }
      return {
        url: url,
        shareTitle: '晒晒我的一步用车积分', // 分享标题
        shareContent: '晒积分，看看有谁比我更强', // 分享内容
        shareImg: 'https://h5.1byongche.com/static/img/logo.png' // 分享图标
      }
    },
    handleShowShare() {
      if (this.noSingleShare) {
        let shareParams = this.getShareParams()
        this.$callHandler('callShare', shareParams)
        return
      } else {
        this.shareVisible = true
      }
      this.$track('h5UserPointsClickShare')
    },
    handleClickShare(type) {
      let shareParams = this.getShareParams()
      if (type == 'wechatMessage') {
        this.$callHandler('shareWechatMessage', shareParams).then(res => {
          if (res.result == 'success') {
            this.$toast('分享成功')
          }
        })
      }
      if (type == 'wechatTimeline') {
        this.$callHandler('shareWechatTimeline', shareParams).then(res => {
          if (res.result == 'success') {
            this.$toast('分享成功')
          }
        })
      }
      this.shareVisible = false
      this.$track('h5UserPointsClickShareIcon', {
        userPointShareType: type == 'wechatTimeline' ? '朋友圈' : '微信好友'
      })
    }
  }
}
</script>

<style lang="scss">
.my-points {
  .point-info {
    padding: 8.1vw;
    background-image: url('./img/bg.png');
    background-size: cover;
    .avator {
      width: px2vw(70);
      margin-right: 5vw;
    }
    .point-amount {
      img {
        width: 8vw;
        vertical-align: bottom;
        padding: 0.8vw;
      }
    }
    .point-rule {
      background: rgba(245, 166, 35, 0.3);
      border-radius: 100px;
      right: 5vw;
      top: 4vw;
      padding: 0.8vw 3vw;
    }
  }
  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .item-title {
      width: 60%;
      p:first-of-type {
        font-size: px2vw(14);
        color: $color-dark;
      }
      p:last-of-type {
        font-size: px2vw(12);
      }
    }
    .item-point {
      img {
        width: px2vw(16);
      }
      span {
        font-size: px2vw(14);
        color: #fdc600;
      }
    }
    .item-btn {
      width: px2vw(58);
      font-size: px2vw(12);
      border: 1px solid #3d3d3d;
      border-radius: 100px;
      text-align: center;
      height: px2vw(23);
      background: #fff;
      padding: 0;
      &:disabled {
        background: #d8d8d8;
        color: #fff;
        border: 0;
      }
    }
  }
  .use-point {
    .content {
      padding: 4vw 3vw;
      h4 {
        margin-bottom: 1vw;
      }
      img {
        width: px2vw(50);
      }
    }
  }
  .share-container {
    padding: 4vw 0 6vw;
    .share-buttons {
      margin-top: 4vw;
      .share-button {
        padding: 0 5vw;
        img {
          width: 15vw;
          margin-bottom: 1vw;
        }
      }
    }
  }
}
</style>
