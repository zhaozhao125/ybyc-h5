<template>
  <div class="violation-record flex-col">
    <div class="navbar width-100 flex-row justify-content-around align-items-center fz-12 bg-white">
      <div class="nav-item flex-1 text-center height-100 pl-3 pr-3" :class="{active: currentRoute == 'violationToBeProcessed'}" @click="goTo('violationToBeProcessed')"><span>待处理</span></div>
      <div class="nav-item flex-1 text-center height-100 pl-3 pr-3" :class="{active: currentRoute == 'violationProcessed'}" @click="goTo('violationProcessed')"><span>已处理</span></div>
    </div>
    <keep-alive>
      <router-view class="violation-record-container flex-1 overflow-auto"></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },

  methods: {
    goTo(name) {
      this.$router.replace({
        name,
        params: {
          isReplace: true
        }
      })
    }
  },

  computed: {
    currentRoute() {
      return this.$route.name
    }
  }
}
</script>

<style lang="scss">
.android .violation-record .navbar{
  background-color: #3d3d3d;
}
.violation-record {
  .navbar {
    height: px2vw(44);
    background-color: #2e2e2e;
  }
  .nav-item {
    line-height: px2vw(36);
    span{
      font-size: px2vw(16);
      padding-bottom: 1vw;
      color: #999;
    }
    &.active span {
      color: #fff;
      border-bottom: 2px solid $color-yellow;
    }
  }
  .violation-record-container{
    -webkit-overflow-scrolling: touch;
  }
}
</style>
