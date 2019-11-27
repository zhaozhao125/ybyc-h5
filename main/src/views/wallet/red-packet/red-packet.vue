<template>
  <div class="red-packet">
    <div class="money-container flex-col align-items-center justify-content-center bottom-shadow text-center">
      <div class="money-number">
        <strong>{{redPacketMoney}}</strong>元
      </div>
      <p>金额满{{minWithdrawMoney}}元可提现，今天还剩{{todayWithdrawTimes}}次</p>
      <router-link class="red-packet-detail color-gray" :to="{name: 'red-packet-details'}">红包明细</router-link>
    </div>
    <div class="button-container text-center">
      <mt-button type="default" :disabled="redPacketMoney==0" @click="handleTransferMoney">转入赠送余额</mt-button>
      <mt-button type="default" plain :disabled="!canWithdraw" @click="handleWithdraw">提现</mt-button>
      <div class="wechat-account">
        <p v-if="wechatAccount" class="fz-14 color-gray-light">
          <span>已绑定微信账户：</span>
          <span>{{wechatNickname}}</span>
        </p>
        <p v-else class="fz-14 color-gray-light">
          <span>未绑定微信账户</span>
          <a href="#" class="fz-14 color-black" @click="bindWechat">去绑定</a>
        </p>
      </div>
    </div>
    <!-- <mt-button type="default" @click="bindWechat">测试绑定微信</mt-button> -->
    <div class="bottom-link text-center position-absolute width-100">
      <router-link class="red-packet-rules color-gray-light text-decoration-underline" :to="{name: 'red-packet-rules'}">红包规则</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      redPacketInfo: null,
      // 红包余额
      redPacketMoney: '-',
      // 单次最小提现金额
      minWithdrawMoney: '-',
      // 今天提现剩余次数
      todayWithdrawTimes: '-',
      // 是否可提现
      canWithdraw: false,
      // 绑定的微信账户
      wechatAccount: '',
      // 绑定的微信昵称
      wechatNickname: ''
    }
  },

  computed: {
    user() {
      return this.$store.getters.user
    }
  },

  created() {
    this.getRedPacketInfo()
    this.getBindAccounts()
  },

  methods: {
    getBindAccounts() {
      this.$service.getBindAccounts().then(res => {
        console.log('====res====', res)
        let accountList = res.data.data
        if (accountList.length) {
          let wechatData = accountList.find(
            item => item.programName == 'weixin_app'
          )
          if (wechatData) {
            this.wechatAccount = wechatData.openid
            this.wechatNickname = wechatData.nickname
          }
        }
      })
    },
    getRedPacketInfo() {
      this.$service.getRedPacketInfo(this.$store.getters.user.id).then(res => {
        console.log('====res====', res)
        let result = res.data.data
        this.redPacketInfo = result
        this.redPacketMoney = result.userRedPacket
        this.minWithdrawMoney = result.singleAmountMin
        this.todayWithdrawTimes = result.todayWithdrawResidueTimes
        this.canWithdraw =
          result.todayWithdrawResidueTimes > 0 &&
          result.userRedPacket >= result.singleAmountMin
      })
    },
    handleTransferMoney() {
      this.$message.confirm('赠送余额可抵扣分时车费，不支持提现或退款。', '红包转赠送余额').then(action => {
        this.$service
          .transferRedPacketToUserBalance(
            this.$store.getters.user.id,
            this.redPacketMoney
          )
          .then(res => {
            this.$toast('转到赠送余额成功')
            this.getRedPacketInfo()
          })
          .catch(err => {})
      })
    },
    appUpgrade() {
      if (this.user.client == 1) {
        // iOS
        this.$message({
          message: '需要升级到3.1.2及以上版本才能提现哦~',
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: '我要升级'
        }).then(cmd => {
          if (cmd == 'confirm') {
            location.href =
              'https://a.app.qq.com/o/simple.jsp?pkgname=com.usercar.yongche'
          }
        })
      } else {
        // android
        this.$message({
          message: '需要升级到3.1.2及以上版本才能提现哦~',
          showConfirmButton: true,
          showCancelButton: false,
          confirmButtonText: '我知道了'
        })
      }
    },
    handleWithdraw() {
      console.log('====this.user====', this.user)
      if (this.user.version < 312) {
        this.appUpgrade()
        return
      }
      if (!this.wechatAccount) {
        this.$message({
          message:
            '你需要绑定微信账号才能提现，提现成功后自动转入微信零钱账户。',
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: '绑定微信账户'
        }).then(cmd => {
          if (cmd == 'confirm') {
            this.bindWechat()
          }
        })
        return
      }
      if (this.todayWithdrawTimes < 1) {
        this.$toast('每天最多提现1次')
        return
      }
      if (this.redPacketMoney < this.minWithdrawMoney) {
        this.$toast('满50元才能提现')
        return
      }
      let withdrawMoneyAmount
      let confirmStr
      if (this.redPacketMoney > this.redPacketInfo.singleAmountMax) {
        withdrawMoneyAmount = this.redPacketInfo.singleAmountMax
        confirmStr = `每日最多提现${
          this.redPacketInfo.singleAmountMax
        }元，是否要继续提现？`
      } else {
        withdrawMoneyAmount = this.redPacketMoney
        confirmStr = '确定提现吗？'
      }
      if (isNaN(withdrawMoneyAmount)) {
        this.$toast('提现金额有误')
        return
      }
      console.log('====gogogo====')
      this.$message.confirm(confirmStr).then(action => {
        this.$service
          .redPacketWithdraw(
            this.user.id,
            withdrawMoneyAmount,
            this.user.version
          )
          .then(res => {
            console.log('====res====', res)
            this.$message
              .alert(
                `${withdrawMoneyAmount.toFixed(
                  2
                )}元已发起提现，稍后请查看微信零钱账户`
              )
              .then(() => {
                this.getRedPacketInfo()
              })
          })
          .catch(err => {
            if (err.errCode == 100300) {
              this.bindWechat()
            }
          })
      })
    },
    bindWechat() {
      if (this.user.version < 312) {
        this.appUpgrade()
        return
      }
      this.$callHandler('WeChatAuth').then(res => {
        console.log('====handler res====', res)
        if (res.code) {
          this.$service
            .bindWechat(res.code)
            .then(res => {
              console.log('====bindWechat res====', res)
              this.$toast({
                message: '绑定成功',
                iconClass: 'pay-success-icon'
              })
              this.getBindAccounts()
            })
            .catch(err => {
              // alert('bindWechat err')
              // alert(JSON.stringify(err))
              // this.$toast()
            })
        } else {
          alert('no code')
          alert(JSON.stringify(res))
        }
      })
    }
  },

  beforeDestroy() {
    this.$message.close()
  }
}
</script>

<style lang="scss" scoped>
.red-packet {
  .money-container {
    height: 60vw;
    margin-bottom: 13vw;
    .money-number {
      strong {
        font-size: 9.6vw;
      }
    }
    p {
      margin-top: 5vw;
      font-size: 4.26667vw;
    }
    .red-packet-detail {
      position: absolute;
      top: 3vw;
      right: 3vw;
      padding: 2vw;
    }
  }
  .button-container {
    width: 85%;
    margin: 0 auto;
    .mint-button--primary {
      margin-bottom: 5vw;
    }
    .mint-button--default {
      margin-bottom: 5vw;
    }
  }
  .bottom-link {
    bottom: 2vw;
  }
}
</style>
