<template>
  <transition :name="transitionName">
    <keep-alive include="my-points">
      <router-view class="router user-points"></router-view>
    </keep-alive>
  </transition>
</template>
<script>
import userPointsService from '@/service/user-points/'
import routerTransition from '@/mixins/router-transition'
export default {
  name: 'invite-index',

  mixins: [routerTransition],

  beforeCreate() {
    Object.assign(this.$service, userPointsService)
  }
}
</script>
<style lang="scss">
.user-points {
  section {
    width: 95%;
    margin: 3vw auto;
    box-shadow: 0 0 px2vw(6) 0 rgba(0, 0, 0, 0.12);
    border-radius: px2vw(2);
    header {
      padding: 3.3vw 3vw;
      display: flex;
      border-bottom: 1px solid #efefef;
      justify-content: space-between;
      align-items: center;
      .header-title {
        display: flex;
        align-items: center;
        img {
          width: px2vw(22);
          margin-right: 2vw;
        }
        h3 {
          font-size: px2vw(16);
          color: $color-dark;
        }
      }
      .right-text {
        font-size: px2vw(14);
        color: #888;
      }
    }
    li {
      border-bottom: 1px solid #efefef;
      padding: 2.8vw 3vw;
    }
  }
}
</style>
