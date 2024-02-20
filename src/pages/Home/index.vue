<template>
  <div>
    <Nav></Nav>
    <ListContainer></ListContainer>
  
    <!-- <Rank></Rank> -->
    <!-- <Like></Like> -->
    <!-- 注册二个组件 -->
    <!-- <Floor v-for="floor in floorList" :key="floor.id" :floor="floor"></Floor> -->
    <!-- <Brand></Brand> -->
  </div>
</template>

<script>
// 组件
import ListContainer from "@/pages/Home/ListContainer";
import Rank from "@/pages/Home/Rank";
import Like from "@/pages/Home/Like";
import Floor from "@/pages/Home/Floor";
import Brand from "@/pages/Home/Brand";
import {mapState} from "vuex";
export default {
  name: "Home",
  // 局部组件注册
  components: {
    Brand,
    Floor,
    Like,
    ListContainer,
    Rank,
  },
  computed:{
    ...mapState({
      floorList:state=>state.home.floorList
    })
  }
};
</script>

<style lang="less" scoped>
</style>
