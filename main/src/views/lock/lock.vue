<template>
  <div id="lock-page">
    <p class="tip" v-if="result.length&&lockStatus">已降下地锁，请尽快驶入该车位</p>
    <!-- 滚动组件 开始-->
    <div :style="{ height: wrapperHeight + 'vw' }" ref="wrapper" class="lock-content">
      <div v-infinite-scroll="loadMore" ref="wrapperContent" infinite-scroll-disabled="infiniteScrollDisabled" infinite-scroll-distance="10" infinite-scroll-immediate-check="true">
        <div class="lock-item" v-for="(item, index) in result" :key="index">
          <span :class="{'add-gray':(index!==currentIndex&&lockStatus)}">编号&nbsp;{{item.parkingShowSn}}</span>
          <div>
            <div @click="whistle(index,item)">
              <img :src="imgSrc1(index)">
              <span :class="{'add-gray':index!==currentIndex&&lockStatus}">鸣笛寻锁</span>
            </div>
            <div @click="openOrCloseLock(index,item)">
              <img :src="imgSrc2(index)">
              <span :class="{'add-gray':index!==currentIndex&&lockStatus}">{{index===currentIndex&&lockStatus?'升地锁':'降地锁'}}</span>
            </div>
          </div>
        </div>

        <div v-show="result.length&&showBottomLoading&&noData" class="loading">
          <mt-spinner type="fading-circle" :size="20"></mt-spinner>
          <span>加载中...</span>
        </div>
        <div class="is-bottom" v-show="result.length&&!showBottomLoading&&isBottom">我是有底线的哦~</div>
      </div>
      <!-- 暂无数据 开始-->
      <div v-show="!result.length&&noData" class="no-result">
        <img src="./img/unlock.png" alt="暂无数据">
        <p>该网点暂无可用智能地锁设备</p>
        <p>还车时可还至网点任一可用车位内</p>
      </div>
    </div>
    <!-- 滚动组件结束 -->
    <button v-show='result.length' @click="refresh">刷新</button>
  </div>
