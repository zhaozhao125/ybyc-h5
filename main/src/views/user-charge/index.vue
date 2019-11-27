<template>
  <transition :name="transitionName">
    <router-view class="router"></router-view>
  </transition>
</template>
<script>
import userCharge from '@/service/user-charge/'
import routerTransition from '@/mixins/router-transition'
export default {
  name: 'user-charge-index',
  mixins: [routerTransition],

  beforeCreate() {
    Object.assign(this.$service, userCharge)
  }
  // 测试环境
  // 充电指引路径
  // 特来电 http://test.1byongche.cn/h5/app/main/#/charge-guide/type1
  // 一电 http://test.1byongche.cn/h5/app/main/#/charge-guide/type2
  // 洁电 http://test.1byongche.cn/h5/app/main/#/charge-guide/type3
  // 驿普乐氏 http://test.1byongche.cn/h5/app/main/#/charge-guide/type4
  // 生产环境

  // https://h5.1byongche.com/app/main/#/

}
</script>
