<template>
  <header class="header">
    <div class="top">
      <div class="container">
        <div class="loginList">
          <!-- 已登录状态 -->
          <p v-if="$store.state.user.userInfo.username" class="user-info">
            <!-- <a href="###">登录</a> -->
            <!-- <a href="javascript:;"></a> -->
            <router-link to="/account" style="margin-right:10px" class="user-info-box">
              <div class="image-cotainer">
                <img :src="$store.state.user.userInfo.avatar" :alt="$store.state.user.userInfo.username" class="avatar">
              </div>
              <div>{{$store.state.user.userInfo.username}}</div>
              
            </router-link>
            <a href="javascript:;" @click="loginOut">退出登录</a>
          </p>
          <!-- 未登录 -->
          <p v-else>

            <!-- <a href="###">登录</a> -->
            <router-link to="/login">登录</router-link>

          </p>
        </div>
        <div class="typeList">
          <router-link to="/account">
            <el-button size="small">
              个人中心
            </el-button>
          </router-link>
          <router-link to="/account">
            <el-button size="small">
              我的订单
            </el-button>
          </router-link>
          <router-link to="/shopcart">
            <el-badge :max="99" :value="totalAmount" class="item">
              <el-button size="small">我的购物车</el-button>
            </el-badge>
            
          </router-link>
          
        
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom">
      <h1 class="logoArea">
        <router-link to="/" class="logo" title="主页">
            <p>主页</p>
        </router-link>
      </h1>

      <div class="searchForm">
        <el-input 
          type="text" 
          placeholder="请输入产品名称" 
          id="autocomplete" 
          class="input-error input-xxlarge" 
          v-model="searchKeyWord" 
          @change="handleEnter"
        />


        <el-button type="primary" @click.prevent="toSearch" ref="searchButton">
            搜索
        </el-button>
      </div>
      
    </div>
  </header>
</template>

<script>
import {mapState} from "vuex"
export default {
  name: "Header",
  data() {
    return {
      searchKeyWord:''
    };
  },
  mounted(){
    this.$bus.$on("clearSearch",this.clearSearch);
  },
  destroyed(){
    //解绑
    this.$bus.$off("clearSearch");
  },
  methods: {
    /* 退出登录 */
    async loginOut(){
      try {
        await this.$store.dispatch("setLoginOut");
        this.$message.success("退出登录成功!");
        //回到主页
        this.$router.push("/");
      } catch (error) {
        this.$message.error("退出失败!"+error);
      }
    },

    toSearch() {
      if (this.searchKeyWord.trim()) {
        this.$router.push(`/search/${this.searchKeyWord}`);
        this.searchKeyWord = '';
      } else {
        this.$message.warning("请输入关键词");
      }

    },
    
    handleEnter() {
      // 按下回车时触发按钮点击事件
      this.$refs.searchButton.$el.click();
    } 
  },

  computed: {
    
    totalAmount(){
      const shopCartList = this.$store.state.car.shoppingCart;
      return shopCartList.reduce((prev,shop)=>{
        prev+=(shop.quantity);
        return prev;
      },0)
    }
  }
};
</script>

<style lang="less" scoped>


  .user-info {
    /* Styles specific to screens with a width of 600 pixels or less (e.g., smartphone styles) */
    display: flex;
    flex-direction: column;
  }

  .user-info-box{
    display: flex;
    align-items: center;
  }


.header {
  & > .top {
    background-color: #eaeaea;
    line-height: 30px;
    .container {
      margin: 0 auto;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      .loginList {

        p {
          float: left;
          margin-right: 10px;
          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
        }
      }
      .typeList {
          padding: 0 1px;
        a {
          & + a {

          }
        }
      }
    }
  }
  & > .bottom {
    padding: 10px 20px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 30px;
    .logoArea {
      min-width: 50px;
      .logo {
        margin: auto;
        
        img {
          width: 175px;
          margin: 25px 45px;
        }
      }
    }

      
      .searchForm {
        width: 100%;
        max-width: 500px;
        display: flex;
        input {
          box-sizing: border-box;
          width: 100%;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          &:focus {
            outline: none;
          }
        }
       
      }
    
  }
}

.image-cotainer {
  width: 20px;  /* 设置容器的宽度 */
  height: 20px; /* 设置容器的高度 */
  overflow: hidden; /* 隐藏超出容器的部分 */

  /* 将图片设置为圆形 */
  border-radius: 50%;
}

.avatar {
  width: 100%;   /* 图片占满容器宽度 */
  height: 100%;  /* 图片占满容器高度 */
  object-fit: cover; /* 保持图片比例并裁剪超出的部分 */
  border-radius: 50%; /* 确保图片也是圆形 */
}




</style>
