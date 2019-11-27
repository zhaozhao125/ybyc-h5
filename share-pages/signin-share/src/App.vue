<template>
  <div id="app">
    <div class="invite-wrapper wrapper" v-show="!success">
      <div class="top-container">
        <img src="./assets/share.png" alt="">
      </div>
      <div class="bottom-container">
        <form>
          <div class="tel-input">
            <input type="tel" v-model="userTel" placeholder="输入手机号接受邀请">
            <div class="flash" v-if="!userTel"></div>
          </div>
          <div class="button" @click="handleClickBtn">接受邀请</div>
        </form>
      </div>
      <div class="rule">
        <p>1. 新用户接受邀请后，该手机号即一步用车登录账号，注册即送55元优惠券，可在一步用车APP-我的卡券中查看</p>
        <p>2. 老用户可直接打开APP，参与签到活动，赢取每周好礼</p>
      </div>
    </div>
    <div class="old-user wrapper" v-show="isOldUser">
      <div class="top-container">
        <img src="./assets/share-old.png" alt="">
      </div>
      <div class="bottom-container">
        <p>你已经是注册用户</p>
        <p>立即打开一步用车，赢取每周签到好礼吧</p>
        <div class="button" @click="openDownload">立即体验一步用车</div>
      </div>
    </div>
    <div class="success-wrapper wrapper" v-show="isNewUser">
      <div class="top-container">
        <img src="./assets/share-new.png" alt="">
      </div>
      <div class="bottom-container">
        <p>55元优惠券已放入账户中</p>
        <p>立即打开一步用车，赢取每周签到好礼吧</p>
        <div class="button" @click="openDownload">立即体验一步用车</div>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast, Indicator, MessageBox } from 'mint-ui'
import config from './config.js'
import { getSign } from './util/encryptParam.js'
export default {
  name: 'app',

  data() {
    return {
      pageLoaded: false,
      userTel: '',
      telValid: false,
      user: null,
      query: {},
      isNewUser: false,
      isOldUser: false
    }
  },

  methods: {
    checkTel() {
      let reg = /^((1[1-9][0-9])+\d{8})$/
      return reg.test(this.userTel)
    },
    sendData(data) {
      Indicator.open('请稍候...')
      return new Promise((resolve, reject) => {
        let xmlhttp
        if (window.XMLHttpRequest) {
          xmlhttp = new XMLHttpRequest()
        } else {
          xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
        }
        xmlhttp.onreadystatechange = function() {
          if (xmlhttp.readyState == 4) {
            Indicator.close()
            if (xmlhttp.status == 200) {
              resolve(JSON.parse(xmlhttp.responseText))
            } else {
              reject(xmlhttp.status)
            }
          }
        }
        let params = ''
        if (data && typeof data == 'object') {
          let arr = []
          Object.keys(data).forEach(item => {
            arr.push(`${item}=${data[item]}`)
          })
          params = arr.join('&')
        }
        xmlhttp.open('POST', config.url, true)
        xmlhttp.setRequestHeader(
          'Content-type',
          'application/x-www-form-urlencoded'
        )
        xmlhttp.send(params)
      })
    },
    openDownload() {
      setTimeout(() => {
        window.open(
          'http://a.app.qq.com/o/simple.jsp?pkgname=com.usercar.yongche'
        )
      }, 200)
    },
    handleClickBtn() {
      if (this.telValid) {
        let params = {
          newPhone: this.userTel,
          uid: '',
          oldUserId: this.query.uid || '',
          phone: this.query.phone || '',
          version: this.query.version || config.version
        }
        params.sign = getSign(params)
        this.sendData(params)
          .then(res => {
            console.log(res)
            if (res.errCode == 0) {
              // Toast({
              //   message: '领取成功',
              //   position: 'bottom'
              // })
              this.user = {
                tel: this.userTel
              }
              this.isNewUser = true
            } else {
              if (res.errMsg == '用户已经注册') {
                this.isOldUser = true
              } else {
                Toast({
                  message: res.errMsg || '请求出错，请稍后再试'
                })
              }
            }
          })
          .catch(e => {
            console.dir(e)
            Toast({
              message: '网络请求出错，请稍后再试'
            })
          })
      } else {
        Toast('请输入正确的手机号')
      }
    }
  },

  watch: {
    userTel(newVal) {
      this.telValid = this.checkTel()
    }
  },

  mounted() {
    // URL中的utm数据
    location.search
      .replace('?', '')
      .split('&')
      .forEach(item => {
        let queryItem = item.split('=')
        this.query[queryItem[0]] = queryItem[1]
      })
    setTimeout(() => {
      this.pageLoaded = true
    }, 3000)
  }
}
</script>
<style lang="scss">
@import './assets/scss/global.scss';
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  background-color: #f6f6f6;
}

