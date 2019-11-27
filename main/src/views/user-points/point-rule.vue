<template>
  <div class="point-rule">
    <v-rules :rules="rules"></v-rules>
  </div>
</template>

<script>
import vRules from '@/components/rules/'
export default {
  components: { vRules },

  data() {
    return {
      rules: [
        {
          title: '1.积分获取规则',
          rules: [
            '分时订单每支付1元奖励1积分（只计算实际支付金额），积分一律取整，不计算小数点后的金额；每单奖励上限为 100分，每日奖励3单',
            '对订单进行评价，每次奖励5分，每日奖励3次',
            '邀请好友进行认证，每邀请一名好友完成了认证，则奖励30分',
            '每次签到奖励1分，每天奖励1次'
          ]
        },
        {
          title: '2.积分使用说明',
          rules: [
            '积分有效期最长2年，即从获得积分开始至次年年底，逾期自动作废',
            '积分仅作为用户在积分商城的兑换及抽奖活动',
            '如无特殊活动，积分不支持账户之间的互相转换',
            '积分是用于一步用户使用车辆出行服务、增值服务或其他行为的一种统计代码，并非任何代币票券，不能用于一步用车服务之外的任何商品或服务的支付或交换',
            '如用户出现违规刷积分行为，一步用车有权回收用户已获得的积分，必要时追究法律责任'
          ]
        }
      ]
    }
  },

  mounted() {
    this.$track('h5UserPointsRulePageOpen')
  }
}
</script>

<style lang="scss">
</style>
