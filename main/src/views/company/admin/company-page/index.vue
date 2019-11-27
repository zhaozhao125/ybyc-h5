<template>
  <div class="company-page">
    <span class="disable-tip" v-if='!companyInfo.companyOpen'> 当前企业已被禁用，企业用车相关权益暂不可用 </span>
    <div class="company-name-content">
      <span id="company-name">{{companyInfo.companyName}}</span>
      <drop-down @command='command' :offset='25' :listName="['企业主页', '个人主页']" :isOffset='true' v-if="companyInfo.role=='manager'||isShowArrow">
        <template slot="dropDownName">
          <img src="./img/arrow.png" id="arrow" alt="三角">
        </template>
      </drop-down>
    </div>
    <!-- 企业主页 -->
    <div class="company-page-content" v-if="companyInfo.role=='manager'">
      <!-- 上 -->
      <div class="content-up">
        <div class="content-up-item">
          <div>
            <span>{{companyMoneyTotal}}</span>
            <div class="content-up-item-tip">
              <img src="./img/money.png" alt="可用余额">
              <span>可用余额（元）</span>
            </div>
          </div>
          <div>
            <span>{{staffs}}</span>
            <div class="content-up-item-tip">
              <img src="./img/person.png" alt="员工人数">
              <span>员工人数（人）</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 中 -->
      <div class="content-center">
        <h3>企业管理</h3>
        <div>
          <div @click="jumpEmployeePage">
            <img src="./img/person-icon.png" alt="员工">
            <span>员工</span>
          </div>
          <div @click="jumpOrderPage">
            <img src="./img/order.png" alt="订单">
            <span>订单</span>
          </div>
          <div @click="jumpBalance">
            <img src="./img/money-icon.png" alt="余额">
            <span>余额</span>
          </div>
        </div>
      </div>
      <!-- 下 -->
      <div class="content-down">
        <div @click='jumpCompanyHelp'>
          <img src="./img/help.png" alt="">
          <span>使用帮助</span>
        </div>
        <div @click="jumpCompanyInfo">
          <img src="./img/company.png" alt="">
          <span>企业信息</span>
        </div>
      </div>
    </div>
    <!-- 员工主页 -->
    <div class="staff-content" v-else-if="companyInfo.role=='general'">
      <div v-if='companyInfo.companyOpen'>
        <p>已加入本企业，支付时可选企业余额支付</p>
        <p>去开启企业用车之旅吧~</p>
      </div>
      <div v-else>
        <p>当前企业已被禁用</p>
        <p>企业用车相关权益暂不可用</p>
      </div>
    </div>
  </div>
</template>

<script>
import dropDown from '@/components/drop-down'
export default {
  components: {
    dropDown
  },
  data() {
    return {
      companyInfo: this.$route.params.companyInfo,
      companyMoneyTotal: '-',
      staffs: '-',
      isShowArrow: false
    }
  },
  mounted() {
    console.log(this.$route.params.companyInfo, '企业信息')
    this.$store.commit('setCompanySn', this.companyInfo.companySn)
    // 是
    if (this.companyInfo.role === 'manager') {
      this.$service.dashboard(this.companyInfo.companySn).then(res => {
        this.dashboard = res.data.data
        this.companyMoneyTotal = res.data.data.companyMoneyDTO.companyMoneyTotal.toFixed(
          2
        )
        this.$store.commit('setCompanyMoney', res.data.data.companyMoneyDTO)
        this.staffs = res.data.data.staffs
        console.log(res.data.data, '企业信息概览')
        console.log(this.$store.getters.companyMoney)
      })
    }
  },
  methods: {
    command(index) {
      if (this.companyInfo.role === 'manager') {
        this.isShowArrow = true
      }
      this.companyInfo.role = index === 0 ? 'manager' : 'general'
    },
    jumpCompanyHelp() {
      this.forbidden(() => {
        this.$router.push({
          name: 'company-help'
        })
      })
    },
    jumpBalance() {
      this.forbidden(() => {
        this.$router.push({
          name: 'company-balance'
        })
      })
    },
    jumpOrderPage() {
      this.forbidden(() => {
        this.$router.push({
          name: 'company-order'
        })
      })
    },
    jumpEmployeePage() {
      this.forbidden(() => {
        this.$router.push({
          name: 'company-employees'
        })
      })
    },
    jumpCompanyInfo() {
      this.forbidden(() => {
        this.$service.companyInfo(this.companyInfo.companySn).then(res => {
          this.$router.push({
            name: 'company-info',
            params: {
              companyInfo: res.data.data
            }
          })
        })
      })
    },
    // 禁用
    forbidden(callBack) {
      if (this.companyInfo.companyOpen) {
        callBack()
      } else {
        this.$message.alert(
          '企业已被禁用，如需启用请联联系你的专属客服人员',
          '提示'
        )
      }
    }
  }
}
</script>

