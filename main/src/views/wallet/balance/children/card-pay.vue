<template>
  <div class="pay-content">
    <div class="pay-content-wrapper">
      <div class="pay-member publice">
        <span>充值卡号</span>
        <input type="number" placeholder="请输入充值卡号" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;" v-model="cardNumber">
      </div>
      <div class="pay-password publice">
        <span>充值密码</span>
        <input type="number" placeholder="请输入充值密码" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;" v-model="cardPassword">
      </div>
      <div class="pay-botton">
        <mt-button type="default" @click="rechargeMoney">立即充值</mt-button>
      </div>
      <ul class="pay-explain">
        <li>使用说明：</li>
        <li>1.本卡只限于一步用车会员使用，不可兑换现金。</li>
        <li>2.登录官网、APP或微信公众号充值。</li>
        <li>3.本卡不记名、不挂失、一经出售，概不退还。</li>
        <li>4.请在截止日期前充值，逾期将视为放弃卡上金额。</li>
        <li>5.一步用车保留对本卡使用的最终解释权。</li>
      </ul>
    </div>
  </div>

</template>

<script>
import { Toast } from 'mint-ui'
export default {
  data() {
    return {
      cardNumber: '', // 充值卡号
      cardPassword: '' // 充值密码
    }
  },
  beforeCreate() {
    this.$loading.open()
  },
  mounted() {
    setTimeout(() => {
      this.$loading.close()
    }, 20)
  },
  methods: {
    rechargeMoney() {
      if (this.cardNumber.trim() === '') {
        Toast('请输入充值卡号')
        return
      }
      if (this.cardPassword.trim() === '') {
        Toast('请输入充值卡密码')
        return
      }
      this.$loading.open()
      this.$service
        .recharge(this.$store.getters.user.id, this.cardNumber.replace(/\s+/g, ''), this.cardPassword.replace(/\s+/g, ''))
        .then(res => {
          this.$loading.close()
          if (res.data.errCode === -1) {
            Toast(res.data.errMsg)
          } else {
            Toast('充值成功')
            this.$router.push({
              name: `balance`
            })
          }
        }).catch(e => {
          console.log(e)
        })
    }
  }
};
</script>

<style lang="scss">
.pay-content {
  .pay-content-wrapper {
    display: flex;
    flex-direction: column;
    width: 94.67%; //注意 不能设置高度为100% 否则会使激活虚拟键盘时压缩页面
    // height: 100%;
    margin: 0 auto;
    background: #ffffff;
    justify-content: flex-start;
  }
  .publice {
    display: flex;
    align-items: center;
    height: 14.14vw;
    border-bottom: 1px solid #e7e7e7;
    span {
      margin-left: 2.13vw;
      margin-right: 6.67vw;
      color: #3d3d3d;
      word-break: keep-all;
      white-space: nowrap;
      font-size: 4.3vw;
    }
    input {
      border: none;
      outline: medium;
      height: 11.73vw;
      text-indent: 3.4667vw;
      font-size: 4.3vw;
      &::-webkit-input-placeholder {
        line-height: 6.4vw;
        font-size: 4.3vw;
        color: #c8c8c8;
        text-indent: 3.4667vw;
      }
    }
  }
  .pay-botton {
    margin-top: 6.13vw;
    margin-bottom: 4vw;
    font-size: 10.2667vw;
  } // ul
  .pay-explain {
    font-size: 3.2vw;
    color: #a1a1a1;
    line-height: 5.87vw;
    margin-left: 2vw;
    word-break: keep-all;
    white-space: nowrap;
  }
}

.mint-button-text {
  font-size: 4.8vw;
  color: #3d3d3d;
}
</style>
