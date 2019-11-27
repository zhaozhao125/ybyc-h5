<template>
  <div class="feedback-page">
    <textarea id="feedback_textarea" class="feedback-textarea" placeholder="请留下你的反馈与建议" maxlength="150">
    </textarea>
    <mt-button class="feedback-btn" type="default" @click="handleSubmitFeedback">提交</mt-button>
  </div>
</template>

<script>
import { Button } from 'mint-ui'

export default {
  name: 'feedback',

  data() {
    return {}
  },
  methods: {
    handleSubmitFeedback() {
      let contentVal = document.getElementById('feedback_textarea').value
      if (contentVal) {
        console.log(contentVal)
        this.$service
          .submitFeedback(contentVal)
          .then(res => {
            if (res.data.errCode === -1) {
              this.$toast({
                message: res.data.errMsg
              })
            } else {
              this.$toast({
                message: '谢谢您反馈的意见，我们将会及时跟进并改进。'
              })
              document.getElementById('feedback_textarea').value = ''
              this.$router.go(-1)
              // 反馈建议-神策埋点
              window.sa.track('serviceCenterSendSuggestion', {
                label: value
              })
            }
          })
          .catch(e => {
            console.log(e)
          })
      }
    }
  }
}
</script>

<style lang="scss">
.feedback-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f0f0;
  padding: 0 2.3%;
  .feedback-textarea {
    padding: 2vw;
    width: 94.8%;
    height: 48vw;
    resize: none;
    border: none;
    outline: none;
    border-radius: 0.5vw;
    margin: 5.33333vw 2.66667vw 19.73333vw;
    color: $color-text;
    font-size: 4.26667vw;
    background-color: $color-bg;
  }
  .feedback-btn {
    width: 94.8%;
    font-size: 4.8vw;
  }
}
</style>
