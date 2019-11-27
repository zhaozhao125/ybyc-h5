<template>
  <div class="share-deposit-instruction">
    <!-- <h1><span>分时保证金说明</span><div class="line"></div></h1> -->
    <h1 class="fz-16 font-bold">分时保证金说明</h1>
    <ul>
      <li>“应交保证金”指您应交的保证金金额，“已交保证金”指您已交的保证金金额；</li>
      <li>若您通过信用认证减免标准，则对应的减免您的应交保证金；</li>
      <li>若信用减免押金后，应交保证金＜已交保证金，您可选择退差额，退差额不影响您正常用车；</li>
      <li>若因违章、车损等原因被扣除保证金，应交保证金＞已交保证金，您需补齐差额后才可继续用车；</li>
      <li>申请退款：当前有进行中的分时订单，不可申请退款；还车后15个工作日之内，不可申请退款；</li>
      <li>如您对分时保证金有疑问，请致电客服电话400-111-1818
        <!-- <a href="tel:400-111-1818">400-111-1818</a> -->
      </li>
    </ul>
    <div class="bottom-logo"></div>
    <!-- <img @click="handleTrick" src="~@/assets/img/logo.jpg" alt=""> -->
  </div>
</template>
<script>
export default {

  name: 'shareDepositInstruction',

  data() {
    return {
      trickIndex: 0
    }
  },

  methods: {
    handleTrick() {
      this.trickIndex++
      if (this.trickIndex > 3) {
        // this.$router.push({
        //   name: 'reserveCar'
        // })
      }
    }
  }
}

</script>
<style lang="scss">
.share-deposit-instruction {
  h1 {
    border-bottom: 1px solid $color-gray-border;
    width: 90.4%;
    margin: auto;
    padding: 3.3vw 0 3vw;
  }
  ul {
    list-style: disc;
    font-size: 3.2vw;
    color: #a1a1a1;
    width: 85%;
    margin: 3vw auto;
    li {
      margin-bottom: 2vw;
      line-height: 1.5em;
      a {
        color: #a1a1a1;
        padding: 0 5px; // text-decoration: underline;
      }
    }
  }
  // >img {
  //   display: block;
  //   position: fixed;
  //   width: 27%;
  //   bottom: 7.5vw;
  //   left: 0;
  //   right: 0;
  //   margin: auto;
  // }
}

@media screen and (max-height: 400px) {
  .share-deposit-instruction>img {
    position: static;
    margin-top: 16vw;
  }
}

</style>
