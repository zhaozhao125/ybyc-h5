<template>
<div class="sesame-credit">
  <div class="discount-explain">
    <h2>减免说明</h2>
    <p>授权“一步用车”平台查询芝麻信用分，根据您芝麻分值享受对应的减免押金服务。</p>
  </div>
  <div class="discount-standard">
    <h2>减免标准</h2>
    <ul>
      <li v-for="(item, index) in sesameConfig" :key="index">
        <p>{{item}}</p>
      </li>
    </ul>
  </div>
  <mt-button type="default" @click="getSesameAuth">去授权</mt-button>
  <a href="#" class="help" @click.prevent="$router.push({name: 'sesameCreditHelp'})">什么是芝麻信用</a>
</div>

</template>

<script>
export default {

  name: 'sesame-credit',

  data() {
    return {
      sesameConfig: ['加载中，请稍后...']
    }
  },

  methods: {
    getSesameAuth(){
      this.$service.getSesameAuth(this.$store.getters.user.id).then(res => {
        this.$router.replace({
          name: 'sesameAuth',
          query: {
            url: res.data.data.authorizeUrl
          }
        })
      }).catch(e => {

      })
    }
  },

  created(){
    this.$service.getSesameConfig().then(res => {
      let result = res.data
        this.sesameConfig = result.data.map(item => {
          return `芝麻分值≥${item.score}，减免${item.freeAmount}元，仅需交纳${item.amount}元`
        })
    })
  }
}

</script>

<style lang="scss" scoped="">
.sesame-credit{
  padding: 6vw 2vw;
  >div{
    padding: 0 2vw;
    h2{
      margin-bottom: 3vw;
    }
  }
  .discount-explain{
    padding-bottom: 6vw;
    border-bottom: 1px solid #E7E7E7;
  }
  .discount-standard{
    padding-top: 6vw;
    padding-bottom: 6vw;
    ul{
      list-style: disc;
      color: #a1a1a1;
      padding-left: 5vw;
      p{
        position: relative;
      }
    }
  }
  .help{
    float: right;
    padding-top: 4vw;
    padding-bottom: 4vw;
    color: $color-blue;
  }
}
</style>
