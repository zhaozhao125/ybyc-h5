<template>
  <div class="violation-detail flex-col pd-3"
       v-if="violationData">
    <!-- 违章信息 -->
    <section class="violation-info position-relative">
      <header>
        <span class="fz-18 font-weight-normal">{{violationData.carNumber}}</span>
      </header>
      <div class="violation-content">
        <h3 class="fz-18">违章信息</h3>
        <p>时间：{{violationData.carViolationInfo.time}}</p>
        <p>地点：{{violationData.carViolationInfo.address}}</p>
        <p>行为：{{violationData.carViolationInfo.content}}</p>
        <p>罚款：<span class="highlight">{{violationData.carViolationInfo.price}}元</span> &nbsp;&nbsp;&nbsp;记分：<span class="highlight">{{violationData.carViolationInfo.score}}分</span></p>
        <!-- 只有待处理有处理倒计时字段 -->
        <p v-if="showRemainDays">剩余处理日期：
          <span v-if="violationData.remainDays>0">{{violationData.remainDays}}天</span>
          <span v-else>已逾期</span>
        </p>
      </div>
      <img :src="processImg"
           alt=""
           class="process-status position-absolute">
    </section>
    <!-- 行程信息 -->
    <section class="trip-info">
      <h3>行程信息</h3>
      <div class="trip-container position-relative"
           v-if="violationData.orderStartStation">
        <div class="trip-item position-relative trip-start">
          <div class="station-name fz-14">{{violationData.orderStartStation}}</div>
          <div class="order-date fz-12">{{violationData.orderStartTime}}</div>
        </div>
        <div class="trip-item position-relative trip-end">
          <div class="station-name fz-14">{{violationData.orderEndStation}}</div>
          <div class="order-date fz-12">{{violationData.orderEndTime}}</div>
        </div>
      </div>
      <div v-else
           class="fz-14">未获取到行程信息</div>
    </section>
    <!-- 凭证信息 状态为待审核和已处理时显示 -->
    <section class="voucher-info"
             v-if="showVoucherInfo">
      <h3 class="fz-18">凭证信息</h3>
      <p>凭证照片：<img :src="violationData.voucherImage"
             alt=""
             class="voucher-img"
             @click="voucherImgVisible=true"></p>
      <p>备注：{{violationData.remark || '暂无'}}</p>
    </section>
    <!-- 处理信息 状态为处理中时显示 -->
    <section class="process-info"
             v-if="showProcessInfo">
      <h3 class="fz-18">处理信息</h3>
      <p>驳回原因：{{violationData.rejectContent || '暂无'}}</p>
    </section>
    <div class="button-container flex-row">
      <mt-button plain
                 @click="handleGoToOnlineService">联系在线客服</mt-button>
      <mt-button v-if="showUploadButton"
                 @click="goToUpload">上传处理凭证</mt-button>
    </div>
    <mt-popup v-model="voucherImgVisible"
              popup-transition="popup-fade">
      <img :src="violationData.voucherImage"
           alt=""
           @click="voucherImgVisible=false">
    </mt-popup>
  </div>
</template>

<script>
import { Popup } from 'mint-ui'

const imgProcessed = require('@/views/violation/img/stamp-processed.png')
const imgProcessing = require('@/views/violation/img/stamp-processing.png')
const imgToBeAudit = require('@/views/violation/img/stamp-to-be-audit.png')
const imgToBeProcessed = require('@/views/violation/img/stamp-to-be-processed.png')

const statusToBeProcessed = 'create' // 待处理
const statusProcessing = 'dealing' // 处理中
const statusToBeAudit = 'consumerCommitted' // 待审核
const statusProcessed = 'finish' // 已处理

