<template>
  <div>
    <Header v-show="!$route.meta.isHidenHeader"></Header>
    <router-view></router-view>
    <Footer v-show="!$route.meta.isHidenFooter"></Footer>
  </div>
</template>

<script>
// 引入非路由组件
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import 'element-ui/lib/theme-chalk/index.css'
//引入swipercss
import "swiper/css/swiper.css"
// ajax
export default {
  name: "App",
  mounted(){
 
    this.$store.dispatch("getBaseCategoryList");
  
    this.$store.dispatch("getBannerList");

  },
  components: {
    Footer,
    Header,
  },
};
</script>

<style>
  @import './global-styles.css';
</style>