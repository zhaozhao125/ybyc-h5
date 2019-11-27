<template>
  <div class="bonus-pay">
    <div class="top-text">
      <h2>早春充送到来/陪你春暖花开</h2>
      <p>3月20日至3月22日，余额充值活动</p>
      <p>
        <strong>「最高可赠600元」</strong>
      </p>
    </div>
    <div class="pay-container">
      <div class="money-selector">
        <div class="title">请选择充值金额</div>
        <div class="current-money">{{currentMoney}}元</div>
        <v-choose-money :hasBonus="true" :moneyList="moneyList" ref="chooseMoney" size="small" @focusMoney="handleFocusMoney" @blurMoney="handleBlurMoney" @change="handleChangeMoney"></v-choose-money>
      </div>
      <div class="choose-method">
        <div class="title">请选择支付方式</div>
        <v-radio align="right" title="右对齐" v-model="payMethod" :options="payOptions">
        </v-radio>
      </div>
      <div class="pay-btn">
        <div class="pay-button" @click="pay">
          <img src="./img/btn.png" alt="">
        </div>
        <p>
          <small>赠送余额仅限分时用车，点击“立即充值”即代表您已阅读并同意
            <router-link :to="{name: 'rechargeAgreement'}">《一步用车充值协议》</router-link>
          </small>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import vRadio from '@/components/radio'
import vChooseMoney from '../components/choose-money.vue'
import payConfig from '@/config/pay'

export default {
  name: 'pay',

  components: {
    vRadio,
    vChooseMoney
  },

  data() {
    // 新年福利
    let moneyList = [
      {
        money: 100,
        bonus: 10
      },
      {
        money: 200,
        bonus: 50
      },
      {
        money: 500,
        bonus: 150
      },
      {
        money: 1000,
        bonus: 300
      },
      {
        money: 2000,
        bonus: 600
      }
    ]
    let payOptions = JSON.parse(JSON.stringify(payConfig.paymentPluginList))
    payOptions[0].icon = 'icon-zfb-black.png'
    payOptions[1].icon = 'icon-wx-black.png'
    return {
      moneyList,
      payMethod: payConfig.paymentPluginList[0].value,
      payOptions: payOptions,
      lockPay: false,
      statisticData: null,
      currentMoney: '100'
    }
  },

  computed: {
    money() {
      return Number(this.$route.query.money)
    },
    type() {
      return this.$route.query.type
    },
    payResult() {
      return this.$store.getters.payResult
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
      let deadline = (new Date(2018, 2, 23, 0, 0, 0)).getTime()
      if(Date.now() >= deadline){
        this.$message('提示', '该活动已经结束，请关注一步其他活动')
        return
      }
      if (this.lockPay) {
        return
      }
      let params = {
        paymentPluginId: this.payMethod,
        payerId: this.$store.getters.user.id,
        amount: this.money || this.$refs.chooseMoney.getMoney(),
        paymentType: payConfig.paymentType[this.type],
        terminalFlag: ''
      }

      this.statisticData = {
        payMethod: this.payMethod == 'alipayMobilePlugin' ? '支付宝' : '微信',
        amount: params.amount
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
      let from = this.$store.getters.from
      // 如果从订单结算余额不足进入充值，则充值之后直接返回webview
      if (from && from == 'short_rent_order_pay') {
        if (success) {
          this.$toast({
            message: '充值成功',
            iconClass: 'pay-success-icon'
          })
          window._czc.push([
            '_trackEvent',
            'AppH5',
            '新年充值活动',
            '充值=' + this.statisticData.payMethod,
            this.statisticData.amount
          ])
          setTimeout(() => {
            this.$bridge.callHandler('finishWebView')
          }, 2000)
        } else {
          this.$toast(message || '充值失败')
        }
        return
      }
      if (success) {
        this.$router.replace({
          name: 'payBalanceResult',
          query: {
            type: 'success'
          }
        })
        window._czc.push([
          '_trackEvent',
          'AppH5',
          '新年充值活动',
          '充值=' + this.statisticData.payMethod,
          this.statisticData.amount
        ])
      } else {
        this.$router.push({
          name: 'payBalanceResult',
          query: {
            type: 'failed',
            msg: message
          }
        })
      }
    },
    handleFocusMoney() {
      this.lockPay = true
    },
    handleBlurMoney() {
      setTimeout(() => {
        this.lockPay = false
      }, 10)
    },
    handleChangeMoney(money) {
      this.currentMoney = money
    }
  },

  mounted() {
    let deadline = (new Date(2018, 2, 23, 0, 0, 0)).getTime()
    if(Date.now() >= deadline){
      this.$message('提示', '该活动已经结束，请关注一步其他活动')
    }
    let from = this.$route.query.from
    if (!from && window.location.search.match('from')) {
      let fromQuery = window.location.search
        .replace('?', '')
        .split('&')
        .find(item => item.match('from'))
      if (fromQuery) {
        from = fromQuery.split('=')[1]
      }
    } else if (this.$router.pathStack.length == 1) {
      from = '钱包'
    }
    if (!from || from == 'undefined') {
      from = '无'
    }
    window._czc.push(['_trackEvent', 'AppH5', '新年充值活动', '来源=' + from])
  }
}
</script>
<style lang="scss">
.bonus-pay {
  width: 100%;
  height: 100%;
  padding: 5vw 3vw;
  background-image: url('./img/bg.png');
  background-size: cover;
  background-position: center;
  .top-text {
    h2 {
      font-size: 6.5vw;
    }
    p {
      font-size: 3.7333vw;
      color: #3d3d3d;
      margin-top: 2vw;
    }
  }
  .pay-container {
    padding: 1vw 2vw;
    border-radius: 1.333vw;
    .choose-method {
      margin-top: 5vw;
      .v-radiolist {
        li {
          border-bottom: none;
          min-height: 12vw;
        }
        .v-radio .v-radio-input:checked + .v-radio-core {
          background-color: $color-yellow;
          border-color: $color-yellow;
        }
      }
    }
  }
  .title {
    margin: 3vw 0 2vw;
    color: #a4a4a4;
    font-size: 3.7333vw;
  }
  .current-money {
    font-size: 6.4vw;
    margin-top: 4vw;
    margin-bottom: 2vw;
  }
  .choose-money {
    ul li {
      .money {
        border: 1px solid #9e9e9e;
        border-radius: 2.1333vw;
        background-color: transparent;
        &.active {
          background-color: $color-yellow;
          border-color: $color-yellow;
          box-shadow: none;
        }
        .money-with-bonus {
          .original-money {
            color: #3d3d3d;
          }
          .bonus-money {
            color: #b64444;
          }
        }
      }
      .custom-money {
        font-size: 4vw;
        background-color: transparent;
        border: 1px solid #9e9e9e;
        border-radius: 2.1333vw;
        overflow: hidden;
        &::-webkit-input-placeholder {
          font-size: 4vw;
        }
        &.active {
          background-color: $color-yellow;
          border-color: $color-yellow;
          box-shadow: none;
          .money {
            background-color: transparent;
          }
        }
        .custom-money-bonus {
          height: 100%;
        }
        .money {
          border: none;
          height: 100%;
        }
      }
    }
  }
  .pay-btn {
    margin-top: 4vw;
    .pay-button {
      img {
        width: 100%;
      }
    }
    p {
      font-size: 2.668vw;
      text-align: center;
      width: 92%;
      margin: 2vw auto;
    }
    small {
      color: #3d3d3d;
    }
    a {
      color: #3d3d3d;
    }
  }
}
</style>
