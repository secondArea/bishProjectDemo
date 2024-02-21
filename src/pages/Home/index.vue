<template>
  <div>
    <Nav></Nav>
    <ProductList/>
  </div>
</template>

<script>
// 组件

import ProductList from '@/components/ProductList';

export default {
  name: "Home",
  // 局部组件注册
  components: {
    ProductList
  },
  
};
</script>

<style lang="less" scoped>
</style>
