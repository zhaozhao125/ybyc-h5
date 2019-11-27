<template>
  <div class="bonus-pay">
    <div class="top-text">
      <img class="new-year-bonus" src="~@/assets/img/new-year/new-year-bonus.png" alt="">
      <p class="activity-date">2017/12/29 - 2018/01/31&nbsp;&nbsp;余额充值活动</p>
      <p class="max-bonus">
        <span>最高可赠600元</span>
      </p>
      <img class="happy-new-year" src="~@/assets/img/new-year/happy-new-year.png" alt="">
    </div>
    <div class="pay-container">
      <div class="money-selector">
        <div class="title">请选择充值金额</div>
        <v-choose-money :hasBonus="true" :moneyList="moneyList" ref="chooseMoney" size="small" @focusMoney="handleFocusMoney" @blurMoney="handleBlurMoney"></v-choose-money>
      </div>
      <div class="choose-method">
        <div class="title">请选择支付方式</div>
        <v-radio align="right" title="右对齐" v-model="payMethod" :options="payOptions">
        </v-radio>
      </div>
      <div class="pay-btn">
        <mt-button type="default" @click="pay">立即充值</mt-button>
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
import vRadio from '@/components/radio';
import vChooseMoney from '../components/choose-money.vue';
import payConfig from '@/config/pay';

export default {

  name: 'pay',

  components: {
    vRadio,
    vChooseMoney
  },

  data() {
    // 新年福利
    let moneyList = [{
        money: 100,
        bonus: 8
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
    return {
      moneyList,
      payMethod: payConfig.paymentPluginList[0].value,
      payOptions: payConfig.paymentPluginList,
      lockPay: false,
      statisticData: null
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
      if (this.lockPay) {
        return
      }
      let params = {
        paymentPluginId: this.payMethod,
        payerId: this.$store.getters.user.id,
        amount: this.money || (this.$refs.chooseMoney.getMoney()),
        paymentType: payConfig.paymentType[this.type],
        terminalFlag: ''
      }

      this.statisticData = {
        payMethod: this.payMethod == 'alipayMobilePlugin' ? '支付宝' : '微信',
        amount: params.amount
      }

      this.$service.submitOrder(params.paymentPluginId, params.payerId, params.amount, params.paymentType, params.terminalFlag).then(res => {
        let result = res.data
        let data = result.data.parameters
        if (this.$bridge) {
          let handlerName = params.paymentPluginId == 'alipayMobilePlugin' ? 'jsCallPayZFB' : 'jsCallPayWX'
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
          window._czc.push(['_trackEvent', 'AppH5', '新年充值活动', '充值=' + this.statisticData.payMethod, this.statisticData.amount])
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
        window._czc.push(['_trackEvent', 'AppH5', '新年充值活动', '充值=' + this.statisticData.payMethod, this.statisticData.amount])
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
    }
  },

  mounted() {
    let from = this.$route.query.from
    if (!from && window.location.search.match('from')) {
      let fromQuery = window.location.search.replace('?', '').split('&').find(item => item.match('from'))
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
  padding: 2vw;
  background-image: url("~@/assets/img/new-year/new-year-bg.png");
  .top-text {
    text-align: center;
    .new-year-bonus {
      width: 40vw;
    }
    p {
      font-size: 3.733vw;
      color: #FFE4DC;
    }
    .activity-date {
      margin-top: 0.5vw;
      font-size: 3.46667vw;
    }
    .max-bonus {
      margin-top: 1.6vw;
      span {
        display: inline-block;
        padding: 0.5vw 4vw;
        border: 1px solid #FFE4DC;
        border-radius: 100px;
      }
    }
    .happy-new-year {
      margin-top: 1.5vw;
      margin-bottom: 1.5vw;
      width: 56vw;
    }
  }
  .pay-container {
    background-color: #FFFCF4;
    padding: 4vw 2vw;
    border-radius: 1.333vw;
    .choose-method {
      margin-top: 2vw;
      .v-radiolist {
        li {
          border-bottom: none;
          min-height: 12vw;
        }
        .v-radio .v-radio-input:checked+.v-radio-core {
          background-color: #BD5749;
          border-color: #BD5749;
        }
      }
    }
  }
  .title {
    margin: 3vw 0;
    font-size: 3.7333vw; // padding-left: 3vw;
    text-align: center;
    &:before, &:after {
      content: '';
      display: inline-block;
      width: 25vw;
      height: 0;
      border-bottom: 0.5px solid rgba(91, 30, 30, 0.28);
      vertical-align: middle;
    }
    &:before {
      margin-right: 2vw;
    }
    &:after {
      margin-left: 2vw;
    }
  }
  .choose-money {
    ul li {
      .money {
        border: 1px solid #bd8784;
        border-radius: 0.5333vw;
        background-color: #FFFCF4;
        &.active {
          background-color: #FFD5D5;
          box-shadow: none;
        }
        .money-with-bonus {
          .original-money {
            color: #3d3d3d;
          }
          .bonus-money {
            color: #B64444;
          }
        }
      }
      .custom-money {
        font-size: 4vw;
        background-color: #FFFCF4;
        border: 1px solid #bd8784;
        border-radius: 0.5333vw;
        &::-webkit-input-placeholder {
          font-size: 4vw;
        }
        &:focus {
          border: 1px solid #bd8784;
        }
        &.active {
          border: 1px solid #bd8784;
          .money {
            background-color: #FFD5D5;
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
    .mint-button {
      font-size: 4.3vw;
      width: 100%;
      color: #FEFEFF;
      background-color: #BD5749;
      label{
        color: #FEFEFF;
      }
    }
    p {
      font-size: 2.668vw;
      margin-top: 3%;
      color: #424242;
      text-align: center;
    }
    small {}
    a {
      color: #424242;
    }
  }
}

</style>
