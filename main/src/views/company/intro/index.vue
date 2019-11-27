<template>
  <div class="company-intro">
    <h1>企业用车，员工出行新体验</h1>
    <img src="./img/intro-1.png" alt="" class="intro-1">
    <img src="./img/intro-2.png" alt="" class="intro-2">
    <p class="intro-tip ">专属网点/专属车辆等更多增值服务</p>
    <p class="intro-tip intro-tip-self">敬请期待</p>
    <button @click='jumpRegister'>创建我的企业账户</button>
  </div>
</template>

<script>
export default {
  created() {
    window.sa.track('companyDescriptionPageOpen')
  },
  methods: {
    jumpRegister() {
      this.$router.push({
        name: 'company-registger'
      })
    }

  }
}
</script>

<style lang="scss">
.company-intro {
  @mixin afterAndBefore() {
    content: '';
    width: vw(83);
    height: 1px;
    background: #cdcdcd;
  }
  @function vw($px) {
    @return px2vw($px);
  }
  width: 100%;
  height: 100%;
  padding: 0 vw(16);
  text-align: center;
  font-size: vw(26);
  color: #3d3d3d;

  .intro-1 {
    margin-top: 3vw;
    margin-bottom: 3vw;
    width: 65%;
  }
  .intro-2 {
    width: 100%;
  }
  .intro-tip {
    font-size: vw(16);
    color: #3d3d3d;
  }
  .intro-tip-self {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: vw(10);
    &::after {
      margin-left: vw(8);
      @include afterAndBefore();
    }
    &::before {
      margin-right: vw(8);
      @include afterAndBefore();
    }
  }
  h1 {
    margin-top: vw(30);
  }
  button {
    border: none;
    background: $color-company-green;
    box-shadow: 0 0 vw(4) 0 rgba(0, 0, 0, 0.5);
    border-radius: vw(2);
    width: 94%;
    height: vw(64);
    font-size: vw(17);
    color: #ffffff;
    &::after {
      margin-top: vw(3);
      display: block;
      content: '立送200元体验金';
      font-size: vw(12);
      color: rgba(255, 255, 255, 0.8);
    }
  }
}
</style>
