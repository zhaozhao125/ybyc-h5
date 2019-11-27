<template>
  <div class="activity-signin" @touchstart="handleTouch">
    <div class="signin-container text-center position-relative">
      <h1>天天签到 / 周周有礼</h1>
      <p class="coupon-text">
        <span class="fz-14 color-white">{{newVersion?40:70}}元工作日券包</span>
      </p>
      <p class="intro-text fz-14 color-dark">每日签到，每周累计5次，{{newVersion?'下周一自动发券30元':'下周一自动存入'}}</p>
      <div class="signin-button position-relative" :class="{signed: signed}" @click="handelClickSign">
        <div class="front face">
          <span>签到</span>
        </div>
        <div class="back face">
          <span>已签到</span>
        </div>
      </div>
      <p class="sigin-count fz-14 color-dark">
        本周累计签到 {{signinCount}} 天
        <span v-if="signinCount >= finishSigninCount">，已完成签到任务</span>
      </p>
      <div class="bottom-arrow"></div>
    </div>
    <div class="share-container">
      <div class="share-copy fz-14 text-center position-relative">
        <span class="position-relative display-inline-block">另外，分享5次再得10元工作日优惠券</span>
        <hr>
      </div>
      <div class="share-button fz-18 text-center" @click="handleClickShare">
        分享活动
      </div>
      <p class="share-count fz-16">本周累计分享{{shareCount}}次
        <span v-if="shareCount >= finishShareCount">，已完成分享任务</span>
      </p>
    </div>
    <div class="rules">
      <h2>活动说明</h2>
      <ul>
        <li v-if="newVersion">签到任务：每日可签到1次，每周累计5次即完成签到任务，下周一自动存入一张7折券，最高可抵30元</li>
        <li v-else>签到任务：每日可签到1次，每周累计5次即完成签到任务，下周一自动存入70元优惠券包（2张7折券，最高可抵30元；1张10元券，满30可用）</li>
        <li>分享任务：在完成【签到任务】的前提下，往第三方分享活动，每周累计分享5次即完成分享任务，下周一自动存入1张10元券，满20元可用</li>
        <li v-if="newVersion">完成每周任务，共计可得价值40元优惠券，优惠券有效期为4天；周周签到，周周送券</li>
        <li v-else>完成每周任务，共计可得价值80元优惠券，优惠券有效期为4天；周周签到，周周送券</li>
        <li>分享出去的活动链接，可邀请好友注册用车，朋友用车即可获得7元现金红包奖励，上不封顶，活动撞活动，现金好礼送不停</li>
      </ul>
    </div>
    <div class="my-record" @click="handleClickRecord">
      <span class="record-text">我的战绩</span>
      <img class="record-arrow" src="./img/arrow.png" alt="">
    </div>
  </div>
</template>

<script>
import { signinShareConfig } from '@/config/share.js'
export default {
  data() {
    return {
      signed: false,
      signinCount: 0,
      shareCount: 0,
      finishSigninCount: 5,
      finishShareCount: 10,
      shareFlag: false
    }
  },

  computed: {
    user() {
      return this.$store.getters.user
    },
    newVersion() {
      let targetDate = new Date(2018, 7 - 1, 16, 0, 0, 0)
      if (new Date() > targetDate) {
        return true
      }
      return false
    }
  },

  created() {
    this.$fetch('/v26/user/get-week-user-check', {
      user_id: this.user.id
    }).then(res => {
      if (res.data.data.day_check_flag == 1) {
        this.signed = true
      }
      this.signinCount = res.data.data.total_week_check_nums
      this.shareCount = res.data.data.total_week_shares_nums
      this.finishSigninCount = res.data.data.cfg.week_check_limit_muns
      this.finishShareCount = res.data.data.cfg.week_shares_limit_muns
    })
    if (this.$route.query.direction !== 'back') {
      window.sa.track('promotionSigninOpen')
    }

    if (!this.user || !this.user.id) {
      setTimeout(() => {
        this.$callHandler('getUser').then(res => {
          this.$store.commit('setUser', {
            id: res.userId,
            phone: res.phone,
            client: res.client,
            uid: res.uid,
            token: res.token,
            version: res.version
          })
          console.log('========', this.$store.getters.user)
        })
      }, 300)
    }
  },

  methods: {
    formatDate() {
      let d = new Date()
      let month = '' + (d.getMonth() + 1)
      let day = '' + d.getDate()
      let year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      return [year, month, day].join('-')
    },
    handelClickSign() {
      if (this.signed) {
        return
      }
      if (!this.user || !this.user.id) {
        this.$toast('请先登录')
        return
      }
      this.$fetch('/v26/user/check-activity', {
        user_id: this.user.id
      }).then(res => {
        this.signed = true
        this.$toast(res.data.errMsg)
        if (!res.data.errMsg.match('今天已经签到')) {
          this.signinCount++
          window.sa.track('promotionSigninSuccess', {
            promotionSigninDate: this.formatDate()
          })
        }
      })
    },
    handleClickRecord() {
      if (!this.user || !this.user.id) {
        this.$toast('请先登录')
        return
      }
      this.$router.push({
        name: 'signinRecord'
      })
    },
    handleClickShare() {
      if (!this.user || !this.user.id) {
        this.$toast('请先登录')
        return
      }
      window.sa.track('promotionSigninShare')
      let params = {
        uid: this.$store.getters.user.id,
        phone: this.$store.getters.user.phone,
        version: this.$store.getters.user.version || 270
      }
      // params.sign = getSign(params)
      let query = Object.keys(params)
        .map(item => {
          return item + '=' + params[item]
        })
        .join('&')
      let url = signinShareConfig.url + '?' + query
      this.$bridge.callHandler('callShare', {
        url: url,
        shareTitle: signinShareConfig.shareTitle,
        shareContent: signinShareConfig.shareContent,
        shareImg: signinShareConfig.shareImg
      })
      this.shareFlag = true
      setTimeout(() => {
        if (this.shareFlag) {
          this.$message({
            message: '正在分享...',
            showCancelButton: true,
            confirmButtonText: '分享完成',
            cancelButtonText: '分享取消'
          }).then(action => {
            if (action === 'confirm') {
              this.$fetch('/v26/user/update-check-activity-row', {
                user_id: this.user.id
              }).then(res => {
                this.$toast('分享成功')
                this.shareCount++
              })
            }
          })
        }
      }, 4000)
    },
    handleTouch() {
      this.shareFlag = false
    }
  }
}
</script>

