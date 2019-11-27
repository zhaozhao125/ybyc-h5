import { formatDate } from '@/util/common'
export const mixinFilter = {
  filters: {
    getFormatDate (val) {
      return formatDate(val)
    }
  }
}
export const mixinLoadMore = {
  data () {
    return {
      isShowData: false, // 暂无数据
      page: 1, // 初始页数
      pageNo: 1, // 当前页数
      pageSize: 10, // 当前数量
      totalPages: 0, // 总页数
      isEmpty: true, // 加载数据标志位
      infiniteScrollDisabled: true, // 是否加载到底部
      showBottomLoading: false // 是否显示加载更多loading
    }
  },
  methods: {
    /**
     * 加载更多
     */
    loadMore () {
      this.infiniteScrollDisabled = true
      if (this.pageNo > this.totalPages) {
        return
      }
      this.request(false)
    }
  }
}
