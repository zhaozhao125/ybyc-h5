<template>
  <div class="wallet-index">
    <div class="wallet-balance flex-row align-items-center justify-content-between" :class="{'big-money': balance > 99999}">
      <div class="balance-money">
        <h2 class="fz-20">余额</h2>
        <a href="#" class="has-arrow dark-arrow fz-15 color-dark" @click.prevent="routeTo('balance')">
          <strong>{{balance}}</strong>
          <span>元</span>
        </a>
      </div>
      <div class="recharge-button bg-dark color-white text-center" @click="handleClickRecharge">充值</div>
    </div>
    <ul class="wallet-nav">
      <li>
        <div class="wallet-nav-item flex-row align-items-center justify-content-between" @click="routeTo('red-packet')">
          <div class="left-title">
            <h2 class="fz-16">红包</h2>
          </div>
          <a href="#" @click.prevent.stop="routeTo('red-packet')" class="fz-16 color-gray-light has-arrow">
            <span class="color-dark">{{redPacketMoney}}</span>
            <span>元</span>
          </a>
        </div>
      </li>
      <li>
        <div class="wallet-nav-item flex-row align-items-center justify-content-between" @click="routeTo('timeShareCard')">
          <div class="left-title">
            <h2 class="fz-16">分时出行卡</h2>
            <p class="fz-12" style="color:#F5A623">充值卡充值入口</p>
          </div>
          <a href="#" @click.prevent.stop="routeTo('timeShareCard')" class="fz-16 color-gray-light has-arrow">
            <span class="color-dark">{{timeShareCard}}</span>
            <span>元</span>
          </a>
        </div>
      </li>
      <li>
        <div class="wallet-nav-item flex-row align-items-center justify-content-between" @click="routeTo('depositShare')">
          <div class="left-title">
            <h2 class="fz-16">分时保证金</h2>
            <p class="fz-12">{{shareNote}}</p>
          </div>
          <a href="#" @click.prevent.stop="routeTo('depositShare')" class="fz-16 color-gray-light has-arrow">
            <span class="color-dark">{{shareDeposit}}</span>
            <span>元</span>
          </a>
        </div>
      </li>
      <li>
        <div class="wallet-nav-item flex-row align-items-center justify-content-between" @click="routeTo('depositRent')">
          <div class="left-title">
            <h2 class="fz-16">长租保证金</h2>
            <p class="fz-12">{{rentNote}}</p>
          </div>
          <a href="#" @click.prevent.stop="routeTo('depositRent')" class="fz-16 color-gray-light has-arrow">
            <span class="color-dark">{{rentDeposit}}</span>
            <span>元</span>
          </a>
        </div>
      </li>
    </ul>
  </div>

</template>

<script>
import { duringBonusDay } from '@/util/common.js'
export default {
  name: 'wallet',

  data() {
    return {
      balance: '-', // 钱包余额
      redPacketMoney: '-', // 用户红包余额
      timeShareCard: '-',
      shareDeposit: '-', // 分时保证金余额
      shareNote: '-', // 分时保证金提示文字
      rentDeposit: '-', // 长租保证金余额
      rentNote: '-' // 分时保证金提示文字
    }
  },

  computed: {
    activeFinished() {
      let deadline = new Date(2018, 2, 23, 0, 0, 0).getTime()
      return Date.now() >= deadline
    }
  },

  methods: {
    routeTo(route) {
      this.$router.push({
        name: route
      })
    },
    handleClickRecharge() {
      if (duringBonusDay()) {
        this.$router.push({ name: 'bonusPay', query: { type: 'balance' } })
      } else {
        this.$router.push({ name: 'pay', query: { type: 'balance' } })
      }
    }
  },
  created() {
    let getUser = () => {
      if (this.$store.getters.user) {
        this.$service
          .getUserMoneyDetail(this.$store.getters.user.id)
          .then(res => {
            let result = res.data.data
            this.balance = result.userMoneyTotal

            this.timeShareCard = result.cardTimeShare

            this.redPacketMoney = result.userRedPacket

            this.shareDeposit = result.timeShareRentDeposit
            this.shareNote = result.timeShareRentDepositNote

            this.rentDeposit = result.longTermRentDeposit
            this.rentNote = result.longTermRentDepositNote
          })
          .catch()
          .then(() => {})
      } else {
        setTimeout(() => {
          getUser()
        }, 100)
      }
    }
    getUser()
  },
  mounted() {}
}
</script>

<style lang="scss" scoped="">
.wallet-index {
  .wallet-balance {
    background-image: linear-gradient(-114deg, #ffed00 0%, #fdd000 97%);
    padding: 0 4vw;
    height: 43vw;
    .balance-money {
      strong {
        font-size: 11.2vw;
        display: inline-block;
        margin-right: 1vw;
      }
    }
    .recharge-button {
      border: 1px solid #fdfdfe;
      border-radius: 100px;
      width: 35vw;
      height: 11.5vw;
      line-height: 11.5vw;
      margin-top: 7vw;
    }
    &.big-money {
      flex-direction: column;
      justify-content: center;
      .recharge-button {
        margin-top: 2vw;
      }
    }
  }
  .wallet-nav {
    width: 90%;
    margin: 0 auto;
    li {
      border-bottom: 1px solid $color-gray-border;
      &:last-of-type {
        border: 0;
      }
    }
    .wallet-nav-item {
      height: 20vw;
    }
  }
}
</style>
