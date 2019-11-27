<template>
<div class="test">
  <pre>{{$store.getters.user}}</pre>
  <mt-button size="small"
             type="default"
             @click="pay('wx')">微信支付</mt-button>
  <mt-button size="small"
             type="default"
             @click="pay('zfb')">支付宝支付</mt-button>
  <mt-button size="small"
             type="default"
             @click="call('getUser')">获取用户信息</mt-button>
  <mt-button size="small"
             type="default"
             @click="call('backToHome')">回主页</mt-button>
  <input type="text"
         placeholder="在这里自定义handler名"
         v-model="customCall">
  <mt-button size="small"
             type="default"
             @click="go(customCall)">自定义请求</mt-button>
  <mt-button size="small"
             type="default"
             @click="clear">clear</mt-button>
  <p v-for="(item, index) in arr"
     :key="index"
     v-html="item">
    {{item}}
  </p>
</div>

</template>

<script>
import { Toast } from 'mint-ui';
export default {

  name: 'test',

  data() {
    return {
      arr: [],
      uniqueId: 1,
      bridge: null,
      ua: window.navigator.userAgent,
      customCall: ''
    }
  },

  mounted() {
    this.log(this.ua)
  },

  computed: {
    payResult(){
      return this.$store.getters.payResult
    }
  },

  watch: {
    payResult(){
      this.log(JSON.stringify(this.payResult))
    }
  },

  methods: {
    log(message, data) {
      this.arr.push(this.uniqueId++ + '. ' + message + ':<br/>' + (data ? JSON.stringify(data) : ''))
    },
    go(handlerName = 'jsCallNative') {
      console.log('====handlerName====', handlerName)
      let self = this
      if (!this.$bridge) {
        this.arr.push('error: no bridge')
        return
      }
      this.$bridge.callHandler(handlerName, {
        title: (new Date()).toLocaleTimeString()
      }, function responseCallback(responseData) {
        self.log('JS received response:' + JSON.stringify(responseData))
      })
    },
    clear() {
      this.arr = []
      this.uniqueId = 1
    },
    pay(type) {
      try {
        let payType = type == 'wx' ? 'weixinpayMobilePlugin' : 'alipayMobilePlugin'
        this.$service.submitOrder(payType, 123, 0.01, 'longTermRentViolationDepositRecharge').then(res => {
          let result = res.data
          let data = result.data.parameters
          console.log('====data====', data)

          if (this.$bridge || 1) {
            if (type == 'wx') {
              console.log('====wx data====', data)
              this.$bridge.callHandler('jsCallPayWX', data, res => {
                this.log(res)
                console.log('====res====', res)
              })
            } else {
              console.log('====zfb data====', data)
              this.$bridge.callHandler('jsCallPayZFB', data, res => {
                this.log(res)
                console.log('====res====', res)
              })
            }
          } else {
            Toast('no bridge')
          }
        })
      } catch (e) {
        this.log(e)
      }
    },
    call(handlerName) {
      try {
        if (this.$bridge || 1) {
          this.$bridge.callHandler(handlerName, {}, res => {
            let user
            if(typeof res == 'string'){
              user = JSON.parse(res)
            }else{
              user = res
            }
            this.log(JSON.stringify(user))
          })
        } else {
          Toast('no bridge')
        }
      } catch (e) {
        this.log(e)
      }
    }
  }
}

</script>

<style lang="scss" scoped="">
.test {
  height: 100%;
  overflow: auto;
  button {
    margin: 1vw 0;
  }
  input {
    width: 100%;
    height: 10vw;
    border: 1px solid
  }
}
</style>
