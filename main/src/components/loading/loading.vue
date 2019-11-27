<template>
  <div class="content" v-show="visible" ref="content">
    <div class="loading">
      <img width="28" height="28" src="./../../assets/img/loading.png">
      <span class="desc">{{title}}</span>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    title: String
  },
  mounted() {},
  data() {
    return {
      visible: false
    }
  }
}
</script>
<style lang="scss" scoped>
  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .content {
    // 遮罩层
    z-index: 1000;
    width: 100%;
    height: 100%;
    position: absolute;
    background-color:transparent;
    // opacity: 0.5;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center; //  background: #787878;
    .loading {
      display: flex;
      word-break: keep-all;
      justify-content: center;
      align-items: center;
      height: 10.13vw;
      padding: 0vw 5.33vw 0vw 5.33vw;
      background: #000000;
      color: #ffffff;
      opacity: 0.35;
      border-radius: 0.8vw;
      img {
        animation: rotation 0.5s linear infinite; // infinite播放无限次
      }
      span {
        margin-left: 3vw;
      }
    }
  }
</style>
