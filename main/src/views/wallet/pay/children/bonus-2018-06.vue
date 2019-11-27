<template>
  <div class="bonus-pay">
    <div class="top-container">
      <img src="./img/bg-2018-06.png" alt="">
    </div>
    <div class="pay-container">
      <div class="money-selector">
        <div class="title">请选择充值金额</div>
        <div class="current-money">{{currentMoney}}元</div>
        <v-choose-money :hasBonus="true" :moneyList="moneyList" :default-index="2" ref="chooseMoney" size="small" @focusMoney="handleFocusMoney" @blurMoney="handleBlurMoney" @change="handleChangeMoney"></v-choose-money>
      </div>
      <div class="choose-method">
        <div class="title">请选择支付方式</div>
        <v-radio align="right" title="右对齐" v-model="payMethod" :options="payOptions">
        </v-radio>
      </div>
      <div class="pay-btn">
        <div class="pay-button" @click="pay">
          <img src="./img/btn-2018-06.png" alt="">
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
import { duringBonusDay } from '@/util/common.js'

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
        bonus: 8
      },
      {
        money: 200,
        bonus: 20
      },
      {
        money: 500,
        bonus: 200
      },
      {
        money: 1000,
        bonus: 450
      },
      {
        money: 2000,
        bonus: 1000
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
      currentMoney: '500'
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
      if (!duringBonusDay()) {
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
    if (!duringBonusDay()) {
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
  background-size: cover;
  background-position: center;
  .top-container {
    img {
      width: 100%;
    }
  }
  .pay-container {
    padding: 3vw 5vw;
    border-radius: 1.333vw;
    .choose-method {
      margin-top: 5vw;
      .v-radiolist {
        li {
          border-bottom: none;
          min-height: 12vw;
        }
        .v-radio .v-radio-input:checked + .v-radio-core {
          background-color: rgb(180, 69, 71);
          border-color: rgb(180, 69, 71);
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
      &:nth-of-type(3) .money {
        border-radius: 0.533vw 5.333vw 0.533vw 0.533vw;
      }
      &:nth-of-type(4) .money {
        border-radius: 0.533vw 0.533vw 0.533vw 5.333vw;
      }
      .money {
        border: 1px solid #9e9e9e;
        border-radius: 0.533vw;
        background-color: transparent;
        &.active {
          background-color: rgb(180, 69, 71);
          border-color: rgb(180, 69, 71);
          box-shadow: none;
          .money-with-bonus {
            .original-money {
              color: #fff;
            }
            .bonus-money {
              color: #fff;
            }
          }
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
        border-radius: 0.533vw;
        overflow: hidden;
        &::-webkit-input-placeholder {
          font-size: 4vw;
        }
        &.active {
          background-color: rgb(180, 69, 71);
          border-color: rgb(180, 69, 71);
          box-shadow: none;
          .money {
            background-color: transparent;
          }
          .money-with-bonus {
            .original-money {
              color: #fff;
            }
            .bonus-money {
              color: #fff;
            }
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
