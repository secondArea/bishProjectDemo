<template>
  <div>
    <Nav></Nav>
    <!-- <ListContainer></ListContainer> -->
    <ProductList/>
  </div>
</template>

<script>
// 组件
import ListContainer from "@/pages/Home/ListContainer";
import ProductList from '@/components/ProductList';
import {mapState} from "vuex";
export default {
  name: "Home",
  // 局部组件注册
  components: {
    ListContainer,
    ProductList
  },
  
};
</script>

<style lang="less" scoped>
</style>
