<template>
  <div class="pay">
    <div class="certain-money" v-if="money">
      <h3>
        <span v-if="type=='rentOffence'">应交纳押金</span>
        <span v-else-if="type=='rentCar'">请选择交纳金额</span>
        <span v-else>交纳金额</span>
      </h3>
      <p>{{money}}元</p>
    </div>
    <div class="choose-money" v-else>
      <div class="title">请选择充值金额</div>
      <v-choose-money :moneyList="moneyList" ref="chooseMoney"></v-choose-money>
    </div>
    <div class="choose-method">
      <div class="title" v-if="!money">请选择支付方式</div>
      <v-radio align="right" title="右对齐" v-model="payMethod" :options="payOptions">
      </v-radio>
    </div>
    <div class="pay-btn">
      <mt-button type="default" @click="pay">
        <template v-if="type=='balance'">立即充值</template>
        <template v-else>立即支付</template>
      </mt-button>
      <p v-if="type=='balance'">
        <small>点击“立即充值”即代表您已阅读并同意
          <router-link :to="{name: 'rechargeAgreement'}">《一步用车充值协议》</router-link>
        </small>
      </p>
    </div>
  </div>

</template>

<script>
import vRadio from '@/components/radio'
import vChooseMoney from './components/choose-money.vue'
import payConfig from '@/config/pay'

export default {
  name: 'pay',

  components: {
    vRadio,
    vChooseMoney
  },

  data() {
    return {
      moneyList: [100, 300, 500, 1000, 2000],
      payMethod: payConfig.paymentPluginList[0].value,
      payOptions: payConfig.paymentPluginList
    }
  },

  computed: {
    money() {
      return Number(this.$route.query.money)
    },
    type() {
      // balance      余额充值
      // share        分时保证金
      // rentOffence  长租违章押金
      // rentCar      长租车辆押金
      return this.$route.query.type
    },
    payResult() {
      return this.$store.getters.payResult
    }
  },

  mounted() {
    if (this.type === 'rentCar') {
      this.moneyList = [1000, 2000, 3000]
    }
  },

  watch: {
    payResult() {
      this.$message.close()
      this.handlePayResult(this.payResult.isSuccess, this.payResult.message)
    }
  },

  methods: {
    pay() {
      let params = {
        paymentPluginId: this.payMethod,
        payerId: this.$store.getters.user.id,
        amount: this.money || this.$refs.chooseMoney.getMoney(),
        paymentType: payConfig.paymentType[this.type],
        terminalFlag: ''
      }

      this.$service
        .submitOrder(
          params.paymentPluginId,
          params.payerId,
          params.amount,
          params.paymentType,
          params.terminalFlag
        )
        .then(res => {
          let result = res.data
          let data = result.data.parameters
          if (this.$bridge) {
            let handlerName =
              params.paymentPluginId == 'alipayMobilePlugin'
                ? 'jsCallPayZFB'
                : 'jsCallPayWX'
            this.$bridge.callHandler(handlerName, data)
            this.$message.alert('正在进行支付...')
          } else {
            this.$toast('支付失败：no bridge')
            this.$message.close()
          }
        })
    },
    handlePayResult(success, message) {
      let from = this.$route.query.from
      let action = this.$route.query.action
      // 如果从订单结算余额不足进入充值，则充值之后直接返回webview
      // 分时订单余额不足+短租订单余额不足
      if (
        from == 'short_rent_order_pay' ||
        from == 'short_rent_offence_deposit' ||
        from == 'slrent_pay' ||
        action == 'close'
      ) {
        if (success) {
          this.$toast({
            message: '支付成功',
            iconClass: 'pay-success-icon'
          })
          setTimeout(() => {
            this.$bridge.callHandler('finishWebView', {
              from
            })
          }, 2000)
        } else {
          this.$toast(message || '支付失败')
        }
        return
      }
      if (this.type === 'share') {
        if (success) {
          this.$router.replace({
            name: 'payShareResult',
            query: {
              type: 'success'
            }
          })
        } else {
          this.$router.push({
            name: 'payShareResult',
            query: {
              type: 'failed',
              msg: message
            }
          })
        }
      } else if (this.type.match('rent')) {
        if (success) {
          this.$router.replace({
            name: 'payRentResult',
            query: {
              type: 'success',
              deposit: this.type == 'rentOffence' ? 'offence' : 'car',
              canUseCar: this.$route.query.canUseCar
            }
          })
        } else {
          this.$router.push({
            name: 'payRentResult',
            query: {
              type: 'failed',
              deposit: this.type == 'rentOffence' ? 'offence' : 'car',
              msg: message
            }
          })
        }
      } else if (this.type == 'balance') {
        if (success) {
          this.$router.replace({
            name: 'payBalanceResult',
            query: {
              type: 'success'
            }
          })
        } else {
          this.$router.push({
            name: 'payBalanceResult',
            query: {
              type: 'failed',
              msg: message
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="scss">
.pay {
  width: 100%;
  height: 100%;
  padding: 2vw;
  .title {
    margin: 3vw 0;
    font-size: 3.7333vw;
    padding-left: 3vw;
  }
  .certain-money {
    text-align: center;
    h3 {
      font-size: 3.5vw;
      margin: 3vw 0 7vw;
      color: $color-gray-light;
    }
    p {
      font-size: 6.25vw;
      margin-bottom: 16vw;
      color: $color-dark;
    }
  }
  .pay-btn {
    margin-top: 8vw;
    button {
      font-size: 4.3vw;
      width: 100%;
    }
    p {
      font-size: 2.668vw;
      margin-top: 3%;
      color: $color-gray-light;
      text-align: center;
    }
    a {
      color: $color-yellow;
    }
  }
}
</style>
