<template>
  <div class="long-rent-invite-qrcode display-flex flex-direction-column justify-content-center align-items-center">
    <div class="content-wrapper text-center">
      <h2 class="fz-18" style="margin-bottom:5vw">扫码领取300元优惠券</h2>
      <div class="qrcode-container">
        <canvas id="qrcode"></canvas>
      </div>
    </div>
    <div class="bottom-logo"></div>
  </div>
</template>

<script>
import QRCode from 'qrcode'
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

    let url = 'https://h5.1byongche.com/app/share-pages/long-rent-invite-share?' + query
    console.log('====url====', url)
    if (process.env.BUILD_ENV !== 'production') {
      url = 'https://h5.1byongche.com/app/share-pages/test/long-rent-invite-share?' + query
    }
    QRCode.toCanvas(this.$el.querySelector('#qrcode'), url, {
      width: this.$el.querySelector('.qrcode-container').clientWidth
    })
    // window.sa.track('invitationSharQrcode')
  }
}
</script>

<style lang="scss">
.long-rent-invite-qrcode {
  padding-bottom: 20vw;
  .content-wrapper {
    .qrcode-container {
      height: 60vw;
      width: 60vw;
      border: 2.5vw solid #fdd000;
      margin: auto;
    }
  }
}
</style>
