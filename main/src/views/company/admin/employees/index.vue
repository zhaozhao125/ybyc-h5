<template>
  <div class="company-employees flex-col bg-light">
    <div class="page-infinite-wrapper flex-1 overflow-auto">
      <ul class="employee-list bg-white" v-infinite-scroll="loadMore" infinite-scroll-disabled="infiniteScrollDisabled" infinite-scroll-distance="10">
        <li v-for="(item, index) in employeeList" :key="index" @click="handleShowDetail(item.companyStaffId, item.userId)">
          <div class="employee-name fz-17">
            <span v-if="item.checkDataStatus==1">{{item.userName || '未知姓名'}}</span>
            <span v-else>未实名认证</span>
            <span v-if="item.companyRole!='general'">（管理员）</span>
          </div>
          <div class="employee-phone fz-14">
            {{item.userPhone}}
          </div>
        </li>
      </ul>
      <div class="no-more fz-14 bg-white text-center" v-if="allLoaded">没有更多记录</div>
      <div class="common-loading" v-show="loading">
        <mt-spinner type="snake"></mt-spinner>
      </div>
    </div>
    <mt-button type="default" class="rounded-0" @click="handleCreateEmployess">添加员工</mt-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      employeeList: [],
      loading: false,
      allLoaded: false,
      page: 1
    }
  },

  computed: {
    infiniteScrollDisabled() {
      return this.loading || this.allLoaded
    }
  },

  created() {
    this.companySn = this.$store.getters.companySn
  },

  methods: {
    loadMore() {
      this.loading = true
      if (this.companySn) {
        this.$service.getEmployeeList(this.page, this.companySn).then(res => {
          console.log('====res====', res)
          let result = res.data.data
          if (result.totalPages <= this.page) {
            this.allLoaded = true
          }
          this.page++
          this.employeeList = this.employeeList.concat(result.records)
          this.loading = false
        }).catch(err => {
          this.loading = false
        })
      } else {
        this.$toast('没有企业编号')
        this.loading = false
      }
    },
    handleShowDetail(employeeId, userId) {
      this.$router.push({
        name: 'company-employee-detail',
        query: {
          employeeId: employeeId,
          userId: userId
        }
      })
    },
    handleCreateEmployess() {
      this.$router.push({
        name: 'employee-create'
      })
    }
  }
}
</script>

<style lang="scss">
.company-employees {
  .employee-list {
    li {
      padding: 3vw 5vw;
      border-bottom: 1px solid #e5e5e5;
    }
    .employee-name {
      margin-bottom: 1vw;
    }
    .employee-phone {
      color: #7c7c7c;
    }
  }
  .no-more {
    color: #7c7c7c;
    line-height: 12vw;
  }
}
</style>
