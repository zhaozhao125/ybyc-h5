<template>
  <div class="my-coupon height-100 flex-col">
    <div class="tab-control position-fixed top-0 left-0 width-100 zindex-99 flex-row justify-content-between" :class='addColorClass()'>
      <div class="tab-item" @touchend="toggleTabs('unUsed')">
        <span>未使用</span>
        <span :class="{'empty-show':currentActive==='unUsed'}" class="empty"></span>
      </div>
      <div class="tab-item" @touchend="toggleTabs('beenUsed')">
        <span>已使用</span>
        <span :class="{'empty-show':currentActive==='beenUsed'}" class="empty"></span>
      </div>
      <div class="tab-item" @touchend="toggleTabs('nullBrace')">
        <span>已失效</span>
        <span :class="{'empty-show':currentActive==='nullBrace'}" class="empty"></span>
      </div>
    </div>

    <!-- 兑换区块开始 -->
    <div class="exchange-coupon bg-white overflow-hidden position-fixed width-100 flex-row justify-content-between align-items-center plain-input" :class="handleSlide()" id="getCoupon" v-if="isShowCoupon">
      <input type="text" class="input-coupon fz-14 bg-white" :class="{inputborder:changstate}" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;" placeholder="请输入兑换码" v-model.trim="inputCoupon">
      <span class="click-coupon text-center fz-18 font-weight-bold color-white" :class="{'clickbg':changstate}" @click="getcoupon">兑换 </span>
    </div>
    <!-- 兑换区块结束 -->
    <div class="upper-content flex-1 bg-white overflow-auto" id="scroll-content" @scroll.passive="onScroll">
      <!-- 动态组件渲染的内容 -->
      <component :is="currentView" ref="content" @get_data_length="getDataLength"></component>
    </div>
    <img src="./img/banner.png" alt="banner" class="banner width-100" @click="jumpPage">
  </div>
</template>
<script>
import unUsed from './components/un-used' // 未使用
import beenUsed from './components/been-used' // 已使用
import nullBrace from './components/null-brace' // 已失效
let $scrollContent
export default {
  name: 'app',
  components: {
    beenUsed,
    nullBrace,
    unUsed
  },
  mounted() {
    this.$nextTick(() => {
      $scrollContent = document.getElementById('scroll-content')
      let startY, endY
      // 记录手指触摸的起点坐标
      $scrollContent.addEventListener(
        'touchstart',
        function(e) {
          startY = e.touches[0].pageY
        },
        false
      )
      $scrollContent.addEventListener(
        'touchmove',
        function(e) {
          endY = e.touches[0].pageY // 记录手指触摸的移动中的坐标
          // 手指下滑，页面到达顶端不能继续下滑
          if (endY > startY && $scrollContent.scrollTop <= 0) {
            e.preventDefault()
            e.stopPropagation()
          }
        },
        false
      )
    })
  },
  data() {
    return {
      currentView: 'unUsed', // 默认选中未使用组件
      beenUsed: 'beenUsed', // 已使用组件
      nullBrace: 'nullBrace', // 已失效组件
      unUsed: 'unUsed', // 未使用组件
      currentActive: 'unUsed', // 切换样式
      couponType: 1, // 优惠券类型
      inputCoupon: '', // 输入优惠券
      changstate: false, // 输入兑换码改变状态
      isShowCoupon: true, // 兑换区块显示与隐藏
      couponLength: 0,
      newScrollPosition: 0,
      lastScrollPosition: 0,
      addPositionClass: false
    }
  },
  methods: {
    onScroll() {
      if (this.isShowCoupon) {
        this.$nextTick(() => {
          this.lastScrollPosition = $scrollContent.scrollTop
          // Scrolling down
          if (
            this.newScrollPosition < this.lastScrollPosition &&
            this.lastScrollPosition > 100
          ) {
            this.addPositionClass = true
            // Scrolling up
          } else if (this.newScrollPosition > this.lastScrollPosition) {
            this.addPositionClass = false
          }
          this.newScrollPosition = this.lastScrollPosition
        })
      } else {
        this.addPositionClass = false
      }
    },
    addColorClass() {
      if (this.$store.getters.user.client == 2) {
        // android终端
        return 'light-gray'
      } else {
        return 'dark-gray'
      }
      // if (this.$store.getters.user.version >= 270) {
      //   return 'dark-gray'
      // } else {
      // { return 'light-gray' }
      // }
    },
    getDataLength(length) {
      this.couponLength = length
    },
    // 绑定切换事件
    toggleTabs: function(tabText) {
      this.currentView = tabText // 当前组件
      this.currentActive = tabText // 切换样式
      tabText === 'unUsed'
        ? (this.isShowCoupon = true)
        : (this.isShowCoupon = false)
    },
    getcoupon() {
      // 兑换优惠券
      // getcoupon() {
      if (this.inputCoupon) {
        this.getCouponAjax(
          this.inputCoupon.substring(0, 1) === '#'
            ? 'gainRandomCode'
            : 'gainCoupons'
        )
      }
    },
    jumpPage() {
      window.sa.track('h5InvitationCouponButtonClick')
      this.$router.push({
        name: 'invite',
        query: {
          from: 'coupon'
        }
      })
    },
    getCouponAjax(ajaxName) {
      this.$service[ajaxName]({
        redeemCode: this.inputCoupon,
        userId: this.$store.getters.user.id
      }).then(res => {
        if (res.data.errCode === 0) {
          this.inputCoupon = ''
          // this.$nextTick(() => {
          this.$refs.content.clear_data()
          // this.$refs.content.request()
          // })
        }
      })
    },
    handleSlide() {
      return this.addPositionClass ? 'slideUp' : 'slideDown'
    }
  },
  watch: {
    inputCoupon(fresh, old) {
      return fresh ? (this.changstate = true) : (this.changstate = false)
    }
  }
}
</script>

