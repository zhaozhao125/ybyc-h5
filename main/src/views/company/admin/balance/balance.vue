<template>
  <div id="company-balance">
    <div class="content-top">
      <h1>{{balanceInfo.companyMoneyTotal|handlyMoney}}</h1>
      <span class="balance-tip">可用余额&nbsp;(&nbsp;元&nbsp;)</span>
      <div class="money-content">
        <div>
          <h3>{{balanceInfo.companyMoney|handlyMoney}}</h3>
          <span>充值余额&nbsp;(&nbsp;元&nbsp;)</span>
        </div>
        <div>
          <h3>{{balanceInfo.companyMoneyPresentation|handlyMoney}}</h3>
          <span>赠送余额&nbsp;(&nbsp;元&nbsp;)</span>
        </div>
      </div>
    </div>
    <div class="content-bottom">
      <span class="content-bottom-tip">当前仅支持公对公转账充值</span>
      <button @click="payMoney">充值</button>
      <button @click="jumpAccountDetail">收支明细</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      balanceInfo: this.$store.getters.companyMoney
    }
  },
  mounted() {

  },
  filters: {
    handlyMoney(data) {
      return data.toFixed(2)
    }
  },
  methods: {
    jumpAccountDetail() {
      this.$router.push({
        name: 'company-account-details'
      })
    },
    payMoney() {
      this.$message.alert('当前仅支持公对公转账充值', '提示')
    }
  }
}
</script>

<style lang="scss">
#company-balance {
  @function vw($px) {
    @return px2vw($px);
  }
  width: 100%;
  height: 100%;
  padding: vw(40) vw(25) vw(25) vw(25);
  background: #ffffff;
  display: flex;
  flex-direction: column;
  .content-top {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    h1 {
      font-size: vw(64);
      color: #3d3d3d;
      font-weight: bold;
    }
    .balance-tip {
      font-size: vw(12);
      color: #3d3d3d;
    }
    .money-content {
      margin-top: vw(41);
      display: flex;
      > div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        h3 {
          font-size: vw(22);
          color: #3d3d3d;
          margin-bottom: vw(11);
        }
        span {
          font-size: vw(12);
        }

        &:first-child {
          position: relative;
          padding-right: vw(44);
          &::before {
            content: '';
            position: absolute;
            right: 0;
            height: vw(59);
            width: 1px;
            background: #e7e7e7;
          }
        }
        &:last-child {
          padding-left: vw(44);
        }
      }
    }
  }
  .content-bottom {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .content-bottom-tip {
      font-size: vw(12);
      color: #a7a7a7;
      text-align: center;
    }
    button {
      border: none;
      border-radius: vw(2);
      height: vw(49);
      margin-bottom: vw(16);
      margin-top: vw(10);
      font-size: vw(17);
      font-weight: bold;
      background: #c0c0c0;
      color: #ffffff;
      &:last-child {
        background: #ffffff;
        border: 1px solid #3d3d3d;
        color: #3d3d3d;

        &:active {
          background: $color-gray;
          color: #ffffff;
          border: none;
        }
      }
    }
  }
}
</style>
