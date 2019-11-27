<template>
<div class="pay-rent-result">
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

  name: 'pay-rent-result',

  components: {
    vResult
  },

  data() {
    return {

    }
  },

  methods: {
    payCarDeposit() {
      this.$router.replace({
        name: 'depositRent'
      })
    },
    backToWallet() {
      this.$router.push({
        name: 'wallet'
      })
    },
    backToHome() {
      try {
        if (this.$bridge) {
          this.$bridge.callHandler('backToHome')
        } else {
          this.$toast('no bridge')
        }
      } catch (e) {
        this.$toast(e)
      }
    },
    payAgain() {
      this.$router.go(-1)
    },
    payAnother(){
      this.$router.go(-1)
    }
  },

  computed: {
    // 是否成功
    resultType() {
      return this.$route.query.type
    },
    // 充值类型(car/offence)
    depositType() {
      return this.$route.query.deposit
    },
    // 是否可以用车
    canUseCar() {
      return this.$route.query.canUseCar
    },
    message() {
      return this.$route.query.msg || ''
    },
    pageData() {
      let ret = {}
      ret.title = ((this.depositType == 'car') ? '车辆' : '违章') + '押金交纳' + ((this.resultType == 'success') ? '成功' : '失败')
      if (this.resultType == 'success') {
        ret.primaryBtn = '去用车'
        ret.handleClickPrimaryBtn = this.backToHome
        if (this.depositType == 'offence') {
          ret.imgName = 'refund-offence.png'
        } else {
          ret.imgName = 'refund-money.png'
        }
        if (this.canUseCar == 0) {
          ret.text = '长租车辆，需同时交纳违章押金和车辆押金'
          ret.defaultBtn = '去交纳' + (this.depositType == 'car' ? '违章' : '车辆') + '押金'
          ret.handleClickDefaultBtn = this.payAnother
        } else {
          ret.text = ''
          ret.defaultBtn = ''
          ret.defaultBtn = '回到钱包'
          ret.handleClickDefaultBtn = this.backToWallet
        }
      } else {
        ret.imgName = 'deposit-error.png'
        ret.text = this.message || '因网络等原因，未完成支付'
        ret.primaryBtn = '重试'
        ret.handleClickPrimaryBtn = this.payAgain
        ret.defaultBtn = '回到钱包'
        ret.handleClickDefaultBtn = this.backToWallet
      }
      return ret
    }
  }
}

</script>

<style lang="css" scoped="">
</style>