<style lang='scss'>
.my-coupon {
  // 选中的样式
  .empty {
    display: none;
    height: 0.53vw;
    width: 110%;
    background: #fdd000;
    border-radius: 2px; // 解决安卓手机圆角失效问题
    background-clip: padding-box;
  }
  .empty-show {
    display: block;
  }
  .tab-control {
    // 选项卡标题
    height: 9vw;
    align-items: flex-start;
    background: #3d3d3d;
    padding: 0 15vw 0 15vw;
    .tab-item {
      // 选项卡每一个标题
      display: flex;
      height: 100%;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      white-space: nowrap;
      font-size: 4.2666vw;
      color: #ffffff;
      span {
        &:first-child {
          padding-bottom: 2px;
        }
      }
    }
  }
  .light-gray {
    background: #3d3d3d;
  }
  .dark-gray {
    background: rgba(46, 46, 46, 1);
  }
  // 输入框容器

  .exchange-coupon {
    top: 9vw;
    z-index: 10;
    height: 21.37vw;
    padding: 0 4.53333vw 0 4.533333vw;
    .input-coupon {
      height: 11.7333333vw;
      width: 67.466667vw;
      text-indent: 3.4667vw;
      border: 1px solid #e6e6e6;
      border-right: none;
      border-radius: 1.06667vw 0 0 1.06667vw;
      // border-radius: 0;
      &::-webkit-input-placeholder {
        line-height: 4.8vw;
        font-size: 3.7333333333333334vw;
        color: #999999;
        text-indent: 3.4667vw;
      }
    }
    // 点击按钮
    .click-coupon {
      height: 11.73333vw;
      width: 23.466665vw;
      line-height: 11.73333333vw;
      background: #c8c8c8;
      border-radius: 0 1.06667vw 1.06667vw 0;
    }
    .clickbg {
      background: #fdd000;
    }
    .inputborder {
      border: 1px solid #fdd000;
    }
  }
  .slideUp {
    transform: translateY(-22vw);
    opacity: 0.7;
    transition: transform 0.5s ease, opacity 0.5s ease-out;
  }
  .slideDown {
    transform: translateY(0);
    transition: transform 0.5s ease;
  }
}
</style>
