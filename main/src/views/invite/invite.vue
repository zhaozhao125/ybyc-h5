<template>
  <div class="invite-page bg-light">
    <div class="invite-info text-center">
      <div class="title text-center">
        <h2 class="fz-18">邀请好友用车，即可得
          <span class="red-text">50元</span> 无门槛优惠券</h2>
        <p class="fz-16 color-dark">（完成认证20元+完成首单30元）</p>
        <!-- <p class="fz-16">好友可获得66元大礼包</p> -->
        <p>活动时间：2018.11.20-2018.12.31</p>
      </div>
      <div class="card">
        <img src="./img/card.png" alt="">
      </div>
    </div>
    <div class="share-container bg-white">
      <div class="share-buttons flex-row justify-content-center">
        <div class="share-button" @click="$router.push({name: 'invite-qrcode'})">
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
    <div class="prize-record bg-white text-center">
      <h4>
        <span class="color-dark fz-13 display-block">我的奖励记录</span>
      </h4>
      <router-link class="show-record has-arrow fz-16 color-dark" :to="{name: 'invite-record'}">
        <span>已获得奖励：{{totalReward}}元</span>
      </router-link>
    </div>
    <p v-if="noInvite" class="ps">{{noInviteText}}</p>
    <router-link class="show-rule" :to="{name: 'invite-rules'}">奖励规则</router-link>
  </div>
</template>
<script>
import { inviteShareConfig } from '@/config/share.js'
export default {
  name: 'invite',

  data() {
    return {
      totalReward: '-',
      currentShareType: ''
    }
  },

  computed: {
    noInvite() {
      if (!this.$store.getters.user) {
        return false
      }
      return this.$store.getters.user.version < 270
    },
    noInviteText() {
      let user = this.$store.getters.user
      if (user.client == 1) {
        if (Date.now() < new Date('2018/01/01')) {
          // IOS审核提示
          return '由于美国朋友们在欢度圣诞，iOS版本无法通过苹果商店审核，邀请好友功能暂不可用，将于元旦左右与大家见面，敬请期待。'
        }
        // IOS升级提示
        // return '需升级App2.7及以上版本才可参与活动，您可打开App设置页-关于我们-检查版本更新，升级最新版本。'
        return '需升级App至2.7.0版本才可参与活动，您可打开App设置页-关于我们-检查版本更新，升级最新版本。'
      }
      // 安卓升级提示
      if (user.client == 2) {
        // return '需升级App2.7及以上版本才可参与活动，您可打开App设置页-关于我们-检查版本更新，升级最新版本。'
        return '需升级App至2.7.0版本才可参与活动，您可打开App设置页-关于我们-检查版本更新，升级最新版本。'
      }
    },
    // 312版本新增单独的微信好友分享和微信朋友圈分享，老版本不支持该功能
    noSingleShare() {
      if (!this.$store.getters.user) {
        return true
      }
      return this.$store.getters.user.version < 312
    }
  },

  methods: {
    handleTrick() {
      this.$router.push({ name: 'trick' })
    },
    getInviteRecord() {
      this.$service.getInviteRecord().then(res => {
        let result = res.data.data
        this.totalReward = result.total
        console.log('====result====', result)
        this.$store.commit('setInviteData', result)
      })
    },
    handleClickShare(type) {
      let user = this.$store.getters.user
      if (!user || !user.id) {
        this.$toast('请先登录')
        return
      }
      let params = {
        uid: user.id,
        phone: user.phone,
        version: user.version || 270,
        source: type
      }
      let query = Object.keys(params)
        .map(item => {
          return item + '=' + params[item]
        })
        .join('&')

      let url = inviteShareConfig.url + '?' + query
      let shareParams = {
        url: url,
        shareTitle: inviteShareConfig.shareTitle,
        shareContent: inviteShareConfig.shareContent,
        shareImg: inviteShareConfig.shareImg
      }
      this.currentShareType = type
      if (this.noSingleShare) {
        console.log('====noSingleShare====')
        this.$callHandler('callShare', shareParams)
        this.$track('invitationShareUrlLink')
        return
      }
      if (type == 'wechatMessage') {
        this.$callHandler('shareWechatMessage', shareParams).then(res => {
          console.log('====share wechatMessage====', res)
          if (res.result == 'success') {
            this.$toast('分享成功')
            this.$track('invitationShareUrlLink', {
              invitationShareType: '微信好友'
            })
          }
        })
        this.$track('h5InvitationClickShare', {
          invitationShareType: '微信好友 '
        })
      }
      if (type == 'wechatTimeline') {
        shareParams.shareTitle = '送您66元优惠券，用车低至0元'
        this.$callHandler('shareWechatTimeline', shareParams).then(res => {
          if (res.result == 'success') {
            this.$toast('分享成功')
            this.$track('invitationShareUrlLink', {
              invitationShareType: '微信朋友圈'
            })
          }
        })
        this.$track('h5InvitationClickShare', {
          invitationShareType: '微信朋友圈'
        })
      }
    }
  },

  created() {
    this.getInviteRecord()
    this.$track('invitationPageOpen')
  },

  mounted() {
    // this.$registerHandler('getShareResult', res => {
    //   try {
    //     let resJSON = res
    //     if (typeof res === 'string') {
    //       resJSON = JSON.parse(res)
    //     }
    //     if (resJSON.result == 'success') {
    //       this.$toast('分享成功')
    //       this.$track('invitationShareUrlLink', {
    //         invitationShareType:
    //           this.currentShareType == 'wechatMessage'
    //             ? '微信好友'
    //             : '微信朋友圈'
    //       })
    //     }
    //   } catch (e) {
    //     alert(e)
    //   }
    // })
  }
}
</script>
<style lang="scss">
.invite-page {
  min-height: 154vw;
  .invite-info {
    overflow: hidden;
    padding: 5vw 1vw 0;
    .title {
      .red-text {
        color: #f65251;
      }
      h3 {
        margin-top: 1vw;
        font-size: px2vw(24);
      }
      > p {
        margin-top: 1vw;
      }
    }
    .card {
      width: 57%;
      margin: 7vw auto 0;
      img {
        width: 100%;
        height: auto;
      }
    }
  }
  .share-container {
    box-shadow: 0 2px 4px 0 rgba(164, 164, 164, 0.5);
    width: 90%;
    margin: -2vw auto 0;
    padding: 1vw 0 6vw;
    .share-buttons {
      margin-top: 6vw;
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

  .prize-record {
    width: 90%;
    margin: 3vw auto 0;
    padding: 0 0 5vw;
    box-shadow: 0 2px 4px 0 rgba(164, 164, 164, 0.5);
    h4 {
      margin: 0;
      span {
        background-color: #e1e1e1;
        opacity: 0.6;
        width: 42%;
        margin: auto;
        padding: 1vw 0;
        border-bottom-right-radius: 15vw;
        border-bottom-left-radius: 15vw;
      }
    }
    .show-record {
      display: block;
      margin: 5.5vw 0 0;
    }
  }
  .show-rule {
    color: $color-gray-light;
    font-size: 3.7333vw;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    padding: 4vw;
    text-align: center;
    text-decoration: underline;
  }
  .ps {
    width: 93%;
    margin: 2vw auto;
  }
}
</style>
