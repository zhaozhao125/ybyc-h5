<template>
  <div class="balance bg-white width-100 height-100">
    <!-- 容器开始 -->
    <div class="content flex-col" v-for="(item,index) in totalArr" :key="index">
      <!-- 可用余额开始 -->
      <div class="canuse-money flex-col justify-content-center align-items-center width-100">
        <span class="color-dark font-bold text-center">{{userMoneyTotal }}</span>
        <span class="fz-14 color-dark">可用余额（元）</span>
      </div>
      <!--  可用余额结束-->
      <!-- 充值-赠送余额开始 -->
      <div class="pay width-100 flex-row justify-content-between align-items-center">
        <div class="pay-money flex-col justify-content-center align-items-center">
          <span class="color-dark font-bold width-100 text-center">{{userMoney}}</span>
          <span class="fz-14 color-gray">充值余额（元）</span>
        </div>
        <div class="give-money flex-col justify-content-center align-items-center">
          <span class="color-dark font-bold width-100 text-center">{{userMoneyPresentation}}</span>
          <span class="fz-14 color-gray">赠送余额（元）</span>
        </div>
      </div>
      <!-- 空白背景 -->
      <div class="bg-blank"></div>
      <!-- 充值-赠送余额结束 -->
      <!-- 充值按钮开始 -->
      <div class="pay-botton">
        <!-- 支付类型 -->
        <mt-button type="default" @click="handleClickPay">充值</mt-button>
      </div>
      <!-- 充值按钮结束 -->
      <div class="apply-refund fz-14 color-gray" v-if="showRefund" @click="hadnleApplyRefund">
        <span>申请退款</span>
      </div>
    </div>
    <!-- 容器结束 -->
  </div>
</template>

<script>
import { duringBonusDay } from '@/util/common.js'
// import {
//   MessageBox
// } from 'mint-ui';
// const ERR_OK = 'ok';
// 直接调用
export default {
  data() {
    return {
      totalArr: [], // 循环一下数据,否则会出现闪现
      userMoneyTotal: '-', // 总的余额
      userMoney: '-', // 充值余额  没有数据为“-”
      userMoneyPresentation: '-' // 赠送余额
    }
  },

  computed: {
    showRefund() {
      if (this.userMoney && !isNaN(this.userMoney) && this.userMoney > 0) {
        return true
      }
      return false
    }
  },

  mounted() {
    setTimeout(() => {
      this.$loading.open()
      this.$service.getBalance(this.$store.getters.user.id).then(res => {
        this.$loading.close()
        this.totalArr.push(res.data.data)
        this.userMoneyTotal = String(res.data.data.userMoneyTotal)
        this.userMoney = String(res.data.data.userMoney.toFixed(2))
        this.userMoneyPresentation = String(
          res.data.data.userMoneyPresentation.toFixed(2)
        )
      })
    }, 20)
  },
  methods: {
    handleClickPay() {
      if (duringBonusDay()) {
        this.$router.push({ name: 'bonusPay', query: { type: 'balance' } })
      } else {
        this.$router.push({ name: 'pay', query: { type: 'balance' } })
      }
    },
    hadnleApplyRefund() {
      // 检验用户退款能力
      this.$service.getBalanceRefundAbility().then(res => {
        this.$router.push({
          name: 'balanceRefund'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$publice-width: 2.6666vw;
.balance {
  .content {
    white-space: nowrap;
    .canuse-money {
      height: 97vw;
      background: url('~@/assets/img/balance-bg.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      span {
        &:first-child {
          font-size: 17vw;
          margin-bottom: 3vw;
          width: 98%;
        }
      }
    }
    .pay {
      height: 26.66vw;
      div {
        height: 15.73vw;
      }
      span {
        &:first-child {
          font-size: 5.8666vw;
          margin-bottom: 2.4vw;
        }
      }
      .pay-money {
        flex-grow: 1;
        border-right: 1px solid #e7e7e7;
      }
      .give-money {
        flex-grow: 1;
      }
    }
    .bg-blank {
      width: 100%;
      height: $publice-width;
      background: #f7f7f7;
    }
    .pay-botton {
      width: 94.666%;
      height: 11.7333vw;
      margin: 0 auto;
      margin-top: 4vw;
      margin-bottom: 4vw;
    }
    .apply-refund {
      align-self: flex-end;
      margin-right: 2.7vw;
    }
  }
}
</style>