<style lang="scss">
.company-page {
  width: 100%;
  height: 100%;
  background: #f9f9f9;
  position: relative;
  @mixin getAfter($height) {
    &:first-child {
      position: relative;
      &::after {
        content: '';
        display: block;
        position: absolute;
        right: 0;
        height: px2vw($height);
        width: 1px;
        background: #efefef;
        border-radius: px2vw(2);
        top: 0;
        bottom: 0;
        margin: auto;
      }
    }
  }
  @mixin shadowPublic() {
    background: #ffffff;
    box-shadow: 0 0 1.6vw 0 #efefef;
    border-radius: 0 0 px2vw(2) px2vw(2);
  }
  img {
    width: px2vw(24);
  }
  #arrow {
    padding-top: px2vw(3);
    margin: 0 2vw 0 px2vw(4);
    position: relative;
    top: 2vw;
  }
  .disable-tip {
    display: block;
    text-align: center;
    width: 100%;
    height: 9.6vw;
    line-height: 9.6vw;
    background: #fefdee;
    font-size: 3.2vw;
    color: #f5a623;
    letter-spacing: 0;
    margin-bottom: 2.6666666666666665vw;
    border-bottom: 1px solid #fef1b6;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .company-name-content {
    background: red;
    margin: px2vw(10) px2vw(10) 0 px2vw(10);
    height: 14.133333333333333vw;
    line-height: 14.133333333333333vw;
    padding-left: px2vw(15);
    white-space: nowrap;
    overflow: hidden;
    border-bottom: 1px solid #efefef;
    display: flex;
    align-items: center;
    background: #ffffff;
    box-shadow: 0 0 px2vw(6) 0 #efefef;
    border-radius: px2vw(2) px2vw(2) 0 0;
    > span {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 4.266666666666667vw;
      color: #3d3d3d;
      font-weight: bold;
      max-width: px2vw(312); // background: red;
    }
  }
  .company-page-content {
    width: 100%;
    height: auto;
    padding: 0 2.6666666666666665vw;
    > div {
      width: 100%;
      @include shadowPublic();
    } // 上部
    .content-up {
      border-top: none;
      .content-up-item {
        // background: red;
        width: 100%;
        height: px2vw(123.5);
        display: flex; // position: relative;
        > div {
          flex: 1;
          display: flex; // background: red;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          @include getAfter(94);
          > span {
            font-size: px2vw(25);
            color: #3d3d3d;
            font-weight: bold;
            margin-bottom: px2vw(7);
          }
          .content-up-item-tip {
            display: flex;
            align-items: center;
            span {
              display: inline-block;
              font-size: px2vw(12);
              color: #3d3d3d;
            }
          }
        }
      }
    } //中部
    .content-center {
      display: flex;
      flex-direction: column;
      height: 36.53333333333333vw;
      margin: 2.6666666666666665vw 0 3.2vw 0;
      > h3 {
        align-self: flex-start;
        font-size: px2vw(16);
        font-weight: bold;
        color: #3d3d3d;
        margin: px2vw(15) 0 0 px2vw(15);
      }
      > div {
        align-self: center;
        display: flex;
        width: 100%;
        flex: 1;
        > div {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          span {
            margin-top: px2vw(4);
            font-size: px2vw(12);
            color: #3d3d3d;
          }
        }
      }
    } // 下部
    .content-down {
      height: 13.333333333333334vw;
      display: flex;
      > div {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        @include getAfter(28);
        > span {
          font-size: px2vw(12);
          margin-left: px2vw(9);
        }
      }
    }
  }
  .staff-content {
    margin: 0 px2vw(10);
    height: px2vw(123.5);
    @include shadowPublic();
    display: flex;
    align-items: center;
    justify-content: center;
    > div {
      text-align: center;
    }
  }
}
</style>
