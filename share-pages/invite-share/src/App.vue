<template>
  <div id="app">
    <div class="invite-wrapper wrapper" v-show="!success">
      <div class="top-container">
        <h2>您的好友邀请您使用一步用车<br>并奉上了
          <strong>66元大礼包</strong>
        </h2>
      </div>
      <div class="main-pic">
        <img src="./assets/img/pic.png" alt="">
        <p>首次用车低至0元</p>
      </div>
      <div class="form-container">
        <form>
          <div class="tel-input">
            <input type="tel" v-model="userTel" placeholder="输入手机号接受邀请">
          </div>
          <div class="button" @click="handleClickBtn">领取新手大礼包</div>
        </form>
      </div>
      <div class="rule">
        <h4>奖励规则</h4>
        <p>接受邀请后，该手机号即为您的一步用车登录账号，</p>
        <p>优惠券可在一步用车APP-我的卡券中查看，</p>
        <p>在用车订单结算时可选择使用。</p>
        <!-- <p>客服电话 400-111-1818</p> -->
      </div>
    </div>
    <div class="success-wrapper wrapper" v-show="success">
      <div class="top-copy" v-if="isNewUser">
        <h3>注册成功</h3>
        <h3>66元新手大礼包已存入您的账户中</h3>
      </div>
      <div class="top-copy" v-else>
        <h3>你已经是一步用车的用户了</h3>
      </div>
      <div class="qrcode">
        <img src="./assets/img/qrcode.png" alt="">
        <p>想要更多福利，请长按关注公众号</p>
      </div>
      <div class="bottom-container">
        <div class="button" @click="openDownload">下载APP立即用车</div>
        <div class="button-plain" @click="handleClickShare">
          <strong>邀请好友</strong>
          得免费用车特权
        </div>
      </div>
    </div>
    <div class="share-overlay" v-show="showShare" @click="showShare=false">
      <img src="./assets/img/share.png" alt="">
      <p>送好友
        <strong>66元大礼包</strong>
      </p>
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
      success: false,
      isNewUser: true, // 是否为新用户
      showShare: false,
      currentUserId: '',
      from: '' // 分享来源
    }
  },

  methods: {
    checkTel() {
      let reg = /^((1[3-9][0-9])+\d{8})$/
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
      window.sa.track('h5InvitationSharePageClickDownload', {
        from: this.from
      })
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
          oldUserId: this.query.uid || '',
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
              this.currentUserId = res.data.userId
              this.success = true
            } else {
              if (res.errMsg == '用户已经注册') {
                this.currentUserId = res.data.userId
                this.isNewUser = false
                this.success = true
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

        // 神策统计
        window.sa.track('invitationRegisterRequest', {
          userPhone: params.newPhone,
          from: this.from
        })
      } else {
        Toast('请输入正确的手机号')
      }
    },
    handleClickShare() {
      this.showShare = true
      window.sa.track('h5InvitationSharePageClickInvite', {
        from: this.from
      })
    }
  },

  watch: {
    userTel(newVal) {
      this.telValid = this.checkTel()
    },
    currentUserId(newVal) {
      if (newVal) {
        let queryStr = `?uid=${newVal}&phone=${this.userTel}&version=${
          this.query.version
        }`
        window.wxShareData.link = location.href.split('?')[0] + queryStr
        if (wx) {
          // 分享到朋友圈
          wx.onMenuShareTimeline({
            title: '送您66元优惠券，用车低至0元',
            desc: wxShareData.desc,
            link: wxShareData.link,
            imgUrl: wxShareData.imgUrl,
            trigger: function(res) {
              // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
            },
            success: function() {
              // 用户确认分享后执行的回调函数
            },
            cancel: function() {
              // 用户取消分享后执行的回调函数
            }
          })
          // 分享给朋友
          wx.onMenuShareAppMessage({
            title: wxShareData.title,
            desc: wxShareData.desc,
            link: wxShareData.link,
            imgUrl: wxShareData.imgUrl,
            success: function() {
              // 用户确认分享后执行的回调函数
            },
            cancel: function() {
              // 用户取消分享后执行的回调函数
            }
          })
        }
        window.sa.login(newVal)
      }
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
    if (this.query.source) {
      switch (this.query.source) {
        case 'wechatMessage':
          this.from = '微信好友'
          break
        case 'wechatTimeline':
          this.from = '朋友圈'
          break
        case 'qrcode':
          this.from = '分享二维码'
        default:
          break
      }
    }
    if (!this.query.uid) {
      Toast('错误：URL中没有用户ID')
    } else {
      // window.sa.login(this.query.uid)
      window.sa.track('invitationInviterPageOpen', {
        from: this.from
      })
    }
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
  color: $color-dark;
}

img {
  pointer-events: none;
}

.wrapper {
  overflow: hidden;
  .button {
    width: 100%;
    height: 13.3vw;
    background-color: #3d3d3d;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    color: #fff;
    text-align: center;
    line-height: 13.3vw;
    margin-top: 3vw;
    font-size: 4.26667vw;
  }
  .button-plain {
    background: #ffffff;
    border: 1px solid #3d3d3d;
    font-size: px2vw(17);
    height: 13.3vw;
    line-height: 13.3vw;
  }
}

.invite-wrapper {
  .top-container {
    h2 {
      font-size: px2vw(22);
      text-align: center;
      margin: 0;
      margin-top: 5vw;
    }
  }
  .main-pic {
    width: 56%;
    margin: 6vw auto 0;
    text-align: center;
    p {
      font-size: px2vw(18);
      margin: 1vw 0;
    }
  }
  .form-container {
    text-align: center;
    margin-top: 7vw;
    color: $color-title;
  }
  form {
    padding: 0 6.6vw 1vw;
    .tel-input {
      position: relative;
      input {
        margin: 0;
        padding: 0 4vw;
        border: none;
        display: block;
        width: 100%;
        height: 13.3vw;
        color: #3d3d3d;
        background-color: #fff;
        border: 1px solid #b3b3b3;
        text-align: center;
        font-size: 4.6vw;
        outline: none;
        border-radius: 0.53333vw;
        -webkit-appearance: none;
        &.valid {
          border: 2px solid $color-dark;
        }
        &::-webkit-input-placeholder {
          color: #c6c6c6;
        }
        &:focus {
          &::-webkit-input-placeholder {
            opacity: 0;
          }
        }
      }
    }
  }

  .rule {
    width: 86%;
    margin: 6vw auto;
    h4 {
      margin: 0;
      margin-bottom: 1vw;
      font-size: px2vw(17);
    }
    p {
      margin: 0;
      font-size: px2vw(14);
    }
  }
}

.success-wrapper {
  text-align: center;
  h3 {
    margin: 0;
    font-weight: normal;
  }
  p {
    margin: 0;
  }
  .top-copy {
    margin-top: 11vw;
  }
  .qrcode {
    margin-top: 14vw;
    box-shadow: 0 2px 4px 0 rgba(216, 216, 216, 0.5);
    padding-bottom: 16vw;
    p {
      font-size: px2vw(14);
      margin-top: 4vw;
    }
    img {
      pointer-events: auto;
    }
  }
  .bottom-container {
    margin-top: 12vw;
    width: 87%;
    margin: 12vw auto 3vw;
    .button-plain {
      margin-top: 4vw;
    }
  }
}
.share-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  img {
    position: absolute;
    width: 63%;
    right: 0;
    top: 0;
  }
  p {
    position: absolute;
    top: 102vw;
    text-align: center;
    width: 100%;
    color: #fff;
  }
}
</style>
