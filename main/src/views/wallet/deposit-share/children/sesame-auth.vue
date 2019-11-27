<template>
<div class="sesame-auth full">
  <iframe class="full"
          v-if="showFrame"
          v-show="iframeSrc"
          :src="iframeSrc"
          frameborder="0"
          id="sesameAuthFrame"
          onload=""
          scrolling="auto"></iframe>
</div>

</template>

<script>
export default {

  name: 'sesame-auth',

  data() {
    return {
      showFrame: true,
      iframeSrc: ''
    }
  },

  mounted() {
    this.iframeSrc = this.$route.query.url
    window.onmessage = (event) => {
      console.log('====message====', event)
      let result
      try {
        result = JSON.parse(event.data)
      } catch (e) {
        result = {}
      }
      if (result && result.errCode == 0) {
        this.$toast('芝麻认证成功')
      } else if (result && result.errMsg) {
        this.$toast(result.errMsg)
      } else {
        this.$toast('芝麻认证失败')
      }
      this.$router.push({
        name: 'wallet'
      })
      this.$router.push({
        name: 'depositShare'
      })
    }
  }
}

</script>

<style lang="scss">
.sesame-auth {
  -webkit-overflow-scrolling: touch;
  iframe {}
}
</style>
