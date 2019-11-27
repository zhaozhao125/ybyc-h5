<template>
  <div class="invite-record">
    <div class="invite-reward">
      <h2 class="title-with-line">
        <span>已获得奖励</span>
      </h2>
      <p class="color-dark text-center">
        <strong>{{totalReward}}</strong>元
      </p>
    </div>
    <div class="invite-navbar">
      <mt-navbar v-model="navSelected">
        <mt-tab-item id="1">已注册 ({{registeredCount}})</mt-tab-item>
        <mt-tab-item id="2">已认证 ({{verifiedCount}})</mt-tab-item>
        <mt-tab-item id="3">首次用车 ({{firstOrderCount}})</mt-tab-item>
      </mt-navbar>

      <!-- tab-container -->
      <mt-tab-container v-model="navSelected">
        <mt-tab-container-item id="1">
          <ul class="invite-list" :class="{'blank-list':!registeredUserList.length}">
            <li v-for="(item, index) in registeredUserList" :key="index">
              <div class="invite-list-item">
                <div class="invite-user-info">
                  <p>
                    <strong>{{item.invitee_username | phoneFilter}}</strong>
                  </p>
                  <p>{{item.business_datetime}}</p>
                </div>
              </div>
            </li>
          </ul>
          <p class="invite-tip fz-14 text-center">{{nav1Msg}}</p>
        </mt-tab-container-item>
        <mt-tab-container-item id="2">
          <ul class="invite-list" :class="{'blank-list':!verifiedUserList.length}">
            <li v-for="(item, index) in verifiedUserList" :key="index">
              <div class="invite-list-item">
                <div class="invite-user-info">
                  <p>
                    <strong>{{item.invitee_username}}</strong>
                  </p>
                  <p>{{item.business_datetime}}</p>
                </div>
                <div class="invite-reward-money fz-14 flex-col justify-content-center">
                  +{{item.coupon_amount}}元({{item.reward_type | rewardTypeFilter}})
                </div>
              </div>
            </li>
          </ul>
          <p class="invite-tip fz-14 text-center">{{nav2Msg}}</p>
        </mt-tab-container-item>
        <mt-tab-container-item id="3">
          <ul class="invite-list" :class="{'blank-list':!firstOrderUserList.length}">
            <li v-for="(item, index) in firstOrderUserList" :key="index">
              <div class="invite-list-item">
                <div class="invite-user-info">
                  <p>
                    <strong>{{item.invitee_username}}</strong>
                  </p>
                  <p>{{item.business_datetime}}</p>
                </div>
                <div class="invite-reward-money fz-14 flex-col justify-content-center">
                  +{{item.coupon_amount}}元({{item.reward_type | rewardTypeFilter}})
                </div>
              </div>
            </li>
          </ul>
          <p class="invite-tip fz-14 text-center">{{nav3Msg}}</p>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
  </div>
</template>
<script>
import { Navbar, TabItem, TabContainer, TabContainerItem } from 'mint-ui'
export default {
  name: 'record',

  components: {
    mtNavbar: Navbar,
    mtTabItem: TabItem,
    mtTabContainer: TabContainer,
    mtTabContainerItem: TabContainerItem
  },

  data() {
    return {
      totalReward: 50,
      registeredUserList: [],
      registeredCount: '-',
      verifiedUserList: [],
      verifiedCount: '-',
      firstOrderUserList: [],
      firstOrderCount: '-',
      navSelected: '1',
      nav1Msg: '',
      nav2Msg: '',
      nav3Msg: ''
    }
  },

  filters: {
    phoneFilter(phone) {
      return phone.substr(0, 3) + '****' + phone.substr(-4, 4)
    },
    rewardTypeFilter(val) {
      if (val == 'redPacket') {
        return '红包'
      }
      return '优惠券'
    }
  },

  created() {
    let inviteData = this.$store.getters.inviteData
    if (!inviteData) {
      return
    }
    this.totalReward = inviteData.total
    this.registeredUserList = inviteData.coachNewUser.list
    this.registeredCount = inviteData.coachNewUser.total
    this.nav1Msg = inviteData.coachNewUser.msg
    this.verifiedUserList = inviteData.coachCompleteAudit.list
    this.verifiedCount = inviteData.coachCompleteAudit.total
    this.nav2Msg = inviteData.coachCompleteAudit.msg
    this.firstOrderUserList = inviteData.coachCompleteFirstOrder.list
    this.firstOrderCount = inviteData.coachCompleteFirstOrder.total
    this.nav3Msg = inviteData.coachCompleteFirstOrder.msg

    window.sa.track('invitationOpenDetails')
  },

  mounted() {}
}
</script>
<style lang="scss">
.invite-record {
  padding: 1vw 0;
  .invite-reward {
    padding: 4vw;
    box-shadow: 0 5px 12px 0 rgba(217, 226, 233, 0.5);
    p {
      font-size: 3.6vw;
      margin: 6vw 0 2vw;
      letter-spacing: 0.5vw;
      strong {
        font-size: 10vw;
      }
    }
  }
  .invite-navbar {
    width: 90%;
    margin: 6vw auto;
    .invite-list {
      margin-top: 3vw;
      padding: 0 3vw;
      &.blank-list {
        margin-bottom: 20vw;
      }
      .invite-list-item {
        display: flex;
        flex-direction: row;
        padding: 4vw 0;
        border-bottom: 1px solid $color-gray-border;
        .invite-user-info {
          p {
            font-size: 3vw;
            strong {
              color: $color-dark;
              font-size: 4vw;
              font-weight: normal;
            }
          }
        }
        .invite-reward-money {
          margin-left: auto;
        }
      }
    }
    .invite-tip {
      margin-top: 5vw;
    }
  }
}
</style>
