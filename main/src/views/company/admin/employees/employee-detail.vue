<template>
  <div class="company-employee-detail flex-col bg-light">
    <div class="employee-info flex-row align-items-center bg-white justify-content-between">
      <div class="info flex-1">
        <div class="employee-name fz-17">{{userName}}
          <span v-if="isAdmin">（管理员）</span>
        </div>
        <div class="employee-phone fz-14">
          {{userPhone}}
        </div>
      </div>
      <mt-button type="default" plain size="small" class="inline-btn remove-btn" @click="handleRemove">移出员工</mt-button>
    </div>
    <order-list class="fz-14" :params="orderParams"></order-list>
  </div>
</template>

<script>
import orderList from '@/components/order-list/'
export default {
  components: {
    orderList
  },

  data() {
    return {
      employeeInfo: null,
      userName: '-',
      userPhone: '-',
      isAdmin: false,
      employeeId: '',
      orderList: [],
      orderParams: null
    }
  },

  created() {
    this.employeeId = this.$route.query.employeeId
    this.orderParams = {
      employeeId: this.employeeId,
      userId: this.$route.query.userId
    }
    this.$service.getEmployeeDetail(this.employeeId).then(res => {
      let result = res.data.data
      this.employeeInfo = result.userDTO
      this.userName = this.employeeInfo.userName || '未实名认证'
      this.userPhone = this.employeeInfo.userPhone
      this.isAdmin = result.role === 'manager'
    })
  },

  methods: {
    handleRemove() {
      // this.$message.alert('正在进行支付...')
      // return
      this.$message({
        title: '确定将该员工移出企业吗？',
        message: '该员工将不再享用本企业用车资格，历史订单记录仍将保留',
        showCancelButton: true
      }).then(action => {
        console.log('====action====', action)
        if (action == 'confirm') {
          this.$service.removeEmployee(this.employeeId).then(res => {
            console.log('====res====', res)
            this.$toast('移除成功')
          })
          this.$router.go(-1)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.company-employee-detail {
  .employee-info {
    border-bottom: 1px solid #e5e5e5;
    .info {
      padding: 3vw 5vw;
      .employee-name {
        margin-bottom: 1vw;
      }
      .employee-phone {
        color: #7c7c7c;
      }
    }
    .remove-btn {
      margin-right: 3vw;
    }
  }
  .order-container {
    color: #888;
  }
}
</style>
