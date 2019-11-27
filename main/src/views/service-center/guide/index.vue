<template>
  <div class="guide-index">
    <cell-item title='用车安全四重奏' fontBlod @jumpPage='jumpSafety'></cell-item>
    <div class="car-model-guide">
      <ul class="car-list" @click="routeTo">
        <li v-for="(item, index) in imgList" :key="index">
          <a @click.prevent.stop="routeTo('model',item.imgName)">
            <img :src=imageUrl(item.imgName) :alt="item.dec">
            <span>{{item.dec}}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import cellItem from '@/components/cell/cell'

export default {
  name: 'guide-index',

  components: {
    cellItem
  },

  data() {
    return {
      imgList: [
        {
          imgName: 'zd1.png',
          dec: '知豆D1'
        },
        {
          imgName: 'd2s.png',
          dec: '知豆D2S'
        },
        {
          imgName: 'd2lx.png',
          dec: '知豆D2乐享'
        },
        {
          imgName: 'd2zx.png',
          dec: '知豆D2智享'
        },
        {
          imgName: 'hm2017.png',
          dec: '海马爱尚EV'
        },
        {
          imgName: 'hm2017_white.png',
          dec: '海马爱尚EV（白）'
        },
        {
          imgName: 'jh_iev4.png',
          dec: '江淮IEV4'
        }
      ]
    }
  },
  methods: {
    jumpSafety() {
      this.$router.push({
        name: 'serviceSafety'
      })
    },
    imageUrl(imgName) {
      return imgName
        ? require('@/views/service-center/guide/img/' + imgName)
        : ''
    },
    routeTo(path, imgName) {
      // console.log(path,imgName);
      this.$router.push({
        path: path,
        query: {
          carModel: imgName.substring(0, imgName.length - 4)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.guide-index {
  width: 100%;
  background-color: #f0f0f0;
  .car-model-guide {
    margin-top: 2.66667vw;
    .car-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      > li {
        background-color: #ffffff;

        // width: 49.86667vw;
        width: 49.86%;
        height: 34.66667vw;
        margin-bottom: 1px;
        display: flex;
        justify-content: center;
        align-items: center;
        a {
          text-decoration: none;
          > img {
            width: 26.66667vw;
            height: 16.53333vw;
            display: block;
          }
          > span {
            display: block;
            text-align: center;
            font-size: 3.73333vw;
            color: #3d3d3d;
            margin-top: 2.13333vw;
          }
        }
      }
    }
  }
}
</style>
