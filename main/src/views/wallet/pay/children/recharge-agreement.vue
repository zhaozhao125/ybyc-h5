<template>
  <div class="recharge-agreement">
    <div v-html="agreement" class="agreement"></div>
  </div>
</template>

<script>
export default {

  name: 'recharge-agreement',

  data () {
    return {
      agreement: ''
    }
  },

  mounted(){
    this.$service.getRechargeAgreement().then(res => {
      this.agreement = res.data
    })
  }
}
</script>

<style lang="scss">
.recharge-agreement{
  padding: 4vw;
  .agreement{
    *{
      font-size: 3.8vw;
    }
    p{
      margin: 2vw 0;
      color: $color-dark;
    }
    span{
      color: $color-dark;
    }
    strong{
      font-weight: bold;
    }
  }
}
</style>