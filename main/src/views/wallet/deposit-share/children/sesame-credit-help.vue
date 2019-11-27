<template>
<div class="sesameCreditHelp full">
  <iframe src="https://xy.alipay.com/auth/whatszhima.htm?view=mobile"
          frameborder="0"></iframe>
</div>

</template>

<script>
export default {

  name: 'sesame-credit-help',

  data() {
    return {

    }
  }
};

</script>

<style lang="scss" scoped="">
.sesameCreditHelp {
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
