<template>
  <div class="violation-upload flex-col pd-4">
    <!-- <input type="file"> -->
    <h3 class="fz-18 mb-3">上传凭证（1张）</h3>
    <v-upload accept="image/*"
              :on-start="handleUploadStart"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"></v-upload>
    <textarea placeholder="请输入备注信息，有助于凭证核实"
              v-model="remark"
              class="width-100 border-none pd-3 mt-3 fz-13"></textarea>
    <div class="button-container flex-row">
      <mt-button plain
                 @click="handleCancel">取消</mt-button>
      <mt-button :disabled="uploading || !voucherImage"
                 @click="handleSubmit">确定</mt-button>
    </div>
  </div>
</template>

<script>
import vUpload from '@/components/upload/'

export default {
  components: {
    vUpload
  },

  data() {
    return {
      uploading: false,
      voucherImage: '',
      remark: ''
    }
  },

  mounted() {},

  methods: {
    handleUploadStart(e) {
      this.uploading = true
    },
    handleUploadSuccess(e) {
      this.voucherImage = e.url
      this.uploading = false
    },
    handleUploadError() {
      this.$toast('照片上传失败，请检查网络稍后重试')
      this.uploading = false
    },
    backToList() {
      if (
        this.$router.pathStack.some(
          item => item.name == 'violationToBeProcessed'
        )
      ) {
        this.$router.go(-2)
      } else {
        this.$router.go(-1)
        setTimeout(() => {
          this.$router.replace({
            name: 'violationToBeProcessed'
          })
        }, 100)
      }
    },
    handleSubmit() {
      const violationID = this.$route.query.id
      this.$service
        .submitViolationVoucher(violationID, this.voucherImage, this.remark)
        .then(res => {
          this.$toast('提交成功')
          this.backToList()
        })
        .catch(err => {
          if (err.errCode == 910100) {
            this.$router.go(-1)
          }
        })
    },
    handleCancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss">
.violation-upload {
  textarea {
    width: 100%;
    background-color: #fafafa;
    border-radius: px2vw(4);
    -webkit-appearance: none;
    height: px2vw(122);
    box-sizing: border-box;
  }
  .button-container {
    margin-top: auto;
    button {
      flex: 0 50%;
    }
    button:nth-of-type(even) {
      margin-left: 4vw;
    }
  }
}
</style>
