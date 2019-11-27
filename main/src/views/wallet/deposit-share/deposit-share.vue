<template>
  <div class="deposit-share">
    <!-- <pre>{{payInfo}}</pre> -->
    <div class="deposit-info shadow-box card-box">
      <div class="deposit-info-content">
        <div class="should-pay position-relative">
          <h2 class="fz-18">应交保证金
            <small class="fz-10 color-gray-light">仅分时车辆需交纳</small>
            <span class="right-money float-right font-bold"
                  v-if="!payInfo.discount">{{payInfo.totalMoney}}元</span>
          </h2>
          <p class="invisible color-gray-light fz-12">
            <span class="car-deposit">车辆押金&nbsp;{{payInfo.carDeposit}}元</span>
            <span class="offence-deposit">违章押金&nbsp;{{payInfo.offenceDeposit}}元</span>
          </p>
          <div class="price-after-discount text-right"
               v-if="payInfo.discount">
            <del class="display-block color-gray-light">{{payInfo.totalMoney}}元</del>
            <span class="display-block fz-18">{{payInfo.shouldPayMoney}}元</span>
          </div>
        </div>
        <div class="discount"
             v-if="payInfo.discount">
          <h2>减免方式</h2>
          <p>{{payInfo.discountMethod}}</p>
        </div>
        <div class="current-balance fz-18">
          <h2>已交保证金
            <span class="float-right font-bold">{{currentBalance}}元</span>
          </h2>
        </div>
      </div>
      <!-- <div class="deposit-explain">
      <span>分时保证金说明</span>
    </div> -->
    </div>
    <p class="refund-info color-gray-light"
       v-if="payInfo.hasRefund">
      <span v-if="amountRate=='full'">您有一笔{{payInfo.refund}}元的退款申请，预计10个工作日内审核完毕，审核后将自动发起退款。<a v-if="canCancelRefund"
           href="#"
           class="cancel-refund-link has-arrow color-blue"
           @click.prevent="handleCancelRefund">还想继续用车，撤销申请</a></span>
      <span v-else>您有一笔{{payInfo.refund}}元的退款，提交申请后15个工作日内到账，请注意查收</span>
    </p>
    <!-- <div class="sesame-auth flex-row align-items-center shadow-box card-box">
    <div class="flex-1">
      <h2 class="fz-18">芝麻信用认证通道</h2>
      <small class="display-block fz-12 color-gray-light">{{payInfo.sesameText}}</small>
    </div>
    <a href="#"
       @click.prevent.stop="$router.push({name: 'sesameCredit'})"
       class="has-arrow color-gray-light text-decoration-none fz-14"><span v-if="zhimaIsAuth">已授权</span><span v-else>去认证</span></a>
  </div> -->
    <mt-button type="default"
               class="deposit-btn"
               @click="payDeposit"
               v-if="payInfo.overFlow==-1">
      <span>交纳保证金 {{payInfo.overFlowMoney}}元</span>
    </mt-button>
    <mt-button type="default"
               class="deposit-btn"
               @click="backToHome"
               v-else-if="loaded">
      <span>分时保证金已交纳，去用车吧</span>
    </mt-button>
    <p class="refund-tip text-center">提示：在用车完成15个工作日后，即可申请退款噢</p>
    <div class="refund-buttons fz-12"
         v-if="currentBalance">
      <a href="#"
         class="refund-difference text-decoration-none color-gray-light"
         @click.prevent="handleClickRefundDiff"
         v-if="payInfo.overFlow==1">退差额</a>
      <a href=""
         class="refund-all text-decoration-none color-gray-light"
         @click.prevent.stop="applyForRefund"
         v-if="loaded">申请退款</a>
    </div>
    <!-- <div class="deposit-explain">
    <h5>保证金说明：</h5>
    <p></p>
  </div> -->
    <div class="deposit-instruction position-fixed text-center width-100 left-0">
      <router-link class="color-gray-white text-decoration-underline"
                   :to="{name: 'shareDepositInstruction'}">保证金说明</router-link>
    </div>
    <v-popup v-model="showRefundDiff"
             v-show="payInfo.overFlow==1"
             :options="refundDiffMethod"
             smallTitle="退款金额"
             :title="payInfo.overFlowMoney + '元'"
             contentTitle="请选择退款方式"
             @confirm="refundDiff"></v-popup>
  </div>

