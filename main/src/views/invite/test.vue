<template>
  <div>
    <input ref="input" type="file" invoice="image/*;" capture="camera" @change="handleChange($event)">
    <img :src="imgSrc" alt="">
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgSrc: ''
    }
  },

  methods: {
    compress(res) {
      var img = new Image(),
        maxH = 160
      img.onload = function () {
        var cvs = document.createElement('canvas'),
          ctx = cvs.getContext('2d')
        if (img.height > maxH) {
          img.width *= maxH / img.height
          img.height = maxH
        }
        cvs.width = img.width
        cvs.height = img.height
        ctx.clearRect(0, 0, cvs.width, cvs.height)
        ctx.drawImage(img, 0, 0, img.width, img.height)
        this.imgSrc = cvs.toDataURL('image/jpeg', 0.6)
        // 上传略
      }
      img.src = res
    },
    handleChange(e) {
      console.log(e)
      console.dir(this.$refs.input)
      var reader = new FileReader()
      reader.onload = function (e) {
        compress(this.result)
      }
      reader.readAsDataURL(document.querySelector('input').files[0])
    }
  }
}
</script>

<style lang="scss">
</style>
