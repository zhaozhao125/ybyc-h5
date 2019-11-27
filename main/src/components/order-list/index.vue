<template>
  <div class="order-list flex-col overflow-hidden flex-1">
    <div class="order-top flex-row">
      <div class="order-title">
        订单列表（{{orderCount}}条）
      </div>
      <div class="order-select">
        <drop-down :listName="dropDownList" @command="handleChangeRange">
          <span v-if="searchByMonth">本月</span>
          <span v-else>全部</span>
        </drop-down>
      </div>
    </div>
    <div class="order-main flex-1 overflow-auto">
      <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="infiniteScrollDisabled" infinite-scroll-distance="10" v-show="orderList && orderList.length">
        <!-- <ul> -->
        <li v-for="(item, index) in orderList" :key="index" @click="handleShowDetail(item)">
          <div class="order-item">
            <div class="car-number flex-row align-items-center">
              <span>{{item.carNumber}}</span>
              <span v-if="item.userName && !userId">{{item.userName}}（{{item.userPhone}}）</span>
              <img src="./img/arrow.png" alt="">
            </div>
            <div class="order-info flex-row">
              <div class="order-date">
                <img src="./img/icon-time.png" alt="">
                <span>{{item.orderDate | dateFilter}}</span>
              </div>
              <div class="order-money">
                <img src="./img/icon-time.png" alt="">
                <span>{{item.amount}}元</span>
              </div>
            </div>
            <div class="station-info flex-row align-items-center take-station">
              <img src="./img/icon-take.png" alt="">
              <span class="station-name">{{item.takeStationName}}</span>
            </div>
            <div class="station-info flex-row align-items-center return-station">
              <img src="./img/icon-return.png" alt="">
              <span class="station-name">{{item.returnStationName}}</span>
            </div>
          </div>
        </li>
      </ul>
      <p v-show="allLoaded && (!orderList || !orderList.length)" class="no-order text-center fz-14">
        <span v-show="searchByMonth">本月</span>{{emptyText}}
      </p>
      <div class="common-loading" v-show="!allLoaded">
        <mt-spinner type="snake"></mt-spinner>
      </div>
      <p v-if="allLoaded && page>1" style="margin:3vw" class="text-center fz-14">加载完毕</p>
    </div>
  </div>
</template>

<script>
import dropDown from '@/components/drop-down'
// const DATA = {
//   carNumber: '豫AB1234',
//   date: '10月18日',
//   money: '2.00',
//   takeStation: '一步用车售后服务维修中心服务点(东区)',
//   returnStation: '中南物业居然之家商都路店服务点(东区)',
//   username: '秦亚什',
//   userPhone: '13322332233'
// }
// let arr = new Array(5)
// arr.fill(DATA)

function addZero(param) {
  if (param < 10) {
    return '0' + param
  }
  return param
}
export default {
  props: {
    params: {
      type: Object
    },
    emptyText: {
      type: String,
      default: '暂无订单'
    }
  },

  components: {
    dropDown
  },

  data() {
    return {
      dropDownList: ['本月', '全部'],
      loading: false,
      orderList: [],
      allLoaded: false,
      page: 1,
      userId: '',
      orderCount: 0,
      searchByMonth: true
    }
  },

  computed: {
    companySn() {
      return this.$store.getters.companySn
    },
    infiniteScrollDisabled() {
      return this.loading || this.allLoaded
    }
  },

  watch: {
    params: {
      handler: newVal => {
        this.loadData()
      },
      deep: true
    }
  },

  filters: {
    dateFilter(val) {
      let date = new Date(val)
      let month = addZero(date.getMonth() + 1)
      let day = addZero(date.getDate())
      return `${month}月${day}日`
    }
  },

  created() {
    console.log('====this.params====', this.params)
    if (this.params) {
      this.userId = this.params.userId || ''
    }
  },

  methods: {
    loadData() {
      console.log('====loadData====')
      this.allLoaded = false
      this.page = 1
      this.orderList = []
      this.loading = true
      this.$service
        .getCompanyOrderList(this.page, {
          companySn: this.companySn,
          whetherThisMonth: this.searchByMonth,
          userId: this.userId
        })
        .then(res => {
          console.log('====res====', res)
          let result = res.data.data
          if (result.totalPages <= this.page) {
            this.allLoaded = true
          }
          this.page++
          this.orderList = result.records
          this.orderCount = result.totalElements
          this.loading = false
        })
        .catch(err => {
          this.loading = false
        })
    },
    loadMore() {
      console.log('====loadMore====')
      this.loading = true
      this.$service
        .getCompanyOrderList(this.page, {
          companySn: this.companySn,
          whetherThisMonth: this.searchByMonth,
          userId: this.userId
        })
        .then(res => {
          console.log('====res====', res)
          let result = res.data.data
          if (result.totalPages <= this.page) {
            console.log('====allLoaded====')
            this.allLoaded = true
          }
          // test
          // let arr = new Array(20)
          // arr.fill({'sn': 'TO201805231001256877',
          //   'orderDate': 1527041205000,
          //   'amount': 20.0,
          //   'carNumber': '豫A2L07Q',
          //   'takeStationId': 699,
          //   'takeStationSn': 'S4101000504',
          //   'takeStationName': '袁网点',
          //   'returnStationId': 699,
          //   'returnStationSn': 'S4101000504',
          //   'returnStationName': '袁网点',
          //   'orderStatusCode': 'finished',
          //   'orderStatusName': '已完成',
          //   'userId': 10342,
          //   'userPhone': '15001073742',
          //   'userName': '乔乔'})
          // result.records = arr
          // this.allLoaded = false
          // test end
          this.page++
          this.orderList = this.orderList.concat(result.records)
          this.orderCount = result.totalElements
          this.loading = false
        })
        .catch(err => {
          this.loading = false
          this.allLoaded = true
        })
    },
    handleChangeRange(command) {
      console.log('====command====', command)
      this.searchByMonth = !command
      this.loadData()
    },
    handleShowDetail(item) {
      this.$callHandler('companyOrderDetail', {
        orderSn: item.sn
      })
    }
  }
}
</script>

<style lang="scss">
.order-list {
  .order-top {
    justify-content: space-between;
    margin-bottom: 2vw;
    margin-top: 3vw;
    padding: 0 3vw;
  }
  .order-main{
    padding: 0 3vw;
  }
  li {
    background: #ffffff;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.05);
    padding: 3vw;
    margin-bottom: 2.5vw;
  }
  .order-item {
    color: #7c7c7c;
    .car-number {
      font-size: px2vw(14);
      justify-content: space-between;
      color: #3d3d3d;
      margin-bottom: 2vw;
      img {
        width: px2vw(7);
      }
    }
    .order-info {
      margin-bottom: 1.5vw;
      font-size: px2vw(13);
      img {
        width: px2vw(13);
        margin-right: 2vw;
      }
      .order-money {
        margin-left: 24vw;
      }
    }
    .station-info {
      font-size: 13px;
      &.take-station {
        margin-bottom: 1.5vw;
      }
      img {
        width: px2vw(13);
        margin-right: 3vw;
      }
    }
  }
  .no-order {
    margin: 10vw 0;
  }
}
</style>