</template>

<script>
import vPopup from '@/components/popup'
export default {
  name: 'deposit-share',

  components: {
    vPopup
  },

  data() {
    return {
      loaded: false,
      payInfo: {
        totalMoney: '-', // 应付总额
        carDeposit: '-', // 应付车辆押金
        offenceDeposit: '-', // 应付违章押金
        shouldPayMoney: '-', // 当前实际应付金额
        discount: '-', // 折扣金额
        discountMethod: '-', // 折扣方式
        refund: '-', // 退款金额
        hasRefund: false, // 当前是否有退款
        overFlow: 0, // 应交与实交是否有差，overFlow=-1：需交纳  overFlow=1:可差额退款 overFlow=0:相等
        overFlowMoney: 0 // 应交与实交金额差
      },
      currentBalance: '-', // 当前余额
      sesameText: '-', // 芝麻认证通道文本
      zhimaIsAuth: false, // 是否已经进行芝麻认证
      showRefundDiff: false, // 是否显示退差额选择框
      amountRate: '', // differ退差额，full退押金
      canCancelRefund: false,
      refundDiffMethod: [
        {
          label: '转至钱包余额',
          value: 'balance',
          text: '立即转至您的钱包余额',
          default: true
        },
        {
          label: '原路退回',
          value: 'return',
          text: '提交申请后15个工作日内到账'
        }
      ],
      bonus: 0 // 退差额到余额时的赠送金额
    }
  },

  methods: {
    loadData() {
      this.$service
        .getShareDepositDetail(this.$store.getters.user.id)
        .then(res => {
          this.loaded = true
          let result = res.data
          let data = result.data
          this.payInfo.totalMoney = data.timeShareRentDepositGlobal
          this.payInfo.carDeposit = data.timeShareRentCarDepositGlobal
          this.payInfo.offenceDeposit = data.timeShareRentViolationDepositGlobal
          this.payInfo.shouldPayMoney = data.timeShareRentDepositWaterLine
          this.payInfo.discount =
            data.timeShareRentDepositGlobal - data.timeShareRentDepositWaterLine
          this.payInfo.discountMethod = data.timeShareRentDepositWaterLineRemark
          this.payInfo.refund = data.hasUnFinishRefund
            ? data.unFinishRefundAmount
            : 0
          this.payInfo.hasRefund = data.hasUnFinishRefund
          this.payInfo.overFlow = data.overFlow
          this.payInfo.overFlowMoney = data.overFlowSubAmount
          this.payInfo.sesameText = data.zhimaText
          this.currentBalance = data.timeShareRentDeposit
          this.zhimaIsAuth = data.zhimaIsAuth
          this.amountRate = data.amountRate
          this.canCancelRefund = data.canCancelRefund

          if (
            this.payInfo.overFlow == 1 &&
            Number(this.payInfo.overFlowMoney) >= 10
          ) {
            let bonus = Math.floor(this.payInfo.overFlowMoney / 10)
            this.bonus = bonus
            this.refundDiffMethod[0].label = `转至钱包余额<strong>（额外赠送${bonus}元）</strong>`
          }
        })
    },
    // 支付保证金
    payDeposit() {
      this.$router.push({
        name: 'pay',
        query: {
          type: 'share',
          money: this.payInfo.overFlowMoney
        }
      })
    },
    // 保证金已交纳，去用车
    backToHome() {
      if (this.$bridge) {
        this.$bridge.callHandler('backToHome')
      }
    },
    // 点击退差额回调
    handleClickRefundDiff() {
      if (Number(this.payInfo.overFlowMoney) <= 1) {
        this.refundDiffMethod[1].hidden = true
      } else {
        this.refundDiffMethod[1].hidden = false
      }
      this.showRefundDiff = true
    },
    // 退差额
    refundDiff(val) {
      if (val == 'return') {
        this.$store.commit('applyForRefund', {
          type: 'share',
          money: this.payInfo.overFlowMoney,
          amountRate: 'differ'
        })
        this.$router.push({
          name: 'refund'
        })
      } else {
        this.$service
          .applyForRefund(
            this.$store.getters.user.id,
            this.payInfo.overFlowMoney,
            'timeShareRentDeposit',
            true,
            'differ'
          )
          .then(res => {
            let toastMsg = `${this.payInfo.overFlowMoney +
              this.bonus}元已转至您的钱包余额中，请查收`
            if (this.bonus == 0) {
              toastMsg = `${
                this.payInfo.overFlowMoney
              }元差额已转至您的钱包-赠送余额中，请查收`
            }
            this.$toast(toastMsg)
            this.loadData()
          })
          .catch(e => {})
      }
    },
    // 申请退款
    applyForRefund() {
      this.$service
        .canRefund(this.$store.getters.user.id, 'timeShareRentDeposit')
        .then(res => {
          this.$message
            .confirm('退押金后你将无法使用分时车辆，确定申请退款吗？')
            .then(() => {
              this.$store.commit('applyForRefund', {
                money: this.currentBalance,
                type: 'share',
                amountRate: 'full'
              })
              this.$router.push({
                name: 'refundReason'
              })
            })
        })
        .catch(e => {
          if (e.errCode) {
            setTimeout(() => {
              document.querySelector('.mint-toast').remove()
            }, 100)
            this.$message.alert(e.errMsg)
          }
        })
    },
    // 撤销退款申请
    handleCancelRefund() {
      this.$message
        .confirm('撤销退款申请后，即可继续用车噢~')
        .then(() => {
          this.$service.cancelShareDepositRefund().then(res => {
            this.$toast('退款申请已撤销，已退回至已交保证金中，可以继续用车啦')
            this.loadData()
          })
        })
        .catch(() => {})
    }
  },
  created() {
    this.loadData()
  }
}
</script>