body > a {
  display: none;
}

img {
  display: block;
  width: 100%;
  height: auto;
  margin: auto;
}

#app {
  width: 100%;
  overflow: auto;
}

.wrapper {
  .top-container {
    overflow: hidden;
    text-align: center;
    color: $color-title;
  }
  .bottom-container {
    text-align: center;
    margin-top: 8vw;
    color: $color-title;
  }
  .button {
    width: 100%;
    height: 12vw;
    background-image: linear-gradient(-179deg, #f7db57 0%, #fdd500 100%);
    box-shadow: 0 2px 4px 0 rgba(189, 182, 182, 0.5);
    border-radius: 26.666vw;
    color: #3d3d3d;
    text-align: center;
    line-height: 12vw;
    margin-top: 3vw;
    font-size: 4.26667vw;
  }
}

.invite-wrapper {
  form {
    width: 94%;
    margin: auto;
    .tel-input {
      position: relative;
      input {
        margin: 0;
        padding: 0 4vw;
        border: none;
        display: block;
        width: 100%;
        height: 12vw;
        border: 1px solid rgba(61, 61, 61, 0.4);
        border-radius: 26.66vw;
        color: #3d3d3d;
        background-color: transparent;
        text-align: center;
        font-size: 4.6vw;
        outline: none;
        -webkit-appearance: none;
        &.valid {
          border: 2px solid $color-dark;
        }
        &::-webkit-input-placeholder {
          color: #3d3d3d;
        }
        &:focus {
          &::-webkit-input-placeholder {
            opacity: 0;
          }
          & + .flash {
            display: none;
          }
        }
      }
      .flash {
        width: 2px;
        position: absolute;
        width: 2px;
        height: 12vw;
        top: 0;
        left: 25vw;
        background-color: $color-yellow;
        padding: 2vw 0;
        background-clip: content-box;
        animation-name: flash;
        animation-duration: 1000ms;
        animation-delay: 0ms;
        animation-timing-function: cubic-bezier(0.65, 0.05, 0.36, 1);
        animation-iteration-count: infinite;
      }
    }
  }
}

.old-user {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  min-height: 100%;
  .bottom-container {
    p {
      font-size: 4.8vw;
      margin: 2vw 0;
    }
  }
  .button {
    margin-top: 12vw;
  }
}

.success-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  min-height: 100%;
  .bottom-container {
    margin-top: 12vw;
    p {
      font-size: 4.8vw;
      margin: 2vw 0;
    }
    .button {
      width: 90%;
      margin: 10vw auto;
    }
  }
}

.rule {
  width: 93%;
  margin: 10vw auto 5vw;
  color: #686868;
  p {
    font-size: 3.2vw;
    margin: 0;
  }
}

@keyframes flash {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.mint-msgbox {
  border-radius: 12px;
  background-color: rgba(252, 252, 252, 0.95);
  width: 76%;
  .mint-msgbox-header {
    padding-top: 20px;
  }
  .mint-msgbox-content {
    padding: 5px 32px 15px;
    .mint-msgbox-input {
      margin-bottom: -15px;
    }
  }
  .mint-msgbox-message {
    font-size: 14px;
    color: #8b8b8b;
    line-height: 20px; // text-align: left;
  }
  .mint-msgbox-btns {
    height: 45px;
  }
  .mint-msgbox-btn {
    font-size: 16px;
    background-color: transparent;
  }
  .mint-msgbox-cancel {
    color: $color-dark;
  }
  .mint-msgbox-confirm {
    color: $color-popup-blue;
    &:active {
      color: darken($color-popup-blue, 3%);
    }
  }
}
</style>
