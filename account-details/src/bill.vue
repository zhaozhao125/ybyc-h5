<template>
  <div id="bill-list">
    <!-- loading开始 -->
    <div v-show="showLoading">
      <loading></loading>
    </div>
    <!-- loading结束 -->
    <!-- 滚动组件 开始-->
    <div :style="{ height: wrapperHeight + 'px' }" ref="wrapper">
      <div v-infinite-scroll="loadMore" infinite-scroll-disabled="infiniteScrollDisabled" infinite-scroll-distance="10" infinite-scroll-immediate-check="true">
        <div class="bill-block border-1px" v-for="item in result" :key="item.accountRecordId" @click="jumpDetail(item)">
          <div class="bill-left">
            <span class="car-type">{{item.typeText+'-'+item.actionCodeText}}</span>
            <div>
              <span class="time">{{item.addTime}}</span>
            </div>
          </div>
          <div :class="[item.actionIncDecType==='INC' ?  'bill-right-yellow' : 'bill-right-black']" class="money">
            {{ item.actionIncDecType==="INC" ? `+${item.amount}` : `${item.amount}`}}
          </div>
        </div>
        <div v-show="showBottomLoading" class="loading">
          <mt-spinner type="fading-circle" :size="20"></mt-spinner><span>加载中...</span>
        </div>
        <div class="no-coupon" v-show="result.length&&nocoupon">我是有底线的哦~</div>
      </div>
      <!-- 暂无数据 开始-->
      <div v-show="!result.length&&noData" class="no-result">
        <img src="./assets/nodata@2x.png" alt="暂无数据">
        <span>您暂时还没有收入明细</span>
      </div>
      <!-- 暂无数据结束 -->
    </div>
    <!-- 滚动组件结束 -->
  </div>
</template>

<script>
const ERR_Ok = "ok";
import qs from "qs";
import loading from "./loading";
import { MessageBox } from "mint-ui";
import encryptParam from "@/util/encryptParam.js";

export default {
  name: "app",
  components: {
    loading
  },
  data() {
    return {
      result: [], //返回数据
      showLoading: true, //loading标志位
      noData: false, //暂无数据
      nocoupon: false, //没有更多优惠券
      userId: " ",
      page: 1, //初始页数
      pageNo: 1, //当前页数
      pageSize: 10, //当前数量
      totalSize: 0, //总条数数
      noCoupo: false,
      infiniteScrollDisabled: true, //是否加载到底部
      showBottomLoading: false,
      isEmpty: true, //加载数据标志位
      wrapperHeight: 0,
      user: null
    };
  },
  mounted() {
    // 如果不是生产环境 执行这段代码
    if (process.env.NODE_ENV !== "production") {
      this.userId = "87260";
      this.request();
    }
    // 需要手动调用
    setTimeout(() => {
      this.wrapperHeight =
        document.documentElement.clientHeight -
        this.$refs.wrapper.getBoundingClientRect().top;
      // 获取bridge
      if (this.$user) {
        this.userId = this.$user.userId;
        this.request();
      }
    }, 20);
  },
  methods: {
    //收支详情跳转
    jumpDetail(item) {
      this.$router.push({
        path: `/detail`,
        query: {
          userId: item.userId,
          id: item.accountRecordId
        }
      });
    },
    loadMore() {
      this.request();
      this.infiniteScrollDisabled = true;
    },
    // 请求数据
    request() {
      this.$ajax({
        method: "POST",
        url: "/user-money/record-page",
        data: qs.stringify(
          encryptParam(this.$user, {
            userId: this.userId,
            page: this.pageNo,
            pageSize: this.pageSize
          })
        )
      })
        .then(res => {
          if (res.data.errMsg === ERR_Ok) {
             this.showLoading = false;
            this.totalSize = res.data.data.total;
            this._genResult(res.data.data.rows);
          } else {
            let errMsg = res.data.errMsg || "请求错误";
            MessageBox("提示", errMsg);
            this.showLoading = false;
          }
        })
        .catch(error => {
          console.log(error);
        })
        .then(res => {
          this.noData = true; //显示暂无数据
          this.showLoading = false;
        });
    },
    // 处理数据
    _genResult(list) {
      this.showLoading = false;
      const arr = [];
      list.forEach((item, index) => {
        const element = {
          typeText: item.typeText,
          userId: item.userId, //用户名
          accountRecordId: item.accountRecordId, //收支明细id
          addTime: item.addTime, //时间
          actionCodeText: item.actionCodeText, //账户类型
          addTimeStr: item.addTimeStr, //时间
          amount: item.amount.toFixed(2), //金钱
          actionIncDecType: item.actionIncDecType //区分颜色和金钱的正负
        };
        arr.push(element);
      });
      if (!this.isEmpty) {
        this.result = this.result.concat(arr);
      } else {
        this.result = arr;
        this.isEmpty = false;
      }
      if (!this.result || this.pageSize * this.pageNo >= this.totalSize) {
        this.nocoupon = true;
        this.infiniteScrollDisabled = true;
        this.showBottomLoading = false;
      } else {
        this.infiniteScrollDisabled = false;
        this.showBottomLoading = true;
      }
      this.pageNo++;
    }
  }
};
</script>

<style lang='scss'>
html,
body {
  width: 100%;
  height: 100%;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
#bill-list {
  width: 100%;
  height: 100%;
  font-family: "Helvetica-Bold";
  .bill-block {
    display: flex;
    width: 94.666667%;
    height: 20.53vw;
    margin: 0 auto;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid #e7e7e7;
    .bill-left {
      padding-top: 4.78vw;
      .car-type {
        font-family: "PingFang";
        padding-top: 4.78vw;
        font-size: 4.8vw;
        color: #3d3d3d; // font-weight: 600;
      }
      div {
        .time {
          font-family: PingFangSC-Regular;
          font-size: 3.7333vw;
          color: #999999;
        }
      }
    }
    .money {
      font-size: 4.8vw;
      align-self: center;
      font-weight: 600;
    }
    .bill-right-yellow {
      color: #fdd000 !important;
    }
    .bill-right-black {
      color: #3d3d3d !important;
    }
  }
} // 暂无数据
.no-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20vw;
  color: #787878;
  img {
    width: 23vw;
    height: 29.6vw;
  }
  span {
    padding-top: 4vw;
    display: inline-block;
    white-space: nowrap;
    font-size: 3.7333vw;
  }
}
.no-coupon {
  margin: 0 auto;
  margin-top: 2.668vw;
  font-family: PingFangSC-Regular;
  font-size: 3.7333vw;
  color: #d6d6d6;
  width: 100%;
  text-align: center;
}
.loading {
  display: flex;
  margin-top: 3vw;
  color: #ccc;
  justify-content: center;
  align-items: center;
  span {
    margin-left: 3vw;
    font-size: 4.5vw;
  }
}
</style>
