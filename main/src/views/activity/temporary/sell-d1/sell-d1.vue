<template>
<div class="activity-sell-d1">
  <button @click="handleSignUp">报名</button>
</div>
</template>

<script>
export default {
  data() {
    return {
      user: this.$store.getters.user
    }
  },

  mounted() {

  },

  methods: {
    handleSignUp() {
      if (this.user && this.user.id) {
        this.$fetch('/v26/user/get-user-info', {}, 'post').then(res => {
          console.log('====res====', res)
          let userPhone = res.data.data.user_phone
          let userName = res.data.data.user_name
          let url = 'http://localhost:3000/activity/signup'
          this.$fetch(url, {
            userId: this.user.id,
            activityCode: '2018SellD1',
            phone: userPhone,
            name: userName
          }).then(res2 => {
            console.log('====res2====', res2)
            this.$toast('报名成功')
          })
        })
      } else {
        this.$toast('请先登录')
      }
    }
  }
}
</script>

<style lang="scss">

</style>
