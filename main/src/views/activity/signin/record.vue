<template>
  <div class="signin-record">
    <div class="record-container">
      <div class="record-item">
        <p class="number-text">
          <span class="big-text">{{signinCount}}</span>
          <span class="small-text">天</span>
        </p>
        <p class="yellow-text">累计签到</p>
      </div>
      <div class="record-item">
        <p class="number-text">
          <span class="big-text">{{shareCount}}</span>
          <span class="small-text">次</span>
        </p>
        <p class="yellow-text">累计分享</p>
      </div>
      <div class="record-item">
        <p class="number-text">
          <span class="big-text">{{couponCount}}</span>
          <span class="small-text">元</span>
        </p>
        <p class="yellow-text">累计赠券</p>
      </div>
      <div class="record-item">
        <p class="number-text">
          <span class="big-text">{{lastWeekSigninCount}}</span>
          <span class="small-text">天</span>
        </p>
        <p class="yellow-text">上周累计签到</p>
      </div>
      <div class="record-item">
        <p class="number-text">
          <span class="big-text">{{lastWeekShareCount}}</span>
          <span class="small-text">次</span>
        </p>
        <p class="yellow-text">上周累计分享</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 累计签到次数
      signinCount: '-',
      // 累计分享次数
      shareCount: '-',
      // 累计赠券金额
      couponCount: '-',
      // 上周签到次数
      lastWeekSigninCount: '-',
      // 上周分享次数
      lastWeekShareCount: '-'
    }
  },

  computed: {
    user() {
      console.log('====this.$store.getters.user====', this.$store.getters.user)
      return this.$store.getters.user
    }
  },

  created() {
    this.$fetch('/v26/user/get-user-check-overview', {
      user_id: this.user.id
    }).then(res => {
      console.log('====res====', res)
      this.signinCount = res.data.data.day_check_nums
      this.shareCount = res.data.data.day_shares_nums
      this.couponCount = res.data.data.total_money
      this.lastWeekSigninCount = res.data.data.lastweek_check_nums
      this.lastWeekShareCount = res.data.data.lastweek_shares_nums
    })
  }
}
</script>

<style lang="scss">
.signin-record {
  background: #f0f0f0;
  .record-container {
    width: 92%;
    margin: 3vw auto 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .record-item {
      background: #ffffff;
      box-shadow: 0 px2vw(2) px2vw(4) 0 rgba(210, 210, 210, 0.5);
      border-radius: px2vw(10);
      flex: 0 0 47.8%;
      margin-top: 3vw;
      overflow: hidden;
      &:nth-of-type(even) {
        margin-left: 4vw;
      }
      .number-text {
        line-height: 1;
        text-align: center;
        margin: 4vw 0;
        color: #3d3d3d;
        .big-text {
          font-size: px2vw(72);
        }
        .small-text {
          font-size: px2vw(16);
        }
      }
      .yellow-text {
        background: #fed400;
        font-size: px2vw(14);
        margin-bottom: 3vw;
        color: #3d3d3d;
        text-align: center;
      }
    }
  }
}
</style>
