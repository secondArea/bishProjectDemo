<template>
  <div>
    <Nav></Nav>
    <ListContainer></ListContainer>
  
  </div>
</template>

<script>
// 组件
import ListContainer from "@/pages/Home/ListContainer";

import {mapState} from "vuex";
export default {
  name: "Home",
  // 局部组件注册
  components: {
    ListContainer,
  },
  
};
</script>

<style lang="less" scoped>
</style>
