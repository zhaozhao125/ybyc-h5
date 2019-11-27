<template>
  <div class="free-order-share flex-col justify-content-center">
    <div class="share-warpper">
      <img class="display-block width-100" src="../img/free-order-share.png" alt="">
      <img class="share-qrcode position-absolute left-0 right-0 margin-auto" :src="qrcodeSrc" alt="">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      qrcodeSrc: ''
    }
  },

  created() {
    console.log('====open share timeline====', this.$route.query)
    this.$fetch('/service-common/wechat/miniprogram/wxacodeunlimit/base64', {
      // fr for Free Order
      scene: encodeURIComponent(`fr?${this.$route.query.token}`),
      page: 'free-order/index/index',
      hyaline: true
    })
      .then(res => {
        console.log('====res====', res)
        this.qrcodeSrc = res.data.data
      })
      .catch(err => {
        console.log('====timeline err====', err)
      })
  }
}
</script>

<style lang="scss">
.free-order-share {
  background: #fff;
  .share-qrcode {
    width: 30vw;
    top: 68%;
  }
}
</style>