<style lang="scss" scoped="">
.deposit-share {
  padding: 5vw 3vw;
  .card-box {
    padding: 7vw 5vw;
    margin-bottom: 5vw;
  }
  .deposit-info {
    background-image: url('~@/assets/img/deposit-clock.png');
    background-size: 35vw;
    background-repeat: no-repeat;
    background-position: right bottom;
  }
  .should-pay {
    h2 {
      margin-bottom: 2vw;
      small {
        margin-left: 1vw;
      }
    }
    p {
      span {
        margin-right: 4vw;
        &:before {
          content: '';
          width: 1.5vw;
          height: 1.5vw;
          background-color: red;
          display: inline-block;
          border-radius: 50%;
          margin-right: 2vw;
          vertical-align: middle;
        }
        &.car-deposit {
          &:before {
            background-color: #e38f3f;
          }
        }
        &.offence-deposit {
          &:before {
            background-color: #46e33f;
          }
        }
      }
    }
    .price-after-discount {
      position: absolute;
      right: 0;
      top: 0;
      margin-top: 1.5vw;
      del {
        font-size: 3.4vw;
      }
      span {
        margin-top: 1vw;
      }
    }
  }
  .discount {
    margin-top: 5vw;
    p {
      margin-top: 2vw;
    }
  }
  .current-balance {
    margin-top: 6vw;
  }
  .refund-info {
    margin-bottom: 8vw;
    padding: 0 3vw;
    line-height: 1.5em;
    .cancel-refund-link {
      &::after {
        width: 1.5vw;
        height: 1.5vw;
        border-color: $color-blue;
        border-top-width: 1px;
        border-right-width: 1px;
        margin-left: 0.5vw;
      }
    }
  }
  .cancel-refund {
    margin-bottom: 5vw;
    .cancel-refund-link::after {
      border-color: $color-blue;
    }
  }
  .sesame-auth {
    background-image: url('~@/assets/img/deposit-sesame.png');
    background-size: 12vw;
    background-repeat: no-repeat;
    background-position: right bottom;
    small {
      margin-top: 2vw;
    }
    a {
      padding: 3vw 0;
    }
  }
  .deposit-btn {
    margin-top: 3vw;
  }
  .refund-buttons {
    margin-top: 4vw;
    a {
      &.refund-all {
        float: right;
      }
    }
  }
  .deposit-instruction {
    bottom: 3.3vw;
  }
  .refund-tip {
    margin-top: 2vw;
  }
}

@media screen and (max-height: 450px) {
  .deposit-share .deposit-instruction[data-v-ee504006] {
    position: static;
    margin-top: 2vw;
  }
}
</style>
