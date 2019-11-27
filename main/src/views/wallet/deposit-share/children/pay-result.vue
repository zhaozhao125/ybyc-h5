<template>
<div class="pay-share-result">
  <v-result :imgName="pageData.imgName"
            :title="pageData.title"
            :text="pageData.text"
            :defaultBtn="pageData.defaultBtn"
            :primaryBtn="pageData.primaryBtn"
            @clickDefaultBtn="pageData.handleClickDefaultBtn"
            @clickPrimaryBtn="pageData.handleClickPrimaryBtn"></v-result>
</div>

</template>

<script>
import vResult from '@/components/result';
export default {

  name: 'pay-share-result',

  components: {
    vResult
  },

  data() {
    return {

    }
  },

  methods: {
    backToWallet() {
      this.$router.push({
        name: 'wallet'
      })
    },
    payAgain() {
      this.$router.go(-1)
    },
    backToHome() {
      try {
        if (this.$bridge) {
          this.$bridge.callHandler('backToHome', {}, res => {
            this.log(res)
          })
        } else {
          this.$toast('no bridge')
        }
      } catch (e) {
        this.$toast(e)
      }
    }
  },

  computed: {
    resultType() {
      return this.$route.query.type
    },
    message() {
      return this.$route.query.msg || ''
    },
    pageData() {
      if (this.resultType === 'success') {
        return {
          imgName: 'deposit-success.png',
          title: '分时保证金交纳成功！',
          text: '您现在已经可以开始用车了~',
          defaultBtn: '回到我的钱包',
          primaryBtn: '去用车',
          handleClickDefaultBtn: this.backToWallet,
          handleClickPrimaryBtn: this.backToHome
        }
      }
      return {
        imgName: 'deposit-error.png',
        title: '分时保证金交纳失败！',
        text: this.message || '因网络等原因，未完成支付',
        defaultBtn: '回到我的钱包',
        primaryBtn: '重试',
        handleClickDefaultBtn: this.backToWallet,
        handleClickPrimaryBtn: this.payAgain
      }
    }
  }
}

</script>

<style lang="css" scoped="">
</style>
