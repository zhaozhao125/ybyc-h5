<template>
  <div class="free-order-friends-rank">
    <ul v-if="rankList && rankList.length">
      <li v-for="(item, index) in rankList" :key="index">
        <div class="rank-item flex-row justify-content-between align-items-center">
          <div class="rank-left flex-row align-items-center">
            <span class="fz-20">{{index+1}}</span>
            <img :src="item.wx_pic" alt="">
            <span class="fz-16">{{item.wx_name}}</span>
          </div>
          <div class="rank-right">
            <span class="fz-16">{{item.free_activity_reduce_account}}元</span>
          </div>
        </div>
      </li>
    </ul>
    <div class="no-data text-center" v-else>
      <img src="../img/no-data.png" alt="">
      <p class="fz-16 color-dark">怎么还没有好友帮你免单<br>是不是该请客吃饭了呢</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activityId: '',
      rankList: []
    }
  },

  created() {
    console.log('====id====', this.$route.params.id)
    this.activityId = this.$route.params.id
    this.$fetch('/v26/free-order-activity/user-list', {
      idActivity: this.activityId
    }).then(res => {
      console.log('====res====', res)
      this.rankList = res.data.data
    })
  }
}
</script>

<style lang="scss">
.free-order-friends-rank {
  .rank-item {
    height: px2vw(70);
    padding: 0 4vw;
    border-bottom: 1px solid #dcdcdc;
    .rank-left {
      img {
        width: px2vw(38);
        height: px2vw(38);
        object-fit: cover;
        object-position: center;
        border-radius: 50%;
        margin-left: 2vw;
        margin-right: 3vw;
      }
    }
  }
  .no-data {
    img {
      width: px2vw(124);
      margin-top: 20vw;
      margin-bottom: 5vw;
    }
  }
}
</style>
