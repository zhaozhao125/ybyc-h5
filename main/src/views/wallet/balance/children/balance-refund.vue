<template>
  <div class="balance-refund">
    <div class="refund-main">
      <div class="refund-money flex-col justify-content-center align-items-center">
        <div class="fz-14 color-dark">
          退款金额
        </div>
        <div class="fz-14">
          <span class="fz-26">{{userBalance}}</span>
          元
        </div>
        <div class="fz-14 color-gray-light">
          为了让我们更好地为你服务，请填写退款原因
        </div>
      </div>
      <div class="refund-reason-select flex-row justify-content-between align-items-center" @click="reasonVisible=true">
        <div class="text-overflow-hidden">
          <span class="fz-16">退款原因：</span>
          <span class="fz-14 color-gray-light" v-if="!confirmRefundReasonCN">请填写退款原因</span>
          <span class="fz-16 color-dark" v-else>{{confirmRefundReasonCN}}</span>
        </div>
        <img src="@/assets/img/arrow-right.png" alt="">
      </div>
    </div>
    <div class="refund-rule color-gray-light">
      <h5 class="fz-14">退款说明：</h5>
      <ul class="fz-14">
        <li>1.仅退还全部充值余额</li>
        <li>2.赠送余额不可退还，将全部清零</li>
        <li>3.提交退款申请后，3-5个工作日内将完成退款流程，届时将依照充值时所使用的支付账户原路退还，请注意查收</li>
      </ul>
    </div>
    <mt-button class="bottom-button" type="default" :disabled="!refundReason" @click="handleSubmitRefund">确定</mt-button>
    <mt-popup v-model="reasonVisible" position="bottom">
      <div class="reason-container text-center">
        <header class="text-center position-relative">
          <img src="@/assets/img/x.png" alt="" @click="reasonVisible=false">
          <span class="fz-14">退款原因</span>
        </header>
        <div class="reason-list">
          <mt-radio v-model="refundReason" :options="reasonOptions">
          </mt-radio>
          <div class="refund-reason-text" v-show="refundReason=='other'" :data-text-length="refundReasonText.length">
            <textarea v-model="refundReasonText" class="plain-input width-90 margin-auto" rows="1" maxlength="10" placeholder="请输入吐槽意见，将会是我们前进的动力"></textarea>
          </div>
          <mt-button type="default" :disabled="reasonConfirmDisabled" @click="handlConfirmReason">确定</mt-button>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { Popup, Radio } from 'mint-ui'
export default {
  components: {
    mtPopup: Popup,
    mtRadio: Radio
  },
  data() {
    return {
      reasonVisible: false,
      // 退款原因
      reasonOptions: [],
      // 选择的退款原因
      refundReason: '',
      // 其他退款原因
      refundReasonText: '',
      // 确定的退款原因
      confirmRefundReason: '',
      // 确定的退款原因中文
      confirmRefundReasonCN: '',
      // 确定的其他退款原因
      confirmRefundReasonText: '',
      // 用户充值余额
      userBalance: '-',
      // 用户赠送余额
      userBalancePresentation: 0
    }
  },

  computed: {
    reasonConfirmDisabled() {
      if (this.refundReason === 'other' && this.refundReasonText) {
        return false
      }
      if (this.refundReason !== 'other' && this.refundReason) {
        return false
      }
      return true
    }
  },

  created() {
    this.$service.getUserMoneyRefundReasons().then(res => {
      this.reasonOptions = res.data.data.map(item => {
        return {
          label: item.reasonText,
          value: item.reason
        }
      })
    })
    this.$service.getBalance(this.$store.getters.user.id).then(res => {
      console.log('====res balance====', res)
      this.userBalance = res.data.data.userMoney
      this.userBalancePresentation = res.data.data.userMoneyPresentation
    })
  },

  methods: {
    getReasonCN() {
      if (this.refundReason == 'other') {
        return this.refundReasonText
      }
      let item = this.reasonOptions.find(
        item => item.value == this.refundReason
      )
      if (!item) {
        return ''
      }
      return item.label
    },
    handlConfirmReason() {
      this.confirmRefundReason = this.refundReason
      this.confirmRefundReasonCN = this.getReasonCN()
      if (this.confirmRefundReason == 'other') {
        this.confirmRefundReasonText = this.refundReasonText
      }
      this.reasonVisible = false
    },
    getBalanceRefundCondition() {
      let reasonText =
        this.confirmRefundReason == 'other'
          ? this.confirmRefundReasonText
          : this.reasonOptions.find(
            item => item.value == this.confirmRefundReason
          ).label
      this.$service.getBalanceRefundCondition(this.userBalance).then(res => {
        console.log('====res====', res)
        let result = res.data.data
        if (result.isShowBank) {
          this.$router.push({
            name: 'balanceRefundSubmit',
            params: {
              amount: this.userBalance,
              refundReason: this.confirmRefundReason,
              refundReasonText: reasonText,
              banks: result.banks,
              bankRefundAmount: result.bankRefundAmount,
              onlineRefundAmount: result.onlineRefundAmount
            }
          })
        } else {
          this.$service
            .submitBalanceRefund(
              this.userBalance,
              this.confirmRefundReason,
              reasonText
            )
            .then(res => {
              this.$message
                .alert('申请成功，3-5个工作日内退款原路返回至支付账户。')
                .then(() => {
                  this.$router.go(-1)
                })
            })
        }
      })
    },
    handleSubmitRefund() {
      if (
        this.userBalancePresentation &&
        !isNaN(this.userBalancePresentation)
      ) {
        this.$message
          .confirm(
            `退充值余额会将赠送余额${
              this.userBalancePresentation
            }元清零，确定要继续退款吗？`
          )
          .then(() => {
            this.getBalanceRefundCondition()
          })
      } else {
        this.getBalanceRefundCondition()
      }
    }
  },

  watch: {
    reasonVisible(val) {
      if (!val) {
        this.refundReason = this.confirmRefundReason
        this.refundReasonText = this.confirmRefundReasonText
      }
    }
  },

  beforeDestroy() {
    this.$message.close()
  }
}
</script>

<style lang="scss">
.balance-refund {
  padding: 3vw;
  .refund-main {
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.12);
    .refund-money {
      padding: 4.5vw 0;
      border-bottom: 1px solid #f9f9f9;
    }
    .refund-reason-select {
      padding: 3vw 4vw;
      img {
        width: 2vw;
        transform: rotate(90deg);
      }
    }
  }
  .refund-rule {
    margin-top: 5vw;
    padding: 3vw;
  }
  .mint-popup {
    width: 100%;
  }
  .reason-container {
    header {
      padding: 3vw;
      img {
        position: absolute;
        width: px2vw(14);
        top: 0;
        bottom: 0;
        left: 3vw;
        margin: auto;
      }
    }
    .mint-cell:last-child {
      background: none;
    }
    .mint-cell-wrapper {
      font-size: px2vw(14);
      background: none;
    }
    .mint-button {
      width: 90%;
      margin: auto;
      margin-bottom: 2vw;
    }
    textarea {
      font-size: px2vw(14);
      background: #f9f9f9;
      border-radius: px2vw(2);
      padding: 4vw;
      box-sizing: border-box;
    }
    .refund-reason-text {
      margin-bottom: 2vw;
      position: relative;
      &::after {
        content: attr(data-text-length) '/10';
        position: absolute;
        right: 7vw;
        top: 0;
        bottom: 0;
        font-size: 12px;
        color: #a1a1a1;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