</template>
<script>
import { MessageBox } from 'mint-ui'
export default {
  name: 'lock',
  data() {
    return {
      result: [], // 返回数据
      noData: false, // 暂无数据
      nocoupon: false, // 没有更多优惠券
      page: 1, // 初始页数
      pageNo: 1, // 当前页数
      pageSize: 10, // 当前数量
      totalSize: 0, // 总条数数
      noCoupo: false,
      infiniteScrollDisabled: true, // 是否加载到底部
      showBottomLoading: false,
      isEmpty: true, // 加载数据标志位
      wrapperHeight: 0,
      user: null,
      lockStatus: false, // 地锁状态
      currentIndex: null,
      currentValue: null,
      isBottom: false,
      stationSn: '',
      parkingType: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.wrapperHeight = (document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top) / 3.75

      // 未编译
      if (process.env.NODE_ENV === 'development') {
        this.stationSn = 'S4101000029'
        this.parkingType = 0
        this.request()
      } else {
        //  编译
        if (this.$callHandler) {
          this.$callHandler('getParkingParam', {}).then(res => {
            // this.getMessage(JSON.stringify(res))
            this.stationSn = res.stationSn
            this.parkingType = res.parkingType
            this.request()
          })
        }
      }
    })
  },
  methods: {
    imgSrc1(index) {
      if (!this.lockStatus || index === this.currentIndex) {
        return require('./img/whistle.png')
      } else {
        return require('./img/gray-whistle.png')
      }
    },
    imgSrc2(index) {
      if (!this.lockStatus) {
        return require('./img/down.png')
      } else if (index === this.currentIndex) {
        return require('./img/up.png')
      } else {
        return require('./img/gray-down.png')
      }
    },
    // 升降地锁
    openOrCloseLock(index, value) {
      // 如果请求成功 就不能再点击地锁了
      this.forbidClick(index, () => {
        // if (value.checkOut) {
        //   this.getMessage('该车位已驶入其他车辆，请选择其他车位')
        //   return
        // }
        let message, confirmButtonText
        if (this.lockStatus) {
          window.sa.track('h5ClickParkingLockUp')
          message = '确定升起该地锁吗？确定后可选择其它地锁'
          confirmButtonText = '确定升锁'
        } else {
          window.sa.track('h5ClickParkingLockDown')
          message = '每笔订单仅可降下一个地锁，2分钟内未驶入车辆，将自动升锁，请确保车辆已在车位附近'
          confirmButtonText = '确定降锁'
        }
        MessageBox({
          message,
          confirmButtonText,
          showCancelButton: true,
          confirmButtonClass: 'add-black'
        }).then(boxAction => {
          if (boxAction === 'confirm') {
            let action, successMessage, errorMessage
            if (this.lockStatus) {
              action = 'hb'
              successMessage = '升地锁成功'
              errorMessage = '升地锁失败，请稍候重试'
            } else {
              action = 'ha'
              successMessage = '降地锁成功'
              errorMessage = '降地锁失败，请稍候重试'
            }
            this.$service.openOrCloseLock(value.parkingSn, value.lockSn, action).then(res => {
              console.log(res.data, '====then=====')
              // 判断resultData
              this.lockStatus = !this.lockStatus
              // 成功之后 把第一个添加到第一个
              this.currentValue = value
              this.handleArr()
              this.currentIndex = 0
              this.getMessage(successMessage)
              console.log(this.result, '=======数据=========')
            }).catch(error => {
              console.log(error, '====error=====')
              this.getMessage(error.errMsg || errorMessage)
            })
          }
        })
      })
    },
    // 鸣笛
    whistle(index, value) {
      window.sa.track('h5ClickParkingLockTweet')
      this.forbidClick(index, () => {
        this.$service.tweet(value.parkingSn, value.lockSn).then(res => {
          if (res.data.errCode === 0) {
            this.getMessage('寻地锁成功')
          }
        }).catch(error => {
          this.getMessage('寻地锁失败，请稍候重试')
        })
      })
    },
    forbidClick(index, callBack) {
      if (!this.lockStatus || this.currentIndex === index) {
        callBack()
      }
    },
    loadMore() {
      this.request(false)
      this.infiniteScrollDisabled = true
    },
    // 刷新
    refresh() {
      this.result = []
      this.noData = false
      this.pageNo = 1
      this.pageSize = 10
      this.request(true)
    },
    getMessage(message) {
      MessageBox({
        message,
        showCancelButton: false,
        confirmButtonText: '我知道了',
        confirmButtonClass: 'add-black'
      })
    },
    // 请求数据
    request(showLoading) {
      this.$service.parkingsLock(this.stationSn, Number(this.parkingType), this.pageNo, this.pageSize, showLoading).then(res => {
        this.totalSize = res.data.data.totalElements
        this._getResult(res.data.data.records)
        this.noData = true
      })
    },
    // 处理请求过的
    handleArr() {
      for (var i = 0; i < this.result.length; i++) {
        if (this.result[i].lockSn === this.currentValue.lockSn) {
          this.result.splice(i, 1) // 如果数据组存在该元素，则把该元素删除
        }
      }
      this.result.unshift(this.currentValue) // 再添加到第一个位置
      console.log(this.result, '处理后的数据')
    },
    // foreach不能删除数组吗
    // 处理数据
    _getResult(list) {
      const arr = []
      list.forEach((item, index) => {
        console.log(item.parkingShowSn)
        // 自己是否使用中   1=使用中   0=未使用
        if (item.selfUsing === 1) {
          this.lockStatus = true
          this.currentIndex = 0
          this.currentValue = item
        } else {
          this.lockStatus = false
          this.currentIndex = null
          this.currentValue = null
        }
        const element = {
          parkingShowSn: item.parkingShowSn, // 地锁编号
          parkingSn: item.parkingSn, // 停车位平台编号
          lockSn: item.lockSn
        }
        arr.push(element)
      })

      console.log(arr.length, '数组长度')
      // 如果有使用中的 找到这个使用中的锁 不置灰 其他的置灰 否则
      if (!this.isEmpty) {
        this.result = [...this.result, ...arr]
      } else {
        this.result = arr
        this.isEmpty = false
      }
      if (this.currentValue) {
        // 直接删掉
        this.handleArr()
      }
      if (!this.result || this.pageSize * this.pageNo >= this.totalSize) {
        this.infiniteScrollDisabled = true
        this.showBottomLoading = false
      } else {
        this.infiniteScrollDisabled = false
        this.showBottomLoading = true
      }
      this.pageNo++
      this.$nextTick(() => {
        this.isBottom = this.$refs.wrapperContent.scrollHeight > document.documentElement.clientHeight
      })
    }
  }
}
</script>
<style lang='scss'>
html,
body {
  width: 100%;

  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

#lock-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .lock-content {
    flex: 1;
    overflow-y: scroll;
    margin-top: vw(10);
  }
  .tip {
    background: #fefdee;
    height: vw(36);
    font-size: vw(12);
    color: #f5a623;
    border-bottom: 1px solid #fef1b6;
    text-align: center;
    line-height: vw(36);
  }
  .add-black {
    color: #3d3d3d !important;
  }
  button {
    height: vw(50);
    width: 100%;
    border: none;
    font-size: vw(17);
    color: #ffffff;
    background: #3d3d3d;
  }
  .lock-item {
    height: vw(65);
    background: #ffffff;
    box-shadow: 0 0 vw(4) 0 rgba(0, 0, 0, 0.05);
    width: vw(350);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: vw(10);
    padding-right: vw(15);
    margin-bottom: vw(10);
    > span {
      font-size: vw(18);
      color: #3d3d3d;
      font-weight: bold;
    }
    > div {
      display: flex;
      > div {
        display: flex;
        align-items: center;
        flex-direction: column;
        span {
          font-size: vw(12);
          color: #3d3d3d;
          margin-top: 1vw;
        }
        img {
          width: vw(19);
        }
        &:first-child {
          position: relative;
          padding-right: vw(15);
          // background: red;
          &::after {
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;
            content: '';
            display: block;

            width: 1px;
            height: vw(31);

            background: #efefef;
          }
        }
        &:last-child {
          margin-left: vw(15.5);
          // margin-left: vw(15.5);
        }
      }
    }
  }
  .add-gray {
    color: #d7d7d7 !important;
  }
  .no-result {
    text-align: center;
    p {
      font-size: px2vw(14);
      color: #3d3d3d;
    }
    img {
      width: vw(120);
      height: vw(120);
      margin-top: px2vw(74);
      margin-bottom: px2vw(20);
    }
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
  .is-bottom {
    text-align: center;
    width: 100%;
    font-size: 3.7333vw;
    color: #d6d6d6;
    margin-bottom: 2vw;
  }
}
</style>
