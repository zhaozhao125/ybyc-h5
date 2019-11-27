<template>
  <div class="invite-rules">
    <v-rules title="奖励规则" :rules="rules"></v-rules>
  </div>
</template>
<script>
import vRules from '@/components/rules/'
export default {
  name: 'rules',

  components: { vRules },

  data() {
    return {
      rules: [
        '您的好友通过邀请链接注册，将获得66元优惠券礼包',
        '当好友完成实名认证后，您将获得20元分时优惠券一张（实名认证自动化审核，上传证件后只需3秒就能完成认证噢~）',
        '当好友完成首次用车后，您将获得30元分时优惠券一张',
        '优惠券有效期为7天，仅可抵扣分时用车业务'
      ]
    }
  },

  created() {
    window.sa.track('invitationOpenRules')
  }
}
</script>
<style lang="scss">
</style>
