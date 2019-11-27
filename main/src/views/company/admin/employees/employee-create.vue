<template>
  <div class="empolyee-create bg-light">
    <div class="form-container">
      <div class="input-container flex-row align-items-center overflow-hidden">
        <div class="clearable-input flex-1 position-relative" :class="{'show-clear': userTel}">
          <input class="clearable width-100 bg-transparent fz-18 rounded-0" v-model="userTel" maxlength="11" type="tel" placeholder="请输入手机号">
          <i class="clear-btn" @click="userTel=''"></i>
        </div>
        <mt-button type="default" plain :disabled="!telValid" @click="handleSearchTel">查询账号</mt-button>
      </div>
      <p class="tip fz-12">
        提示：仅可添加一步用车注册账号，未注册的手机号，不可添加到企业。
      </p>
    </div>
    <div class="result-container bg-white text-center flex-col" v-if="status">
      <div class="tel">{{userTel | telFilter}}</div>
      <p class="color-dark fz-14" v-if="status === 'ok'">
        该手机号码已注册一步用车，请核实号码准确性，<br> 确定后该号码将进入本企业， <br> 可享员工权益
      </p>
      <p class="color-dark fz-14" v-else-if="status === 'isStaff'">
        该手机号码已加入其它企业，<br> 暂不可加入本企业
      </p>
      <p class="color-dark fz-14" v-else-if="status === 'notExists'">
        该手机号码尚未注册一步用车，<br> 请确认注册后，再进行添加
      </p>
      <mt-button type="default" :disabled="status !== 'ok'" @click="handleConfirmCreate">确认添加</mt-button>
    </div>
  </div>
</template>

<script>
import { checkTel } from '@/util/common'
export default {
  data() {
    return {
      status: '',
      userTel: '',
      userId: ''
    }
  },

  computed: {
    telValid() {
      return checkTel(this.userTel)
    },
    companySn() {
      return this.$store.getters.companySn
    }
  },

  watch: {
    userTel() {
      this.status = ''
    }
  },

  methods: {
    handleSearchTel() {
      // this.userTel = '13322332233'
      // this.creatable = true
      this.status = ''
      this.userId = ''
      this.$service.getEmployeeStatus(this.userTel).then(res => {
        console.log('====res====', res)
        let result = res.data.data
        this.status = result.status
        this.userId = result.userId
      })
    },
    handleConfirmCreate() {
      this.$service
        .addEmployee({
          companySn: this.companySn,
          userId: this.userId
        })
        .then(res => {
          console.log('====res====', res)
          this.$message.alert('添加成功', this.userTel).then(action => {
            this.userTel = ''
            this.status = ''
            this.$router.go(-1)
          })
        })
    }
  },

  filters: {
    telFilter(val) {
      if (String(val).length == 11) {
        let str = String(val)
        return [str.substr(0, 3), str.substr(3, 4), str.substr(7, 4)].join(' ')
      }
      return val
    }
  }
}
</script>

<style lang="scss">
.empolyee-create {
  .form-container {
    width: 80%;
    margin: 8.5vw auto;
    .input-container {
      .clearable-input {
        .clear-btn {
          background-image: url('~@/assets/img/x.png');
          display: block;
          width: 3vw;
          height: 3vw;
          position: absolute;
          background-size: contain;
          top: 0;
          bottom: 0;
          right: 0;
          margin: auto;
          visibility: hidden;
        }
        &.show-clear {
          .clear-btn {
            visibility: visible;
          }
        }
      }
      input {
        width: 100%;
        border-bottom: 1px solid #606060;
        height: px2vw(49);
      }
      button {
        margin-left: 3vw;
        height: px2vw(49);
        width: px2vw(100);
      }
    }
    .tip {
      color: #a7a7a7;
      margin-top: 5vw;
    }
  }
  .result-container {
    width: 92%;
    margin: 15vw auto;
    min-height: 50vw;
    padding: 8vw 5vw;
    .tel {
      font-size: px2vw(30);
      margin-bottom: 3vw;
    }
    p {
      margin-bottom: 7vw;
      line-height: 1.8;
    }
  }
}
</style>
