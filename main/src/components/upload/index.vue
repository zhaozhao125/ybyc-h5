<template>
  <div class="file-upload width-100">
    <div class="file-upload--trigger needsclick"
         @click="handleClick">
      <slot name="default"
            v-if="$slots.default"></slot>
      <div class="upload-container position-relative needsclick overflow-hidden">
        <div class="upload-camera position-absolute position-center needsclick zindex-99">
          <img src="./img/icon-camera.png"
               alt=""
               class="width-100 needsclick"
               v-if="!uploading">
          <mt-spinner type="snake"
                      v-else></mt-spinner>
        </div>
        <img :src="currentImgURL"
             alt=""
             class="current-upload-img needsclick"
             v-if="currentImgURL">
        <div class="upload-progress position-absolute width-100 height-100 bg-mask top-0"
             :style="`height:${100-progress}%`"
             v-show="uploading"></div>
      </div>
    </div>
    <input type="file"
           name="file"
           ref="fileInput"
           :accept="accept"
           :multiple="multiple"
           @change="handleFileChange">
    <!-- <div class="file-upload--progress"
         v-show="progress>0&&progress<100">
      <div class="file-upload--progressbar"
           :style="`width:${progress}%`">
      </div>
    </div> -->
  </div>
</template>

<script>
import ajaxUpload from './ajax-upload.js'
import getToken from './get-token.js'
import imgCompress from './img-compress.js'
import Exif from 'exif-js'

const UP_URL = 'http://upload.qiniup.com/'
const DOWN_URL = 'http://static1.1byongche.com/'

async function getImgOrientation(imgFile) {
  return new Promise((resolve, reject) => {
    Exif.getData(imgFile, function() {
      let orientation = Exif.getTag(this, 'Orientation')
      resolve(orientation)
    })
  })
}

export default {
  props: {
    action: {
      type: String,
      default: UP_URL
    },
    name: {
      type: String,
      default: 'file'
    },
    headers: Object,
    withCredentials: Boolean,
    multiple: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: 'image/*'
    },
    onStart: {
      type: Function,
      default: function() {}
    },
    onProgress: {
      type: Function,
      default: function() {}
    },
    onSuccess: {
      type: Function,
      default: function() {}
    },
    onError: {
      type: Function,
      default: function() {}
    },
    beforeUpload: {
      type: Function,
      default: function() {}
    },
    onPreview: {
      type: Function,
      default: function() {}
    },
    onRemove: {
      type: Function,
      default: function() {}
    },
    fileList: Array,
    autoUpload: {
      type: Boolean,
      default: true
    },
    disabled: Boolean,
    limit: Number,
    onExceed: Function
  },

  data() {
    return {
      token: null,
      data: null,
      tmpIndex: 1,
      reqs: {},
      progress: 0,
      currentImgURL: null,
      uploading: false
    }
  },

  mounted() {
    if (this.$slots.default) {
      this.$slots.default.forEach(item => {
        item.elm.classList.add('needsclick')
      })
    }
  },

  methods: {
    handleClick(e) {
      if (!this.disabled && !this.uploading) {
        this.$refs.fileInput.value = null
        this.$refs.fileInput.click()
      }
    },

    handleFileChange(e) {
      const files = e.target.files

      if (!files) return
      this.uploadFiles(files)
    },
    async uploadFiles(files) {
      if (this.limit && this.fileList.length + files.length > this.limit) {
        this.onExceed && this.onExceed(files, this.fileList)
        return
      }

      let postFiles = Array.prototype.slice.call(files)
      if (!this.multiple) {
        postFiles = postFiles.slice(0, 1)
      }

      if (postFiles.length === 0) {
        return
      }

      this.token = await getToken()

      postFiles.forEach(rawFile => {
        if (this.onStart) {
          this.onStart(rawFile)
        }

        if (this.autoUpload) this.upload(rawFile)
      })
    },
    upload(rawFile, file) {
      this.$refs.fileInput.value = null

      if (!this.beforeUpload) {
        return this.post(rawFile)
      }

      const before = this.beforeUpload(rawFile)
      if (before && before.then) {
        before.then(
          processedFile => {
            const fileType = Object.prototype.toString.call(processedFile)
            if (fileType === '[object File]' || fileType === '[object Blob]') {
              this.post(processedFile)
            } else {
              this.post(rawFile)
            }
          },
          () => {
            this.onRemove(null, rawFile)
          }
        )
      } else if (before !== false) {
        this.post(rawFile)
      } else {
        this.onRemove(null, rawFile)
      }
    },
    abort(file) {
      const { reqs } = this
      if (file) {
        let uid = file
        if (file.uid) uid = file.uid
        if (reqs[uid]) {
          reqs[uid].abort()
        }
      } else {
        Object.keys(reqs).forEach(uid => {
          if (reqs[uid]) reqs[uid].abort()
          delete reqs[uid]
        })
      }
    },
    async post(rawFile) {
      const uid = Date.now() + '' + this.tmpIndex++
      this.data = {
        token: this.token
      }
      this.uploading = true
      try {
        let orientation = await getImgOrientation(rawFile)
        // quality 表示图片压缩质量0.8-1
        // maxWidth 表示分辨率大于1920的图片缩放到1920宽
        // orientation ios拍摄图片EXIF信息中含有orientation值，
        // canvas drawImage时会自动旋转，需要手动旋转图片使之生成正常的视角
        // https://recallhyx.github.io/2018/06/22/%E8%A7%A3%E5%86%B3iPhone%E6%8B%8D%E7%85%A7%E6%97%8B%E8%BD%AC/
        rawFile = await imgCompress.compress(rawFile, {
          quality: 0.9,
          maxWidth: 1920,
          orientation
        })
      } catch (err) {
        console.log('====img compress err====', err)
      }
      this.currentImgURL = URL.createObjectURL(rawFile)
      const options = {
        headers: this.headers,
        withCredentials: this.withCredentials,
        file: rawFile,
        data: this.data,
        filename: this.name,
        action: this.action,
        onProgress: e => {
          this.progress = e.percent
          this.onProgress(e, rawFile)
        },
        onSuccess: res => {
          res.url = DOWN_URL + res.key
          this.onSuccess(res, rawFile)
          delete this.reqs[uid]
          this.uploading = false
        },
        onError: err => {
          this.onError(err, rawFile)
          delete this.reqs[uid]
          this.uploading = false
        }
      }
      const req = ajaxUpload(options)
      this.reqs[uid] = req
      if (req && req.then) {
        req.then(options.onSuccess, options.onError)
      }
    }
  }
}
</script>

<style lang="scss">
.file-upload {
  .upload-container {
    width: px2vw(85);
    height: px2vw(85);
    background-color: rgb(250, 250, 250);
    border: 1px solid $color-gray-white;
    border-radius: 2vw;
    .upload-camera {
      width: px2vw(26);
      height: px2vw(26);
    }
    .current-upload-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  input {
    display: none;
  }
  .file-upload--progress {
    width: 100%;
    height: 1vw;
    background-color: #eee;
    margin: 2vw 0;
    .file-upload--progressbar {
      background-color: $color-yellow;
      width: 0;
      height: 100%;
      transition: width 0.1s;
    }
  }
}
</style>
