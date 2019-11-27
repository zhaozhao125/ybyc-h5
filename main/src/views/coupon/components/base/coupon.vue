<template>
  <div class="coupon-block">
    <!-- 内容 -->
    <div class="coupon-content" v-for="(item, index) in coupondata" :key="index" :class="bgImg">
      <!-- 上部 -->
      <div class="coupon-top" :class="couponTopBgImg">
        <div class="coupon-top-left">
          <span class="money" :class="fontWhite">{{item.type===1?item.money:item.discount/10}}</span>
          <span class="yuan" :class="fontWhite">{{item.type===1?"元":"折"}}</span>
        </div>
        <!-- tudu 省略号 -->
        <div class="coupon-top-right">
          <div>
            <span :class="[{'bg-gray':coupontype===2}]">{{usageType(item.usageType)}}券</span>
            <span :class="fontWhite">{{item.couponsName}}</span>
          </div>
          <div class="time-or-tip" :class="fontWhite" v-if="item.beginDate">
            <span>{{item.beginDate|handleData}}&nbsp;-&nbsp;{{item.expireDate|handleData}}</span>
          </div>
          <div class="time-or-tip coupon-use-tip" :class="fontWhite" v-if='item.type===1&&item.useMoneyCondition>0'>满{{item.useMoneyCondition}}元可用</div>
          <div class="time-or-tip coupon-use-tip" :class="fontWhite" v-if='item.type===2&&item.useMoneyTop>0'>最高可抵{{item.useMoneyTop}}元</div>
        </div>
      </div>
      <!-- 下部 -->
      <span class="coupon-bottom" :class="fontWhite"> {{item.detail}}</span>
    </div>

  </div>

</template>

<script>
export default {
  name: 'Coupon',
  props: {
    // 优惠券种类
    // 如果优惠券种类不同  背景颜色也不同
    coupontype: {
      type: Number,
      default: 1
    },
    // 字体颜色
    fontcolor: String,
    // 优惠券数据
    coupondata: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      currentbg: null, // 点击的背景
      allLoaded: false
    }
  },
  methods: {
    usageType(type) {
      switch (type) {
        case 'share':
          return '分时'
        case 'shortRent':
          return '短长租'
        case 'charge':
          return '充电'
      }
    }
  },
  computed: {
    // 优惠券的背景
    bgImg() {
      return `bg-img-${this.coupontype}`
    },
    couponTopBgImg() {
      return `coupon-top-bg-img-${this.coupontype}`
    },
    fontWhite() {
      return this.coupontype === 2 ? 'font-white' : ''
    }
  },
  filters: {
    money(value) {
      return value.split('.')[0]
    },
    handleData(value) {
      let valueArr = value.replace(/-/g, '.').split(':').slice(0, 2)
      return valueArr[0] + ':' + valueArr[1]
    }
  }
}
</script>

<style lang="scss" scoped>
.coupon-block {
  height: 100%;
  width: 100%;
  padding: 0 4.533333333333333vw 0 4.533333333333333vw;
  .coupon-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // height: 33.06666666666667vw;
    width: 100%;
    border-radius: 1.0666666666666667vw;
    padding-bottom: 2vw;
    margin-bottom: 2.6666666666666665vw;
    .coupon-top {
      // box-shadow: 0px 1px 1px #d4d105;
      width: 100%;
      display: flex;
      // justify-content: space-between;
      align-items: center;
      height: 24.08vw;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      margin-bottom: 2.668vw;
      // background-image: url('./../../img/coupon-bg-1.png');
      .coupon-top-left {
        width: 28vw;
        text-align: center;
        .money {
          font-size: 9.066666666666666vw;
          font-weight: bold;
        }
        .yuan {
          margin-left: -1vw;
          font-size: 4.8vw;
          font-weight: bold;
        }
      }
      .coupon-top-right {
        flex: 1;
        overflow: hidden;
        // background: red;
        display: flex;
        justify-content: center;
        flex-direction: column;
        white-space: nowrap;
        > div {
          // 名字
          &:first-child {
            display: flex;
            flex-direction: row;
            align-items: center;
            > span {
              &:first-child {
                background: #3d3d3d;
                border-radius: 0.5333333333333333vw;
                font-size: 2vw;
                color: #ffffff;
                padding: 0.5333333333333333vw;
                margin-right: 2vw;
              }
              &:last-child {
                overflow: hidden;
                text-overflow: ellipsis;
                font-weight: bold;
                padding-right: 1vw;
                font-size: 3.7333333333333334vw;
                color: #3d3d3d;
              }
            }
            .bg-gray {
              background: #c0c0c0 !important;
            }
          }
          &:nth-child(2) {
            margin-top: 2vw;
          }
        }
        //时间
        .time-or-tip {
          font-size: 2.6666666666666665vw;
          color: #3d3d3d;
        }
        .coupon-use-tip {
          width: 98%;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 1.3333333333333333vw;
        }
      }
    }
    // 未使用背景
    .coupon-top-bg-img-1 {
      background-image: url('./../../img/coupon-bg-1.png');
    }
    //失效背景
    .coupon-top-bg-img-2 {
      background-image: url('./../../img/coupon-bg-2.png');
    }
    .coupon-bottom {
      min-height: 3.2vw;
      font-size: 3.2vw;
      color: #3d3d3d;
      padding: 0 2vw;
      text-indent: 5.866666666666667vw;
    }
  }
  // 未使用背景
  .bg-img-1 {
    background-image: linear-gradient(90deg, #ffd024 0%, #edc100 100%);
  }
  //失效背景
  .bg-img-2 {
    background-image: linear-gradient(90deg, #bebebe 0%, #e1e1e1 100%);
  }
  .font-white {
    color: #ffffff !important;
  }
}
</style>
