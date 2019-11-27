export const publicjs = {
  data () {
    return {
      params: {
        pageNo: 1, // 当前页数
        pageSize: 6, // 当前数量
        totalPages: 0, // 总页数
        from: null // 入口优惠券排序判断
      },
      resultData: [], // 数据
      nocoupon: false, // 没有更多优惠券
      noData: false, // 暂无数据
      isEmpty: true, // 上划加载标志位
      showLoading: true, // loading显示
      infiniteScrollDisabled: true, // 是否已经加载完毕 若为真 无限加载不会被触发
      showBottomLoading: false // 底部loading显示
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$loading.open()
      // alert(window.location, '1')
      // 获取入口判断的参数
      window.location.search
        .replace('?', '')
        .split('&')
        .forEach(item => {
          let queryItem = item.split('=')
          if (queryItem[0] === 'from' && queryItem[1] === 'topNotice') {
            this.params.from = queryItem[1]
          }
        })
      // alert(this.$route.query.from, '3')
      if (this.$route.query.from === 'topNotice') {
        this.params.from = this.$route.query.from
      }
      // alert(window.location)
      // alert(this.params.from)
      this.request()
      // 阻止loading弹出页面滚动
      document.querySelector('.content').addEventListener(
        'touchmove',
        e => {
          e.preventDefault()
          e.stopPropagation()
        },
        false
      )
    })
  },
  methods: {
    // 屏幕没撑满加载
    loadMore () {
      if (this.params.pageNo > this.params.totalPages) {
        return
      }
      this.request()
    },
    // 优惠券接口
    request () {
      let paramsObj = {
        userCouponStatus: this.couponType,
        page: this.params.pageNo,
        pageSize: this.params.pageSize,
        userId: this.$store.getters.user.id
      }
      if (this.params.from) {
        paramsObj.from = this.params.from
      }
      // setTimeout(() => {
      this.$service.listCoupons(paramsObj).then(res => {
        console.log(res)
        if (res.data.errCode === 0) {
          this.params.totalPages = res.data.data.totalPages
          this._genResult(res.data.data.records)
          this.noData = true
          this.$loading.close()
        }
      })
      // }, 1)
    },
    // 处理数据
    _genResult (data) {
      this.$loading.close()
      if (!this.isEmpty) {
        this.resultData = this.resultData.concat(data)
      } else {
        this.resultData = data
        this.isEmpty = false
      }
      if (!this.resultData || this.params.pageNo >= this.params.totalPages) {
        this.nocoupon = true
        this.infiniteScrollDisabled = true
        this.showBottomLoading = false
      } else {
        this.showBottomLoading = true
        this.infiniteScrollDisabled = false
      }
      this.params.pageNo++
      this.$emit('get_data_length', this.resultData.length)
    }
  }
}
