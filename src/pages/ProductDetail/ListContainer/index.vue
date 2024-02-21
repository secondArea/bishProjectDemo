<template>
  <!--列表-->

    

    <div class="swiper-container">
      <div class="swiper-title">产品详情图</div>
      <div class="swiper-wrapper">
        <div v-for="(el) in bannerList" :key="el.id" class="swiper-slide">

          <img :src="el.imageUrl">
        </div>
      </div>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
    </div>

</template>

<script>
import { mapState } from 'vuex';
// 导入 Swiper Vue.js 组件
import 'swiper/css/swiper.css';
import Swiper from 'swiper'; 

export default {
  name: "ListContainer",
  data(){
    return {
      /* swiper配置 */
      
    }
  },

  mounted() {
    
    this.swiper = new Swiper('.swiper-container', {
      
      loop: true,
      slidesPerView: 1, 
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      touchEventsTarget: window.innerWidth <= 768 ? 'wrapper' : 'container', // Adjust the width threshold as needed
    });
  },
  beforeDestroy() {
    if (this.swiper) {
      this.swiper.destroy();
    }
  },

  computed:{
    ...mapState({bannerList:state=>state.home.bannerList})
  }
};
</script>

<style lang="less" scoped>
.swiper-container {
  width: 100%;
  height: 100%;
  margin: 30px 0;
}

.swiper-title{
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;
  /* Other styles for your slides */
}

.swiper-pagination {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.swiper-button-next,
.swiper-button-prev {
  color: #fff;
  font-size: 18px;
  position: absolute;
  top: 50%;
  width: 40px;
  height: 40px;
  margin-top: -20px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}
</style>
