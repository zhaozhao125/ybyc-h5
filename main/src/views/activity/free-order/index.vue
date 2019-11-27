<template>
  <div class="free-order">
    <div class="white-bg bg-white position-absolute top-0 left-0 width-100"></div>
    <div class="free-order-wrapper text-center position-relative zindex-99">
      <h2 class="fz-18">本次用车消费</h2>
      <div class="order-money fz-14">
        <strong>{{orderMoney|moneyFilter}}</strong>
        元
      </div>
      <!-- 红包 -->
      <div class="red-packet position-relative overflow-hidden" :class="'status-'+currentStatus">
        <div class="free-progress overflow-hidden position-relative zindex-99">
          <div class="free-progress-container">
            <p class="fz-14" v-if="currentStatus=='start'||currentStatus=='timeout'">已有{{friendsAmount}}个好友帮你免单，贡献{{friendsMoney|moneyFilter}}元</p>
            <p class="fz-14" v-else-if="currentStatus=='finished'||currentStatus=='received'">已有{{friendsAmount}}个好友帮你免单成功</p>
            <div class="progress-bar position-relative overflow-hidden">
              <div class="progress-current position-absolute height-100 left-0 top-0" :style="`width:${percent}%`"></div>
            </div>
            <div class="progress-money fz-14 flex-row justify-content-between color-white margin-auto">
              <span class="money-start">0.00元</span>
              <span class="money-end">{{orderMoney|moneyFilter}}元</span>
            </div>
          </div>
        </div>

        <div class="packet-bottom-container position-relative overflow-hidden zindex-99">
          <div class="red-packet-cover width-100 position-absolute">
            <div class="chai position-absolute left-0 right-0 margin-auto rounded-circle font-bold" :class="{loading: openLoading}" @click="handleOpenRedPacket">
              <div class="front face">
                <span>拆</span>
              </div>
              <div class="back face">
                <span>￥</span>
              </div>
            </div>
          </div>
          <p class="fz-14" v-if="currentStatus=='start'">
            当好友帮免单成功后，即可拆红包<br>（分享给未注册好友，他们的贡献值会很高~）
          </p>
          <p class="fz-14" v-else-if="currentStatus=='finished'">免单成功<br>马上拆红包吧</p>
          <div class="time-end fz-16" v-if="currentStatus=='start'">
            <span class="display-inline-block bg-white color-dark">{{hour}}</span>小时
            <span class="display-inline-block bg-white color-dark">{{minite}}</span>分钟
            <span class="display-inline-block bg-white color-dark">{{second}}</span>秒结束
          </div>
          <div v-if="currentStatus=='timeout'" class="end-copy color-white fz-24 position-absolute width-100">活动已结束，下次加油吧</div>
          <div v-if="currentStatus=='received'" class="finished-container">
            <h3>{{redPacketMoney}}元</h3>
            <div class="fz-24 color-white">现金已到账</div>
            <p class="fz-14 color-white">请在一步用车APP中，打开“我的钱包”，<br>进入“红包”中查看</p>
          </div>
        </div>
      </div>
      <mt-button v-if="currentStatus=='start'" @click="handleClickShare">呼朋唤友帮我免单</mt-button>
      <a class="fz-14 display-block text-decoration-underline" :style="'color: #6A9BE4;margin-top:'+(currentStatus=='start'?'3vw':'10vw')" href="#" @click.prevent="$router.push({name: 'freeOrderFriendsRank', params: {id:activityId}})">查看好友贡献榜</a>
    </div>
    <div @click="$router.push({name: 'freeOrderRules'})" class="free-rules text-center fz-12 color-white position-fixed right-0 zindex-99">免单攻略</div>
    <!-- 分享遮罩 -->
    <mt-popup v-model="shareVisible" position="bottom" class="share-overlay width-100">
      <div class="share-container width-100 bottom-0 text-center bg-white">
        <h3 class="fz-18">分享到</h3>
        <div class="share-items flex-row">
          <div class="share-item flex-1" @click="handleShareTimeline">
            <img src="./img/icon-timeline.png" alt="">
            <span class="display-block">朋友圈</span>
          </div>
          <div class="share-item flex-1" @click="handleShareFriend">
            <img src="./img/icon-wechat.png" alt="">
            <span class="display-block">微信好友</span>
          </div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { Popup } from 'mint-ui'
