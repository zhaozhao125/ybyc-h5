<template>
  <div id="company-home">
    <div class="company-register" v-if="!isCompanyApply">
      <h1>企业名称</h1>
      <div class="register-input-content">
        <input type="text" placeholder="请输入完整的企业名称" v-model.trim="inputRegister" maxlength="40" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;">
        <img src="./img/clear-icon.png" v-show="isShowClearIcon" @click="clearInput">
      </div>
      <button :class="[{'charge-bg':inputRegister}]" @click="applyFor">立即申请</button>
      <span class="register-tip"> 提示：申请后，工作人员将于1-3个工作日内与你联系</span>
    </div>
    <div class="register-success" v-else-if='isCompanyApply&&!loading'>
      <img src="./img/success.png">
      <h3>提交成功</h3>
      <span class="success-tip">申请的【{{companyName}}】已提交</span>
      <span class="success-tip">工作人员将于1-3个工作日内与你联系</span>
      <span class="success-tip">企业创建成功后，即送200元体验金</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCompanyApply: true, // 是否申请过
      isShowClearIcon: false,
      inputRegister: '',
      companyName: '',
      loading: true
    }
  },
  watch: {
    inputRegister(newValue) {
      this.isShowClearIcon = Boolean(newValue)
    }
  },
  mounted() {
    this.$service.applyProgress().then(res => {
      console.log(res, 'applY')
      // 是否申请过
      this.isCompanyApply = res.data.data.companyApply
      this.companyName = res.data.data.companyName
      this.loading = false
    })
  },
  methods: {
    clearInput() {
      this.inputRegister = ''
    },
    applyFor() {
      let uid = this.$store.getters.user.id
      if (this.inputRegister) {
        this.$service.apply(uid, this.inputRegister).then(res => {
          this.isCompanyApply = true
          this.companyName = this.inputRegister
        })
      }
    }
  }
}
</script>

<style lang="scss">
#company-home {
  width: 100%;
  padding: 0 8vw;
  height: 100%;
  background: #ffffff;
  > div {
    display: flex;
    flex-direction: column;
    background: #ffffff;
  }
  // 创建企业账户
  .company-register {
    h1 {
      margin: 10.133333333333333vw 0 12.533333333333333vw 0;
      font-size: 8vw;
      font-weight: bold;
      color: #3d3d3d;
    }
    .register-input-content {
      flex-basis: 10.933333333333334vw;
      // background: #e5e7df;
      padding: 1.8666666666666667vw 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #606060;
      input {
        font-size: 4.8vw;
        width: 90%;
        outline: none;
        -webkit-appearance: none; /*清除ios默认圆角*/
        border-radius: 0;
        &::-webkit-input-placeholder {
          font-size: 4.8vw;
          color: #a7a7a7;
          text-indent: 0.5vw;
        }
      }
      img {
        height: 3.2vw;
        margin-right: 0.5vw;
      }
    }
    button {
      background: #e5e5e5;
      border-radius: 0.5333333333333333vw;
      margin: 12.8vw 0 5.866666666666666vw 0;
      border: none;
      height: 13.066666666666666vw;
      font-size: 4.266666666666667vw;
      border: 1px solid #d9d9d9;
      color: #a7a7a7;
      letter-spacing: 0.3vw;
    }
    .charge-bg {
      background: $color-company-green;
      color: #ffffff;
      border: none;
    }
    .register-tip {
      font-size: 3.2vw;
      color: #a7a7a7;
    }
  }
  //创建成功
  .register-success {
    align-items: center;
    img {
      width: 29.066666666666666vw;
      margin: 13.333333333333334vw 0 6.666666666666667vw 0;
    }
    h3 {
      font-size: 5.333333333333333vw;

      color: #3d3d3d;
      font-weight: bold;
      margin-bottom: 4vw;
    }
    .success-tip {
      font-size: 3.7333333333333334vw;
      color: #a7a7a7;
    }
  }
}
</style>
