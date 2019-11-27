<template>
  <div class="common-rules">
    <template v-if="rules.length && rules[0].title">
      <div class="rule-item" v-for="(ruleItem, ruleIndex) in rules" :key="ruleIndex">
        <h3>{{ruleItem.title}}</h3>
        <ul :style="`list-style:${listStyle}`">
          <li v-for="(item, index) in ruleItem.rules" :key="index">{{item}}</li>
        </ul>
      </div>
      <!-- <div class="logo">
        <img src="@/assets/img/logo.jpg" alt="">
      </div> -->
    </template>
    <template v-else>
      <h3>{{title}}</h3>
      <ul v-if="rules" :style="`list-style:${listStyle}`">
        <li v-for="(item, index) in rules" :key="index">{{item}}</li>
      </ul>
      <div class="logo">
        <img src="@/assets/img/logo.jpg" alt="">
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: 'common-rules',

  props: {
    title: {
      type: String
    },
    rules: Array,
    listStyle: {
      type: String,
      default: 'disc'
    }
  },

  data() {
    return {}
  }
}
</script>
<style lang="scss">
.common-rules {
  padding: 15px;
  .rule-item {
    margin-bottom: 10px;
    overflow: hidden;
  }
  h3 {
    font-size: 16px;
    margin-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e7e7e7;
  }
  ul {
    font-size: 12px;
    color: #a1a1a1;
    list-style: disc;
    padding-left: 15px;
    margin-top: 15px;
    li {
      margin-bottom: 8px;
      line-height: 1.5;
    }
  }
  .logo {
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0;
    right: 0;
    margin: auto;
    padding: 10px 0;
    text-align: center;
    background-color: #fff;
    img {
      width: 27%;
      max-width: 150px;
      height: auto;
    }
  }
}
</style>
