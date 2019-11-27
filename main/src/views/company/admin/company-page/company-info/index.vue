<template>
  <div id="company-info">
    <div class="company-info-content">
      <div class="company-info-item " :class="[{'is-add-line':!item.isAddLine}]" v-for="(item,index) in companyInfoArr" :key="index">
        <span>{{item.name}}</span>
        <span>{{item.content}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    let companyInfo = this.$route.params.companyInfo
    return {
      companyInfoArr: [
        {
          name: '企业名称',
          content: companyInfo.name
        },
        {
          name: '城市',
          content: companyInfo.cityName
        },
        {
          name: '联系电话',
          content: companyInfo.phone
        },
        {
          name: '紧急联系人',
          content: companyInfo.emergencyContactName
        },
        {
          name: '紧急联系人电话',
          content: companyInfo.emergencyContactPhone
        },
        {
          name: '员工应交保证金金额',
          content: companyInfo.timeShareRentDeposit + '元',
          isAddLine: true
        }
      ]
    }
  },
  mounted() {
    console.log(this.$route.params.companyInfo, '企业信息参数')
  }
}
</script>

<style lang="scss">
#company-info {
  @function vw($px) {
    @return px2vw($px);
  }
  width: 100%;
  height: 100%;
  .company-info-content {
    width: vw(355);
    margin: 0 auto;
    margin-top: vw(10);
    background: #ffffff;
    box-shadow: 0 0 vw(6) 0 #efefef;
    border-radius: vw(2);
    .company-info-item {
      height: vw(65);
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: vw(15);
      > span {
        &:first-child {
          font-size: vw(12);
          color: #c0c0c0;
          padding-bottom: vw(2);
        }
        &:last-child {
          font-size: vw(16);
          color: #3d3d3d;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .is-add-line {
      position: relative;
      &::after {
        position: absolute;
        bottom: 0;
        content: '';
        display: block;
        width: vw(325);
        height: 1px;
        background: #efefef;
      }
    }
  }
}
</style>
