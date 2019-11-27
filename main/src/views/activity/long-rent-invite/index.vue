<template>
  <div class="long-rent-invite">
    <div class="title text-center">
      <h2 class="fz-22">推荐好友短/长租用车</h2>
      <h1 class="fz-32">每单可得
        <strong>100元</strong>佣金</h1>
    </div>
    <div class="content">
      <div class="rules bg-white text-center">
        <h3 class="fz-16">赚佣金流程</h3>
        <ul class="fz-14 text-left">
          <li>分享专属二维码或推荐链接给好友</li>
          <li>好友领取1张300元短/长租优惠券</li>
          <li>好友使用此优惠券租车后72小时佣金发放至红包账户，可立即提现！</li>
        </ul>
        <a class="color-gray text-decoration-underline fz-14" href="#" @click.prevent="$router.push({name: 'longRentInviteRule'})">详细规则</a>
      </div>
      <div class="share-container bg-white">
        <div class="share-buttons flex-row justify-content-center">
          <div class="share-button" @click="$router.push({name: 'longRentInviteQrCode'})">
            <img src="./img/icon-qrcode.png" alt="">
            <p class="color-dark">面对面邀请</p>
          </div>
          <div class="share-button" @click="handleClickShare('wechatTimeline')">
            <img src="./img/icon-timeline.png" alt="">
            <p class="color-dark">朋友圈</p>
          </div>
          <div class="share-button" @click="handleClickShare('wechatMessage')">
            <img src="./img/icon-wechat.png" alt="">
            <p class="color-dark">微信好友</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { logo } from '@/config/share'
export default {
  data() {
    return {}
  },

  computed: {
    user() {
      return this.$store.getters.user
    },
    // 312版本新增单独的微信好友分享和微信朋友圈分享，老版本不支持该功能
    noSingleShare() {
      if (!this.$store.getters.user) {
        return true
      }
      return this.$store.getters.user.version < 312
    }
  },

  mounted() {
    this.$track('h5ShortRentInviteSrcPageOpen')
  },

  methods: {
    handleClickShare(type) {
      if (!this.user) {
        this.$toast('请先登录')
        return
      }
      let params = {
        uid: this.user.id,
        phone: this.user.phone,
        version: this.user.version,
        source: type
      }
      let query = Object.keys(params)
        .map(item => {
          return item + '=' + params[item]
        })
        .join('&')

      let url =
        'https://h5.1byongche.com/app/share-pages/long-rent-invite-share?' +
        query
      if (process.env.BUILD_ENV !== 'production') {
        url = 'https://h5.1byongche.com/app/share-pages/test/long-rent-invite-share?' + query
      }
      let shareParams = {
        url: url,
        shareTitle: '好友送你1张300元短/长租优惠券，海马月租仅需1500元！',
        shareContent: '领到即赚到，推荐好友用车每单可得100元佣金。',
        shareImg: logo
      }
      this.currentShareType = type
      if (this.noSingleShare) {
        console.log('====noSingleShare====')
        this.$callHandler('callShare', shareParams)
        // this.$track('invitationShareUrlLink')
        return
      }
      if (type == 'wechatMessage') {
        this.$callHandler('shareWechatMessage', shareParams).then(res => {
          console.log('====share wechatMessage====', res)
          if (res.result == 'success') {
            this.$toast('分享成功')
            // this.$track('invitationShareUrlLink', {
            //   invitationShareType: '微信好友'
            // })
          }
        })
        // this.$track('h5InvitationClickShare', {
        //   invitationShareType: '微信好友 '
        // })
      }
      if (type == 'wechatTimeline') {
        shareParams.shareTitle =
          '好友送你1张300元短/长租优惠券，海马月租仅需1500元！'
        this.$callHandler('shareWechatTimeline', shareParams).then(res => {
          if (res.result == 'success') {
            this.$toast('分享成功')
            // this.$track('invitationShareUrlLink', {
            //   invitationShareType: '微信朋友圈'
            // })
          }
        })
        // this.$track('h5InvitationClickShare', {
        //   invitationShareType: '微信朋友圈'
        // })
      }
    }
  }
}
</script>

<style lang="scss">
.long-rent-invite {
  background-image: url('./img/bg.png');
  background-size: contain;
  background-position: top;
  background-repeat: no-repeat;
  background-color: #ffe000;
  .title {
    color: #90663a;
    margin-top: 8vw;
  }
  .content {
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    & > div {
      box-shadow: 0 6px 12px 0 rgba(170, 109, 49, 0.5);
      width: 90%;
      margin: 0 auto 4vw;
    }
    .rules {
      padding: 0 5vw 2vw;
      h3 {
        text-align: center;
        width: 32.5vw;
        padding: 1vw 0;
        background-image: linear-gradient(-182deg, #ffea00 0%, #fdd000 100%);
        border-radius: 0 0 14.5px 14.5px;
        margin: 0 auto 2vw;
      }
      li {
        margin-bottom: 2vw;
      }
    }
  }
  .share-container {
    padding: 1vw 0 3vw;
    .share-buttons {
      margin-top: 3.5vw;
      .share-button {
        padding: 0 5vw;
        text-align: center;
        img {
          width: 15vw;
          margin-bottom: 1vw;
        }
      }
    }
  }
}
</style>
