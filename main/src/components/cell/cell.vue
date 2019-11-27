<template>
  <div class="service-item bg-white width-100 flex-row  align-items-center overflow-hidden" @click='jumpPage'>
    <div class="flex-row  align-items-center width-100" :class="{'add-bottom-border':addBorderBottom}">
      <span :class="{'bold':fontBlod}" :style="{fontSize: fontSize + 'vw'}">{{title}}</span>
      <i class="arrow"></i>
    </div>
  </div>
</template>
<script>
export default {
  name: 'cell-item',
  props: {
    title: {
      typs: String,
      required: true
    },
    addBorderBottom: Boolean,
    fontBlod: Boolean,
    fontSize: {
      default: '3.47',
      type: String
    }
  },
  methods: {
    jumpPage() {
      this.$emit('jumpPage')
    }
  },
  data() {
    return {
    }
  }
}
</script>
<style  lang='scss'>
.service-item {
  transform: translate3d(0, 0, 0); //css3动画渲染加速
  &:active {
    background-color: $color-button-white;
    transform: translateY(-1px);
  }
  > div {
    justify-content: space-between;
    margin: 0 5.3%;
    height: 13.333333333333334vw;
    // background: #ffffff;
    z-index: 20;
    .title {
      white-space: nowrap;
      color: #3d3d3d;
    }
    .bold {
      font-weight: bold;
    }
    .arrow {
      margin-right: 2vw;
      &::after {
        display: block;
        transform: rotate(45deg);
        border: 0.5vw solid #c8c8cd;
        opacity: 0.6;
        border-bottom-width: 0;
        border-left-width: 0;
        content: ' ';
        width: 2.4vw;
        height: 2.4vw;
      }
    }
  }
  .add-bottom-border {
    border-bottom: 1px solid $color-button-white;
  }
}
</style>
