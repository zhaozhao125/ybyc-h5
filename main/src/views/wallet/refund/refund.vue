<template>
  <div class="refund">
    <div class="refund-money shadow-box text-center">
      <p>申请退款金额</p>
      <img src="~@/assets/img/refund-money1.png" alt="">
      <span class="fz-22 font-bold display-inline-block">{{refundMoney}}元</span>
      <p>{{refundMessage}}</p>
    </div>
    <!-- <pre>{{formData}}{{cardType}}</pre> -->
    <div class="refund-form" v-if="showBank">
      <p>系统根据您最近3个月的交费记录，{{onlineRefundAmount}}元将原路退回到支付账户； 剩余{{bankRefundAmount}}元需提供银行卡号进行退款，请准确填写
      </p>
      <form action="" class="fz-16">
        <div class="form-item">
          <label for="inputName">持卡人姓名</label>
          <input type="text" class="input-item fz-16" maxlength="15" placeholder="请输入真实姓名" id="inputName" v-model="formData.name">
        </div>
        <div class="form-item">
          <label for="inputCardNumber">请输入卡号</label>
          <input type="tel" class="input-item fz-16" maxlength="19" placeholder="请输入个人卡号" id="inputCardNumber" v-model="formData.cardNumber">
        </div>
        <div class="form-item">
          <label for="inputCardType">卡类型</label>
          <label for="inputCardType" class="select-placeholder fz-16">
            <span v-if="!formData.bankId">请选择卡类型＞</span>
            <span class="selected-val" v-else>{{cardType}}</span>
          </label>
          <select placeholder="请选择卡类型" class="input-item" id="inputCardType" v-if="bankList && bankList.length" v-model="formData.bankId">
            <option v-for="(item, index) in bankList" :key="index" :value="item.bankId">{{item.bankName}}</option>
          </select>
        </div>
      </form>
    </div>
    <div class="refund-explain">
      <p>原路退还说明： </p>
      <p>退款方式分为原路退款或者银行卡退款，系统根据交费时间自动匹配退款路径，如有疑问可咨询一步用车客服热线</p>
      <p>400-111-1818</p>
    </div>
    <mt-button @click="commitApply" type="default" class="commit-btn">提交申请</mt-button>
    <div class="apply-result" v-if="resultVisible">
      <div class="result-content">
        <img src="~@/assets/img/refund-money.png" alt="">
        <h2>提交退款申请成功</h2>
        <p>{{refundMessage}}</p>
        <mt-button @click="$router.push({name: 'wallet'})" type="default">返回我的钱包</mt-button>
      </div>
    </div>
  </div>

</template>

<script>
import refundConfig from '@/config/refund'

export default {
  name: 'refund',

  data() {
    return {
      resultVisible: false,
      showBank: false,
      bankList: [],
      bankRefundAmount: '-',
      onlineRefundAmount: '-',
      formData: {
        name: '',
        cardNumber: '',
        bankId: ''
      },
      cardType: '',
      refundMessage: '预计10个工作日内审核完毕，届时将发起退款，请注意查收'
    }
  },
  methods: {
    commitApply() {
      if (this.showBank) {
        if (!this.formData.name) {
          this.$toast({
            message: '请输入持卡人姓名',
            position: 'bottom'
          })
          return
        }
        if (!this.formData.cardNumber) {
          this.$toast({
            message: '请输入卡号',
            position: 'bottom'
          })
          return
        }
        if (this.formData.cardNumber.length < 16) {
          this.$toast({
            message: '输入的卡号长度不合法',
            position: 'bottom'
          })
          return
        }
        if (!this.formData.bankId) {
          this.$toast({
            message: '请选择卡类型',
            position: 'bottom'
          })
          return
        }
      }
      let userId = this.$store.getters.user.id
      let refundData = this.$store.getters.refundData
      let amount = refundData.money
      let userMoneyType = refundConfig.refundType[refundData.type]
      let isToBalance = false
      let amountRate = refundData.amountRate || 'full'
      let refundsResonsStr = JSON.stringify(refundData.reasons)

      if (isNaN(Number(amount)) || Number(amount) <= 0) {
        this.$toast('您的退款金额有误，不能提交退款')
        return
      }

      this.$service
        .applyForRefund(
          userId,
          amount,
          userMoneyType,
          isToBalance,
          amountRate,
          refundsResonsStr,
          this.formData.bankId,
          this.formData.cardNumber,
          this.formData.name
        )
        .then(res => {
          this.resultVisible = true
        })
        .catch(e => {})
    }
  },

  computed: {
    refundMoney() {
      return this.$store.getters.refundData.money || '-'
    }
  },

  created() {
    let refundData = this.$store.getters.refundData
    this.$service
      .getRefundCondition(
        this.$store.getters.user.id,
        refundData.money,
        refundConfig.refundType[refundData.type]
      )
      .then(res => {
        this.showBank = res.data.data.isShowBank
        this.bankList = res.data.data.banks
        if (window.navigator.userAgent.match(/iphone|ipad/gi)) {
          this.bankList.unshift({
            bankId: 0,
            bankName: '-请选择-'
          })
        }
        this.bankRefundAmount = res.data.data.bankRefundAmount
        this.onlineRefundAmount = res.data.data.onlineRefundAmount
      })

    if (refundData.amountRate == 'differ') {
      this.refundMessage = '提交申请后15个工作日内到账，请注意查收'
    }
  },

  watch: {
    'formData.cardNumber': function(val) {
      this.formData.cardNumber =
        isNaN(val.trim()) || val.length > 19
          ? val.substr(0, val.length - 1)
          : val.trim()
    },
    'formData.bankId': function(id) {
      if (!this.bankList || !this.bankList.length) {
        return
      }
      this.bankList.forEach(item => {
        if (item.bankId == this.formData.bankId) {
          this.cardType = item.bankName
        }
      })
    }
  }
}
</script>

<style lang="scss">
.refund {
  padding: 5vw 3vw;
  .refund-money {
    padding-top: 3vw;
    padding-bottom: 3vw;
    margin-bottom: 5vw;
    img {
      width: 26%;
      display: block;
      margin: 2vw auto 3vw;
    }
    span {
      margin-bottom: 4vw;
    }
    p {
      margin-bottom: 1vw;
    }
  }
  .refund-form {
    p {
      color: $color-blue;
      line-height: 1.5em;
    }
    form {
      margin: 4vw 0;
      .form-item {
        position: relative;
        height: 13vw;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e7e7e7;
        overflow: hidden;
        label:first-child {
          flex: 1;
        }
        .select-placeholder {
          width: 60vw;
          color: $color-placeholder;
          .selected-val {
            color: #000;
          }
        }
        .input-item {
          width: 60vw;
          outline: none;
        }
      }
      select {
        position: absolute;
        right: 0;
        opacity: 0; // width: 100%!important;
        height: 100%; // opacity: 0;
        z-index: 9; // transform: translate3d(0,0,0);
      }
    }
  }
  .refund-explain {
    p {
      color: $color-gray-light;
      line-height: 1.5em;
    }
  }
  .commit-btn {
    margin-top: 6vw;
  }
  .apply-result {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $color-bg;
    text-align: center;
    padding: 3vw;
    img {
      width: 46.4%;
      display: block;
      margin: 8vw auto 10vw;
    }
    h2 {
      margin-bottom: 5vw;
    }
    p {
      line-height: 1.5em;
    }
    button {
      margin-top: 5vw;
    }
  }
  .bank-popup {
    width: 100%;
  }
}
</style>
