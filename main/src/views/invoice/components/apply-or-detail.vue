<template>
  <div class="invoice-detail">
    <!-- 上部 -->
    <div class="up">
      <h3>发票类型</h3>
      <div class="table-center">
        <span :class="[isDetailPage?'no-bg':'has-bg']" class="invoice-type">{{isDetailPage&&routeParams?routeParams.type=='electronic'?'电子':'纸质':'电子'}}发票</span>
      </div>
      <span class="tip" v-if="!isDetailPage">目前仅支持开具电子发票，电子发票与纸质发票具有同等法律效力，可支持报销入账</span>
      <h3 style="margin-top:5.3vw">发票信息</h3>
      <div class="choise-content" v-if='isDetailPage'>
        <div class="table-center">
          <span class="no-bg">{{routeParams.titleType=='personal'?'个人':'企业'}}发票</span>
        </div>
      </div>
      <div class="choise-content" v-else>
        <div class="table-center">
          <span :class="[invoiceType==='company'?'has-bg':'no-bg']" @click="invoiceType='company'">企业发票</span>
        </div>
        <div class="table-center">
          <span :class="[invoiceType==='personal'?'has-bg':'no-bg']" @click="invoiceType='personal'">个人发票</span>
        </div>
      </div>
      <div class="fill-in-item">
        <span>发票抬头:</span>
        <span v-if='isDetailPage' class='detail-readonly'>{{routeParams.title}}</span>
        <input v-else type="text" placeholder="请输入发票抬头" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;" v-model="companyName">
        <img src="./../img/close.png" v-show="companyName" @click="clear('companyName')" v-if='!isDetailPage'>
      </div>
      <div class="fill-in-item" v-if="invoiceType==='company'">
        <span>税&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号:</span>
        <span v-if='isDetailPage' class='detail-readonly'>{{routeParams.taxNumber}}</span>
        <input v-else type="text" placeholder="请输入税号" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;" v-model="taxNumber">
        <img src="./../img/close.png" v-show="taxNumber" @click="clear('taxNumber')" v-if='!isDetailPage'>
      </div>
      <div class="fill-in-item ">
        <span>发票内容:</span>
        <span class="free" :class="{'font-color':isDetailPage}">{{routeParams.content}}</span>
      </div>
      <div class="fill-in-item ">
        <span>发票金额:</span>
        <span class="money">{{routeParams.money.toFixed(2)}}</span>
      </div>
      <div class="fill-in-item " v-if='isDetailPage'>
        <span>申请时间:</span>
        <span class="time">{{routeParams.applyTime|getFormatDate}}</span>
      </div>
      <h3 style="margin-top:5.333vw">接收方式</h3>
      <div class="fill-in-item ">
        <span>电子邮箱:</span>
        <input type="text" placeholder="请输入电子邮箱" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;" v-model="email" :readonly='isDetailPage'>
        <img src="./../img/close.png" alt="" v-show="email" @click="clear('email')" v-if='!isDetailPage'>
      </div>
    </div>
    <!-- 按钮 -->
    <button :class="{'bg-activity':buttonStatus}" v-if='!isDetailPage' @click="submitinvoice">提交</button>
  </div>
