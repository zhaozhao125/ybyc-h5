<template>
  <div class="guide-page">
    <img :src=imageUrl(carModel) alt="">
  </div>
</template>

<script>
export default {
  name: "guide-page",
  data() {
    return {};
  },
  computed: {
    carModel() {
      return this.$route.query.carModel;
    }
  },
  methods: {
    imageUrl(imgName) {
      return imgName? require("@/views/service-center/guide/img/" + imgName + ".gif"): "";
    }
  }
};
</script>

<style lang="scss">
.guide-page {
  width: 100%;
  background-color: #f0f0f0;
  img {
    width: 100%;
  }
}
</style>
