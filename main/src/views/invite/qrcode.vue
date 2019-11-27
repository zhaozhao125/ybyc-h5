<template>
  <div class="invite-qrcode">
    <div class="content-wrapper text-center">
      <h2>扫码注册</h2>
      <h3>送66元优惠券礼包</h3>
      <div class="qrcode-container">
        <canvas id="qrcode"></canvas>
      </div>
    </div>
    <div class="bottom-logo"></div>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import {inviteShareConfig} from '@/config/share.js'
export default {
  data() {
    return {}
  },

  mounted() {
    let params = {
      uid: this.$store.getters.user.id,
      phone: this.$store.getters.user.phone,
      version: this.$store.getters.user.version || 270,
      source: 'qrcode'
    }
    let query = Object.keys(params)
      .map(item => {
        return item + '=' + params[item]
      })
      .join('&')

    let url = inviteShareConfig.url + '?' + query
    console.log('====url====', url)
    QRCode.toCanvas(this.$el.querySelector('#qrcode'), url, {
      width: this.$el.querySelector('.qrcode-container').clientWidth
    })
    window.sa.track('invitationSharQrcode')
  }
}
</script>

<style lang="scss">
.invite-qrcode {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 20vw;
  .content-wrapper {
    h3 {
      font-size: 7vw;
      margin: 1vw auto 6vw;
    }
    .qrcode-container {
      height: 60vw;
      width: 60vw;
      border: 2.5vw solid #fdd000;
      margin: auto;
    }
  }
}
</style>
