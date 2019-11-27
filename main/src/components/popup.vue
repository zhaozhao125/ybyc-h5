<template>
  <div class="popup-wrapper position-fixed top-0 left-0 width-100 height-100 zindex-99 bg-mask display-flex justify-content-center align-items-center" v-if="popupVisible">
    <div class="popup">
      <div class="popup-header text-center" v-if="title">
        <p class="fz-12" v-if="smallTitle">{{smallTitle}}</p>
        <h2 class="fz-20" v-if="title">{{title}}</h2>
      </div>
      <div class="popup-content">
        <h3 class="fz-12">{{contentTitle}}</h3>
        <ul class="popup-radio">
          <li class="" v-for="(option, index) in options" :key="index">
            <label class="popup-radiolist-label" v-if="!option.hidden">
              <span class="popup-radio">
                <input class="popup-radio-input" type="radio" v-model="selectedVal" :disabled="option.disabled" :value="option.value || option">
                <span class="popup-radio-core"></span>
              </span>
              <span class="popup-radio-label" v-html="option.label || option"></span>
              <p class="popup-radio-text" v-if="option.text">{{option.text}}</p>
            </label>
          </li>
        </ul>
      </div>
      <div class="popup-footer">
        <slot name="footer">
          <button class="popup-btn-cancel" @click="handleClickCancel">取消</button>
          <button class="popup-btn-confirm" @click="handleClickConfirm">确定</button>
        </slot>
      </div>
    </div>
  </div>

</template>

<script>
export default {

  name: 'popup',

  props: {
    value: {
      type: Boolean,
      default: false
    },
    smallTitle: {
      type: String,
      default: '退款金额'
    },
    title: {
      type: String,
      default: '200元'
    },
    contentTitle: {
      type: String,
      default: '请选择退款方式'
    },
    options: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data() {
    return {
      popupVisible: this.value,
      selectedVal: (() => {
        let ret
        this.options.forEach(item => {
          if (item.default) {
            ret = item.value
          }
        })
        return ret
      })()
    }
  },
  methods: {
    handleClickCancel() {
      this.popupVisible = false
      this.$emit('cancel')
    },
    handleClickConfirm() {
      this.popupVisible = false
      this.$emit('confirm', this.selectedVal)
    }
  },

  created() { },

  watch: {
    value(val) {
      this.popupVisible = val
    },
    popupVisible(val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="scss">
.popup-wrapper {
  .popup {
    width: 72%;
    min-width: 265px;
    background-color: rgba(252, 252, 252, 0.95);
    border-radius: 12px;
    .popup-header {
      padding: 12px 0px 0px;
      border-bottom: 1px solid #dddddd;
      h2 {
        margin: 5px auto 7px;
      }
    }
    .popup-content {
      min-height: 36px;
      position: relative;
      padding: 15px 15px 5px;
      border-bottom: 1px solid rgb(221, 221, 221);
      h3 {
        padding-left: 22px;
        padding-bottom: 5px;
      }
    }
    .popup-footer {
      display: flex;
      height: 40px;
      line-height: 40px;
      button {
        line-height: 35px;
        display: block;
        background-color: transparent;
        flex: 1 1 0%;
        margin: 0px;
        font-size: 14px;
        border-width: 0px;
        border-style: initial;
        border-color: initial;
        border-image: initial;
      }
      .popup-btn-cancel {
        width: 50%;
        border-right: 1px solid rgb(221, 221, 221);
      }
      .popup-btn-confirm {
        color: $color-popup-blue;
        width: 50%;
      }
    }
  }
  .popup-radio {
    li {
      font-size: 14px;
      line-height: 1;
      overflow: hidden;
      padding: 0 5px;
      min-height: 30px;
      margin-bottom: 15px;
    }
    .popup-radiolist-label {
      display: block;
      flex: 1;
    }
    .popup-radio-label {
      vertical-align: middle;
      margin-left: 4px;
      font-size: 14px;
      strong {
        font-weight: bold;
      }
    }
    .popup-radio {
      &.is-right {
        float: right;
      }
      .popup-radio-input {
        display: none;
        &:checked {
          + .popup-radio-core {
            background-color: $color-popup-blue;
            border: none;
          }
        }
        &[disabled] + .popup-radio-core {
          background-color: $color-popup-gray;
          border-color: $color-popup-gray;
        }
      }
      .popup-radio-core {
        box-sizing: border-box;
        display: inline-block;
        background-color: $color-white;
        border-radius: 100%;
        border: 1px solid #ccc;
        position: relative;
        width: 10px;
        height: 10px;
        vertical-align: middle;
        transition: background 0.1s ease-out;
      }
    }
    .popup-radio-text {
      margin-left: 18px;
      margin-top: 8px;
    }
  }
}
</style>
