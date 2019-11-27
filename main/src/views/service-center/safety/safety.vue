<template>
  <div class="safety-page">
    <div class="safety-item" v-for="item in safetyData">
      <div class="safety-title">
        <h3>{{item.title}}</h3>
      </div>
      <p>{{item.dec}}</p>
      <img :src=imageUrl(item.imgName)>
    </div>
  </div>
</template>

<script>
export default {
  name: 'safety',

  data() {
    return {
      safetyData: [
        {
          title: '一重奏 - 车辆',
          imgName: 'use_car_safe_1.jpg',
          dec: '取到车辆后，及时检查车辆状况，如有问题在问题反馈里面拍照上传。'
        },
        {
          title: '二重奏 - 轮胎',
          imgName: 'use_car_safe_2.jpg',
          dec: '查看轮胎是否有明显气不足或存在裂痕。'
        },
        {
          title: '三重奏 - 充电桩移除',
          imgName: 'use_car_safe_3.jpg',
          dec: '检查车辆充电枪是否移除，如未移除请拔掉枪后用车。'
        },
        {
          title: '四重奏 - 制动系统',
          imgName: 'use_car_safe_4.jpg',
          dec: '车辆启动后，缓踩刹车，检查制动系统是否正常。'
        }
      ]
    }
  },
  methods: {
    imageUrl(imgName) {
      return imgName
        ? require('@/views/service-center/safety/img/' + imgName)
        : ''
    }
  }
}
</script>

<style lang="scss">
.safety-page {
  width: 100%;
  background-color: #ffffff;
  padding: 0 6.4vw;
  .safety-item {
    display: flex;
    flex-direction: column;
    margin-top: 4.53333vw;
    .safety-title {
      border-left: 1.06667vw solid #fdd000;
      line-height: 6.4vw;
      h3 {
        margin-left: 2.66667vw;
        font-size: 3.73333vw;
        font-weight: bold;
      }
    }
    p {
      margin: 4.8vw 0;
      font-size: 3.2vw;
      color: $color-dark;
    }
    img {
      width: 100%;
    }
  }
}
</style>
