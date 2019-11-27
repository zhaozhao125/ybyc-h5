<template>
  <div class="point-mall bg-light">
    <div class="point-balance flex-row justify-content-center align-items-center">
      <div class="color-white fz-36">{{userPoints}}</div>
      <img src="./img/coin.png" alt="">
    </div>
    <div class="exchange-list bg-white flex-row">
      <div class="exchange-item" v-for="(item, index) in goodsList" :key="index">
        <!-- <div class="item-info">
          <div class="exchange-coupon fz-13">
            <strong class="fz-36 font-weight-normal">{{item.price}}</strong>元
          </div>
        </div> -->
        <img class="item-img" :src="item.img" alt="">
        <h4 class="fz-13 text-overflow-hidden">{{item.name}}</h4>
        <p class="fz-12 color-gray">{{item.description}}</p>
        <div class="item-bottom flex-row justify-content-between align-items-center">
          <div class="price fz-12 color-gray">
            <strong class="fz-20 color-dark">{{item.price}}</strong>积分
          </div>
          <button class="exchange-btn plain-button bg-white fz-13" v-if="item.canExchange" @click="handleExchange(item)">兑换</button>
          <button class="exchange-btn plain-button bg-white fz-13" disabled v-else>积分不足</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userPoints: '-',
      goodsList: []
    }
  },

  created() {
    this.getPointMallGoods()
  },

  mounted() {
    this.$track('h5UserPointsMallPageOpen')
  },

  methods: {
    getPointMallGoods() {
      this.$service.getPointMallGoods().then(res => {
        console.log('====res====', res)
        this.userPoints = res.data.data.userScore
        this.goodsList = res.data.data.commodityList
      })
    },
    handleExchange(item) {
      this.$message.confirm('确认要兑换吗？').then(() => {
        this.$service.pointExchange(item.id).then(res => {
          this.getPointMallGoods()
          this.$message({
            title: '提示',
            message: '兑换成功',
            showCancelButton: true,
            confirmButtonText: '去使用',
            confirmButtonHighlight: true,
            cancelButtonText: '查看记录'
          }).then(cmd => {
            console.log('====cmd====', cmd)
            if (cmd == 'confirm') {
              // 去使用
              this.$callHandler('backToHome')
            } else {
              // 查看记录
              this.$router.push({
                name: 'pointRecord'
              })
            }
          })
        })
      })
    }
  }
}
</script>

<style lang="scss">
.point-mall {
  .point-balance {
    height: px2vw(100);
    background-image: linear-gradient(-90deg, #ffbf00 0%, #fdd000 100%);
    img {
      width: px2vw(18);
      margin-left: 1vw;
      margin-top: 3vw;
    }
  }
  .exchange-list {
    width: 95%;
    flex-wrap: wrap;
    margin: 2.6vw auto;
    box-shadow: 0 0 px2vw(6) 0 rgba(0, 0, 0, 0.12);
    border-radius: px2vw(2);
    .exchange-item {
      padding: 4vw 3.5vw 5vw;
      width: 50%;
      border-bottom: 1px solid #efefef;
      &:nth-of-type(odd) {
        border-right: 1px solid #efefef;
      }
      .item-img {
        width: 100%;
        height: 25vw;
        object-fit: contain;
        object-position: center;
      }
      // .item-info {
      //   width: 100%;
      //   height: 17vw;
      //   margin-bottom: 2vw;
      //   .exchange-coupon {
      //     height: 100%;
      //     background-image: url('./img/coupon_bg.png');
      //     background-size: contain;
      //     background-repeat: no-repeat;
      //     padding-right: 36%;
      //     padding-top: 2.5vw;
      //     text-align: center;
      //   }
      // }
      .item-bottom {
        margin-top: 1.8vw;
      }
      .exchange-btn {
        min-width: px2vw(70);
        height: px2vw(22);
        border-radius: 100px;
        border: 1px solid #3d3d3d;
        &:disabled {
          background: #d8d8d8;
          color: #ffffff;
          border: 0;
        }
      }
    }
  }
}
</style>