export default {
  components: {
    mtPopup: Popup
  },

  data() {
    return {
      // 违章ID
      violationID: '',
      // 违章数据Object
      violationData: null,
      // 当前状态
      dealStatusVal: null,
      // 显示凭证大图
      voucherImgVisible: false
    }
  },

  computed: {
    // 审核状态印章图片
    processImg() {
      switch (this.dealStatusVal) {
        case statusToBeProcessed:
          return imgToBeProcessed
        case statusProcessing:
          return imgProcessing
        case statusToBeAudit:
          return imgToBeAudit
        case statusProcessed:
          return imgProcessed
      }
      return ''
    },
    // 是否显示剩余处理日期
    showRemainDays() {
      return this.dealStatusVal == statusToBeProcessed
    },
    // 是否显示上传凭证按钮
    showUploadButton() {
      // 初始数据没有dealMode字段，初始默认为用户处理
      return (
        (this.dealStatusVal == statusToBeProcessed ||
          this.dealStatusVal == statusProcessing) &&
        (this.violationData && this.violationData.dealMode !== 'company_deal')
      )
    },
    // 是否显示凭证信息
    showVoucherInfo() {
      return (
        (this.dealStatusVal == statusToBeAudit ||
          this.dealStatusVal == statusProcessed) &&
        (this.violationData && this.violationData.voucherImage)
      )
    },
    // 是否显示处理信息
    showProcessInfo() {
      return (
        this.violationData &&
        this.violationData.rejectContent &&
        this.dealStatusVal == statusProcessing
      )
    }
  },

  mounted() {
    this.violationID = this.$route.params.id
    this.$service.getViolationDetail(this.violationID).then(res => {
      this.violationData = res.data.data
      this.dealStatusVal = res.data.data.dealStatusVal
    })
  },

  methods: {
    // 跳转上传处理凭证
    goToUpload() {
      this.$router.push({
        name: 'violationUpload',
        query: {
          id: this.violationID
        }
      })
    },
    // 跳转在线客服（调用App）
    handleGoToOnlineService() {
      this.$callHandler('serviceChat')
    }
  }
}
</script>

<style lang="scss">
.violation-detail {
  section {
    box-shadow: 0 0 6px 0 rgba(216, 216, 216, 0.7);
    border-radius: px2vw(4);
    margin-bottom: 3vw;
    h3 {
      margin-bottom: 3vw;
    }
    p {
      font-size: px2vw(14);
      color: $color-dark;
      margin-bottom: 1vw;
    }
  }
  .violation-info {
    header {
      padding: 2vw 4vw;
      border-bottom: 1px solid #e6e6e6;
    }
    .violation-content {
      padding: 3vw 4vw;
      p {
        font-size: px2vw(14);
        color: $color-dark;
        margin-bottom: 1vw;
      }
      .highlight {
        color: rgb(243, 58, 15);
      }
    }
    .process-status {
      width: px2vw(60);
      right: 3%;
      top: 5%;
    }
  }
  .trip-info {
    padding: 3vw 4vw;
    .trip-container {
      &::before {
        content: '';
        display: block;
        width: px2vw(6);
        height: px2vw(18);
        position: absolute;
        left: 1vw;
        top: 26%;
        background-image: url('~@/views/violation/img/arrow-down.png');
        background-size: contain;
      }
    }
    .trip-item {
      padding-left: 6vw;
      margin-bottom: 2vw;
      &::before {
        content: '';
        display: block;
        width: px2vw(10);
        height: px2vw(10);
        position: absolute;
        left: 0.5vw;
        top: 1.3vw;
        background-size: contain;
      }
    }
    .trip-start {
      &::before {
        background-image: url('~@/views/violation/img/qu.png');
      }
    }
    .trip-end {
      &::before {
        background-image: url('~@/views/violation/img/huan.png');
      }
    }
  }
  .voucher-info {
    padding: 3vw 4vw;
    .voucher-img {
      width: 15vw;
      height: 15vw;
      display: inline-block;
      object-fit: cover;
      vertical-align: text-top;
      margin-left: 2vw;
      background: $color-gray-white;
    }
  }
  .process-info {
    padding: 3vw 4vw;
  }
  .button-container {
    width: 96%;
    margin: auto;
    margin-bottom: 3vw;
    flex-shrink: 0;
    button:nth-of-type(even) {
      margin-left: 3vw;
    }
  }
  .mint-popup {
    width: 86%;
    font-size: 0;
    background-color: transparent;
    text-align: center;
    img {
      max-width: 100%;
    }
  }
}
</style>
