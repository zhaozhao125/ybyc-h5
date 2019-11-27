<template>
  <div class="new-user-help full">
    <iframe src="https://h5.1byongche.com/app/newbie/" frameborder="0"></iframe>
  </div>

</template>

<script>
export default {

  name: 'new-user-help',
  data() {
    return {
    }
  }
};
</script>
<style lang="scss" scoped="">
.new-user-help {
  -webkit-overflow-scrolling: touch;
  overflow: auto;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  iframe {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
}
</style>
