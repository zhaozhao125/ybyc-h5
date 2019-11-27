<template>
  <div class="refund-reason position-relative height-100">
    <h2 class="fz-14">确定要退款吗？请选择您遇到的问题，以便我们更好的为您提供服务</h2>
    <div class="reasons">
      <mt-radio v-model="reasonValue" :options="options">
      </mt-radio>
      <textarea class="display-block fz-14 bg-white" cols="30" rows="5" placeholder="请在此输入您的意见" v-model="reasonText" v-show="otherVisible"></textarea>
    </div>
    <div class="next-step">
      <mt-button type="default" @click="handleClickNext">下一步</mt-button>
    </div>
  </div>

</template>

<script>
import { Radio } from 'mint-ui'
export default {
  name: 'refund-reason',

  components: {
    mtRadio: Radio
  },

  data() {
    return {
      options: [],
      checkedReasons: [],
      reasonValue: '',
      reasonText: '',
      otherVisible: false
    }
  },

  watch: {
    reasonValue() {
      if (this.reasonValue == 'other') {
        this.otherVisible = true
      } else {
        this.otherVisible = false
        this.reasonText = ''
      }
    }
  },
  methods: {
    handleClickNext() {
      if (!this.reasonValue) {
        this.$toast('请选择退款原因')
        return
      }
      if (this.reasonText) {
        this.checkedReasons.push({
          reason: 'other',
          reasonText: this.reasonText
        })
      } else {
        let self = this
        this.checkedReasons.push(
          this.options.find(function(obj) {
            return obj.value === self.reasonValue
          })
        )
      }
      let refundReasons = this.checkedReasons.map(item => {
        if (item.label) {
          return {
            reason: item.value,
            reasonText: item.label
          }
        }
        return item
      })
      this.$store.commit('setRefundReason', refundReasons)
      this.$router.push({
        name: 'refund'
      })
      this.checkedReasons = []
    }
  },

  created() {
    this.$service
      .getRefundReasons(this.$store.getters.user.id)
      .then(res => {
        this.options = res.data.data
          // .filter(item => item.reason != "other")
          .map(item => {
            return {
              label: item.reasonText,
              value: item.reason
            }
          })
      })
      .catch(e => {})
  }
}
</script>

<style lang="scss">
.refund-reason {
  padding: 5vw 0;
  min-height: 115vw;
  h2 {
    padding: 0 6vw;
    line-height: 1.5em;
  }
  .reasons {
    .mint-cell-wrapper {
      background: none;
      font-size: 3.7333vw;
    }
    .mint-cell:last-child {
      background: none;
    }
    .mint-checkbox-input:checked + .mint-checkbox-core {
      background-color: $color-yellow;
      border-color: $color-yellow;
    }
    .mint-checkbox-core {
      border-radius: 15%;
    }
    textarea {
      width: 93%;
      margin: 0 auto;
      resize: vertical;
      padding: 5px 15px;
      line-height: 1.5em;
      box-sizing: border-box;
      background-image: none;
      border: 1px solid $color-gray-light;
      border-radius: 4px;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      outline: none;
      -webkit-appearance: none;
    }
  }
  .next-step {
    width: 93%;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 3vw;
    margin: auto;
  }
}
</style>
