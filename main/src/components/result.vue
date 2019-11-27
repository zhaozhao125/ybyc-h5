<template>
  <div class="result-page text-center width-100 height-100 overflow-hidden">
    <img :src="imgSrc" alt="">
    <h2 class="color-dark">{{title}}</h2>
    <p>{{text}}</p>
    <div class="button-container">
      <mt-button type="default" plain v-if="defaultBtn" @click="$emit('clickDefaultBtn')">{{defaultBtn}}</mt-button>
      <mt-button type="default" v-if="primaryBtn" @click="$emit('clickPrimaryBtn')">{{primaryBtn}}</mt-button>
    </div>
  </div>

</template>

<script>
export default {

  name: 'result',

  props: {
    title: {
      type: String
    },
    text: {
      type: String
    },
    imgName: {
      type: String
    },
    defaultBtn: {
      type: String
    },
    primaryBtn: {
      type: String
    }
  },

  data() {
    return {

    }
  },

  computed: {
    imgSrc() {
      return this.imgName ? require('@/assets/img/' + this.imgName) : ''
    }
  }
}

</script>

<style lang="scss" scoped="">
.result-page {
  img {
    display: block;
    width: 41%;
    margin: 10vw auto 0;
  }
  h2 {
    margin-top: 11vw;
  }
  p {
    font-size: 3.7333vw;
    margin-top: 5vw;
  }
  .button-container {
    display: flex;
    margin-top: 8vw;
    button {
      flex: 1;
      margin: 0 2vw;
      &:nth-child(even) {
        margin-left: 0;
      }
    }
  }
}
</style>