</template>
<script>
import { Toast, MessageBox } from 'mint-ui'
import { mixinFilter } from './../mixin/mixin'
export default {
  name: 'invoiceApplyOrDetail',
  mixins: [mixinFilter],
  data() {
    return {
      invoiceType: 'company',
      companyName: '',
      taxNumber: '',
      email: ''
      // routeParams: {}
    }
  },
  computed: {
    buttonStatus() {
      return this.invoiceType === 'company' ? this.companyName && this.email && this.taxNumber : this.companyName && this.email
    },
    isDetailPage() {
      return this.$route.meta.title === '开票详情'
    },
    routeParams() {
      return this.$route.params
    }
  },
  mounted() {
    // 详情页面渲染
    if (this.isDetailPage) {
      this.email = this.routeParams.email
      this.taxNumber = this.routeParams.taxNumber
      this.invoiceType = this.routeParams.titleType
    }
  },
  methods: {
    clear(name) {
      this[name] = ''
    },
    submitinvoice() {
      let reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
      if (!this.buttonStatus) {
        return
      }
      if (!reg.test(this.email)) {
        Toast({
          message: '请输入正确的电子邮箱'
        })
        return
      }
      if (this.routeParams.sameCity) {
        this._submit()
      } else {
        MessageBox({
          message: `申请开票的订单来自${this.routeParams.splitCount}个城市，提交后系统会根据订单所属城市自动拆分成${this.routeParams.splitCount}次开票申请。`,
          confirmButtonText: '确定',
          showCancelButton: true
        }).then(res => {
          if (res === 'confirm') {
            this._submit()
          }
        })
      }
    },
    _submit() {
      let params = {
        orderType: this.routeParams.orderType, // 订单类型
        orderIds: this.routeParams.orderIds.join(','),
        content: this.routeParams.content,
        type: 'electronic',
        titleType: this.invoiceType,
        money: this.routeParams.money.toFixed(2),
        title: this.companyName,
        email: this.email
      }
      if (this.invoiceType === 'company') {
        params.taxNumber = this.taxNumber
      }
      this.$service.invoiceApply(params).then(res => {
        Toast({
          message: '提交成功，稍后请查收您的电子邮箱'
        })
        this.$router.go(-1)
      })
    }
  }
}
</script>
<style lang="scss">
.invoice-detail {
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #ffffff;
  padding: vw(15);
  .has-bg {
    background-image: linear-gradient(-135deg, #ffeb00 0%, #fdd000 100%);
  }
  .no-bg {
    border: 1px solid #e6e6e6;
  }
  .font-color {
    color: #3d3d3d !important;
  }
  .up {
    min-height: calc(100% - 13.06667vw);
    padding-bottom: vw(20);
    width: 100%;
    overflow: hidden;
    .table-center {
      margin-top: vw(10);
      margin-bottom: vw(10);
      display: table;
      span {
        display: block;
        border-radius: vw(2);
        font-size: 14px;
        line-height: vw(30);
        text-align: center;
        height: vw(30);
        width: vw(110);
      }
    }
    h3 {
      font-size: vw(16);
      font-weight: bold;
      color: #3d3d3d;
      &:last-of-type {
        margin-top: vw(20);
        margin-bottom: vw(10);
      }
    }
    .choise-content {
      display: flex;
      margin-top: vw(10);
      margin-bottom: vw(5);
      * {
        margin: auto 0;
      }
      & div {
        margin-right: vw(10);
      }
    }

    .fill-in-item {
      display: flex;
      align-items: center;
      font-size: vw(13);
      color: #3d3d3d;
      height: vw(38);
      width: 96%;
      overflow: hidden;
      border-bottom: 1px $color-button-white solid;
      span {
        white-space: nowrap;
      }
      .detail-readonly {
        margin-left: 3.2vw;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .time {
        text-indent: 3.4667vw;
        font-size: 3.7333333333333334vw;
        color: #3d3d3d;
      }
      .free {
        font-size: 3.7333333333333334vw;
        color: #999999;
        margin-left: vw(12);
      }
      .money {
        font-size: vw(13);
        color: #f5a623;
        margin-left: vw(12);
        &::after {
          margin-left: vw(1);
          content: '元';
          color: #c0c0c0;
        }
      }
      .email {
        font-size: vw(13);
        color: #3d3d3d;
      }
      input {
        flex: 1;
        padding-top: 1px;
        height: 100%;
        text-indent: 3.4667vw;
        font-size: 3.7333333333333334vw;
        color: #3d3d3d;
        outline: none;
        border: none;
        border-right: none;
        -webkit-appearance: none; /*清除ios默认圆角*/
        border-radius: 0;
        &::-webkit-input-placeholder {
          line-height: 4.8vw;
          font-size: 3.7333333333333334vw;
          color: #c0c0c0;
          text-indent: 3.4667vw;
        }
      }
      img {
        width: vw(16);
        height: vw(16);
      }
    }
    .tip {
      font-size: vw(11);
      color: #bbb9ba;
      line-height: vw(20);
      margin-bottom: vw(10);
    }
  }
  button {
    height: vw(49);
    background: #c0c0c0;
    border-radius: vw(2);
    font-size: vw(17);
    border: none;
    color: #ffffff;
    width: 100%;
    &.bg-activity {
      background: #3d3d3d;
    }
  }
}
</style>
