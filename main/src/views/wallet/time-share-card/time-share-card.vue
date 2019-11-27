<template>
  <div class="time-share-card flex-col align-items-center">
    <span class="money">{{cardTimeShare}}</span>
    <div class="input-content flex-row align-items-center">
      <span>出行卡号：</span>
      <input type="text" class="flex-1" placeholder="请输入出行卡号" v-model="prepaidCardNumber" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;">
    </div>
    <div class="input-content flex-row align-items-center last-input-content">
      <span>出行卡密码：</span>
      <input type="password" class="flex-1" v-model="prepaidCardPassword" placeholder="请输入出行卡密码" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;">
    </div>
    <button @click="recharge">立即充值</button>
    <div class="explain">
      <h3>使用说明</h3>
      <ul>
        <li class="flex-row  align-items-center" v-for="(item,index) in explainArr" :key="index">
          <span class="circle"></span>
          <span class="text">{{item}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cardTimeShare: '-',
      explainArr: [
        '本卡只限于一步用车会员使用，不可兑换现金',
        '登录官网、APP或微信公众号充值',
        '本卡不记名、不挂失、一经出售、概不退还',
        '请在截止日期前充值，逾期将视为放弃卡上金额',
        '一步用车保留对本卡使用的最终解释权'
      ],
      prepaidCardNumber: '',
      prepaidCardPassword: ''
    }
  },
  computed: {
    userId() {
      return this.$store.getters.user.id
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getTimeShareCardMoney()
    })
  },
  methods: {
    recharge() {
      if (this.prepaidCardNumber && this.prepaidCardPassword) {
        this.$service.timeShareCardRecharge(this.userId, this.prepaidCardNumber, this.prepaidCardPassword).then((res) => {
          this.prepaidCardNumber = ''
          this.prepaidCardPassword = ''
          this.$toast('充值成功')
          this.getTimeShareCardMoney()
        })
      } else {
        this.$toast('请输入卡号和密码')
      }
    },
    getTimeShareCardMoney() {
      this.$service.timeShareCardMoney(this.userId).then((res) => {
        this.cardTimeShare = res.data.data.cardTimeShare
      })
    }
  }
}
</script>
<style lang="scss">
.time-share-card {
  background: #ffffff;
  //
  min-height: vw(600);
  .money {
    width: 100%;
    height: vw(149);
    text-align: center;
    line-height: vw(149);
    font-size: vw(36);
    font-weight: bold;
    color: #3d3d3d;
    box-shadow: 0 vw(5) vw(12) 0 rgba(217, 226, 233, 0.5);
    &::after {
      content: '元';
      font-size: vw(14);
      color: #000000;
    }
  }
  .input-content {
    width: 100%;
    padding: 0 vw(16);
    margin-top: vw(16);
    height: vw(52);
    border: 1px solid #efefef;
    border-left: none;
    border-right: none;
    font-size: vw(16);

    span {
      color: #3d3d3d;
      width: vw(100);
    }
    input {
      font-size: vw(16);
      line-height: 5vw;
      outline: none;
      &::-webkit-input-placeholder {
        line-height: 5vw;
      }
    }
  }
  .last-input-content {
    margin: 0;
    border-top: none;
    margin-bottom: vw(30);
  }
  button {
    border: none;
    width: vw(343);
    height: vw(49);
    font-size: vw(17);
    color: #ffffff;
    background: #3d3d3d;
    border-radius: vw(2);
  }
  .explain {
    margin-top: vw(55);
    padding-left: vw(18);
    width: 100%;
    h3 {
      font-size: vw(14);
      color: #4a4a4a;
      font-weight: bold;
      margin-bottom: vw(5);
    }
    ul {
      width: 100%;
      li {
        color: #777777;

        .circle {
          display: inline-block;
          background: #bbb9ba;
          border-radius: 50%;
          width: vw(5);
          height: vw(5);
          margin-right: vw(8);
        }
        .text {
          font-size: vw(12);
          line-height: 7vw;
        }
      }
    }
  }
}
</style>
