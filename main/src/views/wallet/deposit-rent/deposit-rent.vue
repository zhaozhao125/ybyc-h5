<template>
<div class="deposit-rent">
  <div class="title-card shadow-box overflow-hidden">
    <h2 @click="applyForRefund">长租保证金</h2>
    <p>仅长租车辆需交纳</p>
  </div>
  <div class="deposit-info">
    <!-- 违章押金 -->
    <div class="deposit-item offence-deposit">
      <div class="deposit-item--name">
        <h2>违章押金</h2>
        <small v-if="!loaded">读取中...</small>
        <small v-else-if="payInfo.hasOffenceRefund">退款中，预计1-3个工作日内审核完毕，届时将发起退款，请注意查收</small>
        <small v-else-if="payInfo.offenceDepositFree">已免押金，无需交纳</small>
        <a href="#"
           v-else-if="payInfo.overflow == -1"
           @click.prevent="goPay('offence')"
           class="has-arrow">去交纳<span></span></a>
        <small v-else-if="payInfo.overflow ==1 || payInfo.overflow == 0">已交纳</small>
      </div>
      <div class="deposit-item--balance">
        <span>{{payInfo.offenceBalance}}元</span>
        <a href="#"
           @click.prevent="applyForRefund('offence')"
           v-if="payInfo.offenceBalance && !payInfo.hasOffenceRefund && loaded">申请退款</a>
      </div>
    </div>
    <!-- 车辆押金 -->
    <div class="deposit-item car-deposit">
      <div class="deposit-item--name">
        <h2>车辆押金</h2>
        <small v-if="!loaded">读取中...</small>
        <small v-else-if="payInfo.hasCarRefund">退款中，预计1-3个工作日内审核完毕，届时将发起退款，请注意查收</small>
        <small v-else-if="payInfo.carDepositFree">已免押金，无需交纳</small>
        <a href="#"
           v-else-if="!isNaN(Number(payInfo.carBalance))"
           @click.prevent="goPay('car')"
           class="has-arrow">去交纳<span></span></a>
      </div>
      <div class="deposit-item--balance">
        <span>{{payInfo.carBalance}}元</span>
        <a href="#"
           @click.prevent="applyForRefund('car')"
           v-if="payInfo.carBalance && !payInfo.hasCarRefund && loaded">申请退款</a>
      </div>
    </div>
  </div>
  <!-- <div class="deposit-explain">
    <p>保证金说明：</p>
    <p>车辆押金用户XXX，违章押金用于XXXX，退款规则XXXX</p>
  </div> -->
</div>

</template>

<script>
export default {

  name: 'deposit-rent',

  data() {
    return {
      loaded: false,
      payInfo: {
        offenceDeposit: '', // 应交违章押金
        carDeposit: '', // 应交车辆押金
        hasOffenceRefund: false, // 是否有违章押金退款
        offenceRefund: '', // 违章押金退款金额
        hasCarRefund: false, // 是否有车辆押金退款
        carRefund: '', // 车辆押金退款金额
        offenceBalance: '-', // 违章押金余额
        carBalance: '-', // 车辆押金余额
        overflow: '', // 是否需要交纳违章押金,overFlow=-1：需交纳  overFlow=1:可差额退款 overFlow=0:相等
        overflowAmount: '', // 违章押金应交和实交差
        offenceDepositFree: false, // 是否免违章押金
        carDepositFree: false // 是否免车辆押金
      }
    }
  },

  methods: {
    goPay(type) {
      if (type === 'offence') {
        this.$router.push({
          name: 'pay',
          query: {
            money: this.payInfo.overflowAmount,
            type: 'rentOffence'
          }
        })
      } else if (type === 'car') {
        this.$router.push({
          name: 'pay',
          query: {
            type: 'rentCar',
            canUseCar: this.payInfo.overflow == -1 ? 0 : 1
          }
        })
      }
    },
    applyForRefund(type) {
      let refundType = type == 'offence' ? 'longTermRentViolationDeposit' : 'longTermRentCarDeposit'
      this.$service.canRefund(this.$store.getters.user.id, refundType).then(res => {
        this.$message.confirm('退押金后你将无法使用长租车辆<br>确定申请退款吗？', '提示').then(action => {
          if (type === 'offence') {
            this.$store.commit('applyForRefund', {
              money: this.payInfo.offenceBalance,
              type: 'rentOffence'
            })
          } else if (type === 'car') {
            this.$store.commit('applyForRefund', {
              money: this.payInfo.carBalance,
              type: 'rentCar'
            })
          }
          this.$router.push({
            name: 'refund'
          })
        })
      }).catch(e => {
        if (e.errCode) {
          setTimeout(() => {
            document.querySelector('.mint-toast').remove()
          }, 100)
          this.$message.alert(e.errMsg)
        }
      })
    }
  },
  created() {
    this.$service.getRentDepositDetail(this.$store.getters.user.id).then(res => {
      let result = res.data
      let data = result.data
      this.payInfo.offenceDeposit = data.longTermRentViolationDepositWaterLine
      // this.payInfo.carDeposit
      this.payInfo.hasOffenceRefund = data.hasUnFinishViolationRefund
      this.payInfo.offenceRefund = data.unFinishViolationRefundAmount
      this.payInfo.hasCarRefund = data.hasUnFinishCarRefund
      this.payInfo.carRefund = data.unFinishCarRefundAmount
      this.payInfo.offenceBalance = data.longTermRentViolationDeposit
      this.payInfo.carBalance = data.longTermRentCarDeposit
      this.payInfo.overflow = data.overFlow
      this.payInfo.overflowAmount = data.overFlowSubAmount
      this.payInfo.offenceDepositFree = data.isAvoidLongTermRentViolationDeposit
      this.payInfo.carDepositFree = data.isAvoidLongTermRentCarDeposit
      this.loaded = true
    })
  }
}
</script>

<style lang="scss">
.deposit-rent {
  padding: 5vw 3vw;
  .title-card {
    height: 38.7vw;
    background-image: url('~@/assets/img/deposit-car.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom right;
    h2 {
      margin-top: 4vw;
      margin-left: 5vw;
    }
    p {
      margin-top: 3vw;
      margin-left: 5vw;
    }
  }
  .deposit-info {
    margin-top: 5vw;
    .deposit-item {
      display: flex;
      align-items: center;
      height: 20vw;
      border-bottom: 1px solid $color-gray-border;
      &:last-of-type{
        border: 0;
      }
      .deposit-item--name {
        flex: 1;
        padding-right: 10vw;
        h2 {
          font-size: 3.7333vw;
          margin-bottom: 2vw;
          font-weight: bold;
        }
        a {
          font-size: 3.7333vw;
          color: $color-gray;
        }
        small {
          color: $color-gray-light;
        }
      }
      .deposit-item--balance {
        span {
          font-weight: bold;
          font-size: 5.86667vw;
        }
        a {
          display: block;
          text-align: right;
          padding-top: 2vw;
          color: $color-gray-light;
        }
      }
    }
  }
  .deposit-explain {
    margin-top: 5vw;
    line-height: 1.5em;
  }
}
</style>
