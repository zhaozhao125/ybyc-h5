<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "app"
};
</script>

<style lang='scss'>
@import url("./assets/default.css");
#app {
  height: 100%;
  -webkit-overflow-scrolling: touch;
  overflow: auto;
}
</style>