export default {
  name: 'free-order-index',

  components: {
    mtPopup: Popup
  },

  data() {
    return {
      // 订单金额
      orderMoney: '-',
      // 好友数
      friendsAmount: '-',
      // 好友总贡献金额
      friendsMoney: '-',
      // 活动剩余时间
      leftTime: 9999,
      // 当前状态 start开始/finished完成未领取/received完成已领取/timeout超时
      currentStatus: '',
      // 当前进度百分比
      percent: 0,
      // 倒计时计时器
      countdownTimer: null,
      hour: '00',
      minite: '00',
      second: '00',
      openLoading: false,
      token: '',
      shareVisible: false,
      // 当前活动ID
      activityId: '',
      // 拆红包获得的金额
      redPacketMoney: '-',
      shortToken: '',
      // 当前时间（用于判断是否浏览器切后台）
      currentTime: null
    }
  },

  computed: {
    user() {
      return this.$store.getters.user
    }
  },

  created() {
    this.orderSn = this.$route.query.orderSn
    if (this.$route.query.accesstoken) {
      this.token = this.$route.query.accesstoken
      this.getCurrentData()
    } else {
      this.$fetch('/v26/free-order-activity/check', {
        order_sn: this.orderSn
      })
        .then(res => {
          console.log('====res====', res)
          let result = res.data.data
          return result.accesstoken
        })
        .then(token => {
          if (token) {
            this.token = token
            this.getCurrentData()
          } else {
            this.$toast('不符合发起免单条件')
          }
        })
    }
  },

  mounted() {},

  methods: {
    getCurrentData() {
      this.$fetch('/v26/free-order-activity/generate-free-order', {
        user_phone: this.user.phone,
        order_sn: this.orderSn,
        accesstoken: this.token
      }).then(res => {
        let result = res.data.data.rowActivity
        if (result.free_activity_status == 'finshed') {
          result.free_activity_status = 'finished'
        }
        this.orderMoney = result.amount
        this.friendsAmount = result.userCount
        this.friendsMoney = result.free_activity_consume
        this.leftTime = result.leftTime
        this.currentStatus = result.free_activity_status
        this.percent = result.percent
        this.activityId = result.id

        if (this.currentStatus == 'start') {
          this.refreshTimer()
          if (this.countdownTimer) {
            clearInterval(this.countdownTimer)
          }
          this.currentTime = Date.now()
          this.countdownTimer = setInterval(() => {
            this.leftTime--
            if (Date.now() - this.currentTime > 2000) {
              console.log('====timeout====')
            }
            // 如果判断程序切出时间大于2秒，或者计时结束，则重新请求
            if (Date.now() - this.currentTime > 2000 || this.leftTime <= 0) {
              this.getCurrentData()
              clearInterval(this.countdownTimer)
              this.countdownTimer = null
              return
            }
            this.currentTime = Date.now()
            this.refreshTimer()
          }, 1000)
        } else if (this.currentStatus == 'received') {
          this.redPacketMoney = result.amount
        }

        // 预加载截图用的webview
        let shareURL
        let shortToken = res.data.data.accesstoken
        this.shortToken = shortToken
        if (process.env.BUILD_ENV !== 'production') {
          shareURL = `http://test.1byongche.cn/h5/app/main/#/activity/free-order/share-timeline?token=${shortToken}`
        } else {
          shareURL = `https://h5.1byongche.com/app/main/#/activity/free-order/share-timeline?token=${shortToken}`
        }
        console.log('====shareURL====', shareURL)
        this.$callHandler('loadScreenShotPage', {
          url: shareURL
        })
      })
    },
    addZero(val) {
      if (String(val).length == 1) {
        return '0' + val
      }
      return val
    },
    refreshTimer() {
      this.second = this.addZero(this.leftTime % 60)
      this.minite = this.addZero(Math.floor(this.leftTime / 60) % 60)
      this.hour = this.addZero(Math.floor(this.leftTime / 3600) % 60)
    },
    // 打开红包
    handleOpenRedPacket() {
      if (this.currentStatus == 'finished') {
        this.openLoading = true
        this.$fetch('/v26/free-order-activity/get-red-packet', {
          idActivity: this.activityId
        })
          .then(res => {
            console.log('====res====', res)
            this.openLoading = false
            this.currentStatus = 'received'
            this.redPacketMoney = res.data.data.amount
            this.$track('h5FreeOrderOpenRedPacket', {
              freeOrderRedPacketMoney: Number(this.redPacketMoney)
            })
          })
          .catch(err => {
            this.openLoading = false
            console.dir(err, 'err')
            if (
              err.errCode == -1 &&
              err.data.rowActivity &&
              err.data.rowActivity.amount
            ) {
              this.currentStatus = 'received'
              this.redPacketMoney = err.data.rowActivity.amount
            }
          })
      }
    },
    appUpgrade() {
      if (this.user.client == 1) {
        // iOS
        this.$message({
          message: '需要升级到3.1.3及以上版本才能使用哦~',
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: '我要升级'
        }).then(cmd => {
          if (cmd == 'confirm') {
            location.href =
              'https://a.app.qq.com/o/simple.jsp?pkgname=com.usercar.yongche'
          }
        })
      } else {
        // android
        if (this.user.version >= 312) {
          this.$message({
            message: '需要升级到3.1.3及以上版本才能使用哦~',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: '我要升级'
          }).then(cmd => {
            if (cmd == 'confirm') {
              this.$callHandler('appUpgrade')
            }
          })
        } else {
          this.$message({
            message: '需要升级到3.1.3及以上版本才能使用哦~',
            showConfirmButton: true,
            showCancelButton: false,
            confirmButtonText: '我知道了'
          })
        }
      }
    },
    handleClickShare() {
      if (this.user.version < 313) {
        this.appUpgrade()
        return
      }
      this.shareVisible = true
      this.$track('h5FreeOrderClickShareButton')
    },
    // 分享朋友圈
    handleShareTimeline() {
      this.$track('h5FreeOrderClickShareIcon', {
        freeOrderShareType: '朋友圈'
      })
      this.$callHandler('shareTimeLineImage').then(res => {
        console.log('====shareTimeLineImage====', res)
        this.$toast(res.messege || res.message)
        this.$track('h5FreeOrderShareSuccess', {
          freeOrderShareType: '朋友圈',
          freeOrderShareResult: res.messege || res.message
        })
      })
      this.shareVisible = false
    },
    // 分享微信好友
    handleShareFriend() {
      this.$track('h5FreeOrderClickShareIcon', {
        freeOrderShareType: '微信好友'
      })
      this.$callHandler('shareMiniProgram', {
        // 兼容低版本的网页链接
        webpageUrl:
          'https://h5.1byongche.com/app/static/miniprogram-share-tip/',
        // 不传默认为0 正式版0；测试版1；体验版2
        miniprogramType: process.env.BUILD_ENV === 'production' ? 0 : 2,
        // 小程序页面路径
        path: `/free-order/index/index?accesstoken=${this.shortToken}&uid=${
          this.$store.getters.user.id
        }&shareSource=friend`,
        title: 'hey，朋友！帮我免个单',
        description: '',
        // 封面图片
        thumbBmpUrl:
          'https://h5.1byongche.com/static/img/free-order-mp-share.png'
      }).then(res => {
        console.log('====shareMiniProgram====', res)
        this.$toast(res.messege || res.message)
        this.$track('h5FreeOrderShareSuccess', {
          freeOrderShareType: '微信好友',
          freeOrderShareResult: res.messege || res.message
        })
      })
      this.shareVisible = false
    }
  },

  filters: {
    moneyFilter(value) {
      if (isNaN(value)) {
        return '-'
      }
      return Number(value).toFixed(2)
    }
  },

  beforeDestroy() {
    console.log(
      '====beforeDestroy====',
      this.$route.query.direction,
      this.$route
    )
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
    }
  }
}
</script>

