<template>
  <div id="detail">
    <div v-for="(item ,index) in arr" :key="index">
      <div class="item">
        <span>金额</span>
        <span :class="[ item.actionIncDecType==='INC' ?  'bill-right-yellow' : 'bill-right-black']" class="money">
          {{item.actionIncDecType==='INC' ? `+${item.amount}` : `${item.amount}`}}元
        </span>
      </div>
      <div class="item every">
        <span class="font-space">状 态</span>
        <!-- <span>{{item.success ? '成功' : '失败' }}</span> -->
        <span v-if="item.success&&item.actionCode==='userRefudns'">申请成功</span>
        <span v-else-if="item.success">成功</span>
        <span v-else>失败</span>
      </div>
      <div class="item every">
        <span>操作类型</span>
        <span>{{item.actionCodeText}}</span>
      </div>
      <div class="item every">
        <span class="font-space">时 间</span>
        <span>{{item.addTime}}</span>
      </div>
      <div class="item every">
        <span class="font-space-2">流 水 号</span>
        <span class="no-break">{{item.accountRecordSn}}</span>
      </div>
      <div class="item every">
        <span class="font-space">备 注</span>
        <span v-if="item.remark!=null">{{item.remark}}</span>
      </div>
    </div>
  </div>
  <!-- 内容结束 -->
</template>
<script>
import { MessageBox } from 'mint-ui'
const ERR_OK = 'ok'
export default {
  name: 'Detail',
  data() {
    return {
      arr: []
    }
  },
  mounted() {
    this.request()
  },
  methods: {
    request() {
      this.$service
        .getExpenseDetail(this.$route.query.userId, this.$route.query.id)
        .then(res => {
          if (res.data.errMsg === ERR_OK) {
            let obj = res.data.data
            this.arr.push(obj)
          } else {
            let errMsg = res.data.errMsg || '请求错误'
            MessageBox('提示', errMsg)
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>
<style lang="scss" scoped="">
$border-1px: 1px;
#detail {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding-bottom: 4.78vw;
  border-bottom: $border-1px solid #e7e7e7;
  > div {
    width: 94.6667%;
    margin: 0 auto;
  }
  .item {
    font-size: 3.9vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #999999;
    padding: 0 1.8667vw 0 1.8667vw;
    word-break: keep-all;
    white-space: nowrap;
    &:first-child {
      height: 20.533vw;
      border-bottom: $border-1px solid #e7e7e7;
      padding: 0 1.8667vw 0 1.8667vw;
      text-align: center;
      line-height: 20.533vw;
      font-size: 5.8666667vw;
    }
    span {
      &:last-child {
        color: #3d3d3d;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .no-break {
      width: 70vw;
      text-align: right;
    }
    .money {
      font-size: 5.8666667vw !important;
      font-weight: 600;
    }
    .bill-right-yellow {
      color: #fdd000 !important;
    }
    .bill-right-black {
      color: #3d3d3d !important;
    } // 字体间距
    .font-space {
      letter-spacing: 3.42vw;
    }
    .font-space-2 {
      letter-spacing: 0.5vw;
      word-break: keep-all;
      white-space: nowrap;
    }
  }
  .every {
    margin: 4.78vw 0 0 0;
  }
}
</style>
