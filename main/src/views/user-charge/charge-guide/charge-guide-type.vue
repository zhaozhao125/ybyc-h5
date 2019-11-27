<template>
  <div id="charge-guide">
    <h1 v-show="$route.name==='type1'" style="margin-top:4vw;">慢充</h1>
    <img :src="imgType($route.name)" :class="{marginTop:$route.name!=='type1'}">
    <ul>
      <li>取出充电枪,打开车辆充电盖</li>
      <li>按下枪头按钮用力插入充电口,使枪与充电口紧密闭合</li>
      <li>扫描二维码或输入电桩编号,开启充电</li>
      <li>拔枪归位,停止充电</li>
    </ul>
    <h1 v-show="$route.name==='type1'">快充</h1>
    <img v-show="$route.name==='type1'" src="./img/firstCharge.gif" style="margin-bottom:6.133333333333334vw">
  </div>
</template>
<script>
export default {
  name: 'charge-guide',
  methods: {
    imgType(name) {
      // alert(name)
      switch (name) {
        case 'type1':
          return require('./img/img1.gif')
        case 'type2':
          return require('./img/img2.gif')
        case 'type3':
          return require('./img/img3.gif')
        case 'type4':
          return require('./img/img4.gif')
      }
    }
  }
}
</script>
<style lang="scss">
#charge-guide {
  width: 100%;
  height: 100%;
  background: #f9f9f9;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 3.2vw;
  h1 {
    align-self: flex-start;
    font-size: 4.8vw;
    margin-bottom: 2.6666666666666665vw;
    font-weight: bold;
  }
  img {
    width: 93.33333333333333vw;
    box-shadow: 0vw 0.5333333333333333vw 1.0666666666666667vwvw 0
      rgba(0, 0, 0, 0.2);
  }
  .marginTop {
    margin-top: 5.333333333333333vw;
  }
  ul {
    margin-top: 5.333333333333333vw;
    margin-bottom: 5.333333333333333vw;
    li {
      padding-top: 2.6666666666666665vw;

      white-space: nowrap;
      font-size: 3.7333333333333334vw;
      color: #262626;
      display: flex;
      align-items: center;
      &::before {
        display: inline-block;
        margin-right: 2.6666666666666665vw;
        content: '';

        vertical-align: middle;
        width: 2.1333333333333333vw;
        height: 2.1333333333333333vw;
        border-radius: 50%;
        background: #fdd000;
      }
    }
  }
}
</style>