<style lang="scss">
.free-order {
  background: #f7f7f7;
  .white-bg {
    box-shadow: 0 2px 4px 0 rgba(172, 172, 172, 0.5);
    height: px2vw(229);
  }
  .free-order-wrapper {
    width: 85%;
    margin: 4vw auto;
  }
  .order-money {
    margin-top: 1vw;
    margin-bottom: 3.3vw;
    strong {
      font-size: px2vw(40);
    }
  }
  .red-packet {
    background-image: linear-gradient(-199deg, #f85937 0%, #f85937 96%);
    box-shadow: 0 2px 12px 0 rgba(105, 17, 17, 0.5);
    border-radius: px2vw(12);
    margin-bottom: 5vw;
    .free-progress {
      background: #fa775b;
      .free-progress-container {
        width: 93%;
        margin: auto;
        border-bottom: 2px solid #f96040;
        padding: 8vw 0 6vw;
      }
      p {
        color: #fff;
      }
      .progress-bar {
        height: px2vw(10);
        margin: 4vw auto 1vw;
        background: #fff;
        border-radius: 100px;
        .progress-current {
          transition: width 0.8s cubic-bezier(0.22, 0.61, 0.36, 1);
          background-color: $color-yellow;
          border-radius: 100px;
        }
      }
    }
    .red-packet-cover {
      height: 78vw;
      background-color: #fa775b;
      border-bottom-right-radius: 50%;
      border-bottom-left-radius: 50%;
      transform: translateY(-54%);
      box-shadow: 0 0 1vw rgba(0, 0, 0, 0.5);
      z-index: -1;
      .chai {
        width: px2vw(92);
        height: px2vw(92);
        bottom: -11vw;
        background: #fbb785;
        box-shadow: 0 px2vw(2) 4px 0 rgba(0, 0, 0, 0.5);
        border: px2vw(8) solid #feedd7;
        line-height: px2vw(76);
        font-size: px2vw(36);
        color: #b8614f;
        transition: all 0.5s;
        transform-style: preserve-3d;
        .face {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          box-shadow: 0 2px 4px 0 rgba(195, 194, 192, 0.5);
          backface-visibility: hidden;
          text-align: center;
          transition: all 0.2s;
          &.back {
            display: block;
            transform: rotateY(180deg);
          }
        }
        &.loading {
          animation: chai-rotate 1s linear infinite;
        }
      }
    }
    .packet-bottom-container {
      background-image: url('./img/car.png');
      background-repeat: no-repeat;
      background-position: right bottom;
      background-size: 42vw;
      height: 68vw;
      > p {
        color: rgb(99, 0, 0);
        margin-top: 6vw;
      }
      .time-end {
        margin-top: 39vw;
        color: #e8e6e6;
        span {
          padding: 0.3vw 0.6vw;
          border-radius: 1vw;
          margin-left: 1vw;
          margin-right: 1vw;
        }
      }
      .end-copy {
        text-shadow: 0 2px 4px rgba(84, 80, 80, 0.5);
        bottom: 7vw;
      }
      .finished-container {
        h3 {
          font-size: px2vw(55);
          color: #fff7df;
          text-shadow: 0 px2vw(2) 4px rgba(46, 46, 46, 0.5);
          margin-top: 10vw;
          line-height: 1;
        }
        div {
          margin-bottom: 4vw;
          text-shadow: 0 2px 4px rgba(84, 80, 80, 0.5);
        }
      }
    }
    &.status-finished {
      .red-packet-cover .chai {
        border-color: #fff;
        background-color: $color-yellow;
        color: #912d18;
      }
    }
    &.status-timeout {
      background: #bababa;
      box-shadow: 0 2px 12px 0 rgba(104, 102, 102, 0.5);
      .free-progress {
        background: #eeeeee;
        // border-bottom: 2px solid #d6d5d5;
        .free-progress-container {
          border-color: #e6e5e5;
        }
        p {
          color: $color-dark;
        }
      }
      .red-packet-cover {
        background: #eeeeee;
        .chai {
          border-color: #d9d9d9;
          background-color: #cac6c3;
          color: #928a88;
        }
      }
      .progress-money {
        color: $color-dark;
      }
    }
    &.status-received {
      .free-progress {
        background-color: transparent;
        border-bottom: 2px solid #f74c27;
      }
      .red-packet-cover {
        display: none;
      }
    }
  }
  .free-rules {
    background: #bcbcbc;
    top: 5vw;
    border-top-left-radius: 100px;
    border-bottom-left-radius: 100px;
    padding: 1vw 2vw 1vw 3vw;
  }
  .share-overlay {
    .share-container {
      padding: 3vw 0 4vw;
    }
    .share-item {
      img {
        width: 12vw;
        margin: 3vw 0 2vw;
      }
    }
  }
}

@keyframes chai-rotate {
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(360deg);
  }
}
</style>
