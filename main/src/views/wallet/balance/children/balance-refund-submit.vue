<template>
  <div class="balance-refund-submit">
    <div class="refund-money shadow-box text-center">
      <p>申请退款金额</p>
      <img class="display-block" src="~@/assets/img/refund-money1.png" alt="">
      <span class="fz-22 font-bold display-inline-block">{{refundAmount}}元</span>
      <p>申请成功后，3-5个工作日内退款到账</p>
    </div>
    <!-- <pre>{{formData}}{{cardType}}</pre> -->
    <div class="refund-form">
      <p>系统根据您最近3个月的交费记录，{{onlineRefundAmount}}元将原路退回到支付账户； 剩余{{bankRefundAmount}}元需提供银行卡号进行退款，请准确填写
      </p>
      <form action="" class="fz-15">
        <div class="form-item">
          <label for="inputName">持卡人姓名</label>
          <input type="text" class="input-item fz-15" maxlength="15" placeholder="请输入真实姓名" id="inputName" v-model="formData.name">
        </div>
        <div class="form-item">
          <label for="inputCardNumber">请输入卡号</label>
          <input type="tel" class="input-item fz-15" maxlength="19" placeholder="请输入个人卡号" id="inputCardNumber" v-model="formData.cardNumber">
        </div>
        <div class="form-item">
          <label for="inputCardType">卡类型</label>
          <label for="inputCardType" class="select-placeholder">
            <span v-if="!formData.bankId">请选择卡类型＞</span>
            <span class="selected-val color-black" v-else>{{cardType}}</span>
          </label>
          <select placeholder="请选择卡类型" class="input-item position-absolute right-0 opacity-0 height-100" id="inputCardType" v-if="bankList && bankList.length" v-model="formData.bankId">
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
    <mt-button @click="handleSubmit" type="default">提交申请</mt-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 退款总额
      refundAmount: 0,
      // 原路退回数额
      onlineRefundAmount: '-',
      // 银行卡退回数额
      bankRefundAmount: '-',
      // 银行列表
      bankList: [],
      formData: {
        name: '',
        cardNumber: '',
        bankId: ''
      },
      // 选择的银行卡类型
      cardType: '',
      refundReason: '',
      refundReasonText: ''
    }
  },

  created() {
    console.log('====route====', this.$route)
    let params = this.$route.params
    this.refundAmount = params.amount
    this.onlineRefundAmount = params.onlineRefundAmount
    this.bankRefundAmount = params.bankRefundAmount
    this.bankList = params.banks
    this.refundReason = params.refundReason
    this.refundReasonText = params.refundReasonText
  },

  methods: {
    handleSubmit() {
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

      let amount = this.refundAmount
      if (isNaN(Number(amount)) || Number(amount) <= 0) {
        this.$toast('您的退款金额有误，不能提交退款')
        return
      }

      this.$service
        .submitBalanceRefund(
          amount,
          this.refundReason,
          this.refundReasonText,
          this.formData.bankId,
          this.formData.cardNumber,
          this.formData.name
        )
        .then(res => {
          this.$message
            .alert('申请成功，3-5个工作日内退款原路返回至支付账户。')
            .then(() => {
              this.$router.go(-2)
            })
        })
        .catch(e => {})
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
.balance-refund-submit {
  padding: 5vw 3vw;
  .refund-money {
    padding-top: 3vw;
    padding-bottom: 3vw;
    margin-bottom: 5vw;
    img {
      width: 26%;
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
        }
        .input-item {
          width: 60vw;
          outline: none;
        }
      }
      select {
        z-index: 9;
      }
    }
  }
  .refund-explain {
    margin-bottom: 6vw;
  }
}
</style>
