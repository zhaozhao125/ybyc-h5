<template>
  <div class="invite-rules">
    <v-rules title="红包规则" :rules="rules"></v-rules>
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
        '红包满50元时，你可以提现到微信账户中；',
        '每天最多提现1次，每次最多提现200元；',
        '红包提现不收取手续费；',
        '红包提现后会在1-3个工作日内到账，如未到账请致电400-111-1818；',
        '红包金额可以转入钱包的赠送余额，赠送余额不能提现。'
      ]
    }
  }
}
</script>
<style lang="scss">
</style>