<style lang="scss">
.activity-signin {
  background: #f5f5f5;
  padding-bottom: 5vw;
  .signin-container {
    background: #eaeaea;
    padding: 6vw 0;
    margin-bottom: 12vw;
    perspective: 1000px;
    h1 {
      font-size: 8vw;
      line-height: 9.8vw;
      margin: 0 0 3vw;
    }
    .coupon-text {
      margin-bottom: 4vw;
      span {
        background: #ec8282;
        padding: px2vw(3) px2vw(10);
      }
    }
    .intro-text {
      opacity: 0.5;
    }
    .signin-button {
      width: px2vw(137);
      height: px2vw(137);
      margin: 5vw auto;
      transition: all 0.5s;
      transform-style: preserve-3d;
      &.signed {
        transform: rotateY(180deg);
      }
      .face {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        box-shadow: 0 2px 4px 0 rgba(195, 194, 192, 0.5);
        backface-visibility: hidden;
        text-align: center;
        transition: all 0.2s;
        &.front {
          background-image: linear-gradient(-114deg, #ffed00 0%, #fdd000 97%);
          &:active {
            background-image: linear-gradient(
              -114deg,
              darken(#ffed00, 2%) 0%,
              darken(#fdd000, 2%) 97%
            );
          }
        }
        &.back {
          display: block;
          transform: rotateY(180deg);
          background-image: linear-gradient(-114deg, #b2b2b2 0%, #838383 100%);
        }
      }
      span {
        font-size: px2vw(20);
        color: #3d3d3d;
        line-height: px2vw(137);
      }
    }
    .bottom-arrow {
      position: absolute;
      width: 0;
      height: 0;
      bottom: -9vw;
      left: 0;
      right: 0;
      margin: auto;
      border-style: solid;
      border-width: 3vw;
      border-color: transparent;
      border-top-color: #eaeaea;
      border-top-width: 6vw !important;
    }
  }
  .share-container {
    .share-copy {
      margin-bottom: 5vw;
      span {
        z-index: 9;
        padding: 0 2vw;
        background-color: #f5f5f5;
      }
      hr {
        background-color: #979797;
        opacity: 0.3;
        position: absolute;
        width: 100%;
        height: 1px;
        border: 0;
        top: 0;
        bottom: 0;
        margin: auto;
      }
    }
    .share-button {
      background-image: linear-gradient(-179deg, #f7db57 0%, #fdd500 100%);
      box-shadow: 0 2px 4px 0 rgba(189, 182, 182, 0.5);
      border-radius: 100px;
      padding: 3vw;
      width: 80%;
      margin: 0 auto;
      &:active {
        background-image: linear-gradient(
          -114deg,
          darken(#ffed00, 2%) 0%,
          darken(#fdd000, 2%) 97%
        );
      }
    }
    .share-count {
      font-size: 16px;
      opacity: 0.7;
      text-align: center;
      margin-top: 3vw;
    }
  }
  .my-record {
    position: fixed;
    top: 9.5%;
    right: 0;
    padding: 2vw 1.5vw 2vw 3vw;
    background: #ffffff;
    box-shadow: 0 2px 4px 0 #c2c2c2;
    border-top-left-radius: px2vw(100);
    border-bottom-left-radius: px2vw(100);
    .record-text {
      font-size: px2vw(13);
      color: #9f9f9f;
    }
    .record-arrow {
      width: px2vw(10);
    }
  }
  .rules {
    padding: 0 3vw;
    margin-top: 10vw;
    h2 {
      font-size: px2vw(16);
      margin-bottom: 4vw;
    }
    ul {
      font-size: 3.2vw;
      list-style: decimal;
      padding-left: 4vw;
      opacity: 0.8;
      li {
        margin-bottom: 1vw;
      }
    }
  }
}
</style>
