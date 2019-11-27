<template>
  <div class="free-order-rules">
    <div class="rule-item">
      <h3>免单活动什么时候出现？</h3>
      <ul>
        <li>1.需要使用分时共享租车业务</li>
        <li>2.必须还车并支付完成</li>
        <li>3.支付时不能使用企业余额支付</li>
        <li>4.实际支付金额不低于5元，且未超过169元时</li>
        <li>满足以上四个条件时，免单活动就会出现。</li>
      </ul>
    </div>
    <div class="rule-item">
      <h3>如何提高免单成功率？</h3>
      <ul>
        <li>1.把活动分享到更多的微信群里面</li>
        <li>2.让更多没有使用过一步用车的好友参与到活动中，因为TA们的贡献值会很高</li>
      </ul>
    </div>
    <div class="rule-item">
      <h3>免单活动规则说明</h3>
      <ul>
        <li>1.免单任务完成后，活动页面会生成一个待领取的红包，点击后领取相应的金额，并可在红包余额中查看，红包可提现</li>
        <li>2.免单活动开启后，会持续24小时。如果没有在该时段内完成免单任务，则活动结束</li>
        <li>3.一个用户最多可以发起3个免单活动，超出限制后，免单活动不再出现，直到有活动结束或完成</li>
        <li>4.如果发现违规操作行为，我们会封停活动参与者和发起者双方的账号，冻结账号余额和红包余额</li>
      </ul>
    </div>
    <div class="bottom-logo"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="scss">
.free-order-rules {
  padding: 4.5vw;
  .rule-item {
    margin-bottom: 3vw;
    h3 {
      font-size: px2vw(16);
    }
    ul {
      opacity: 0.6;
      font-size: px2vw(12);
    }
    li{
      margin: 2vw;
    }
  }
}
</style>
