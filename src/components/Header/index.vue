<template>
  <header class="header">
    <div class="top">
      <div class="container">
        <div class="loginList">
          <!-- 已登录状态 -->
          <p v-if="$store.state.user.userInfo.name">
            <!-- <a href="###">登录</a> -->
            <!-- <a href="javascript:;"></a> -->
            <router-link to="/account">{{$store.state.user.userInfo.name}}</router-link>
            <a href="javascript:;" @click="loginOut" style="margin-left:10px">退出登录</a>
          </p>
          <!-- 未登录 -->
          <p v-else>
            <span>请</span>
            <!-- <a href="###">登录</a> -->
            <router-link to="/login">登录</router-link>
            <router-link to="/register" class="register">注册</router-link>
          </p>
        </div>
        <div class="typeList">
          <router-link to="/account">个人中心</router-link>
          <router-link to="/center">我的订单</router-link>
          <router-link to="/shopcart">我的购物车</router-link>
          
        
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
      <div class="searchArea">
        <form action="###" class="searchForm">
          <input
            type="text"
            id="autocomplete"
            class="input-error input-xxlarge"
            v-model="searchKeyWord"
          />
          <!-- 阻止表单的默认提交行为 -->
          <button
            class="sui-btn btn-xlarge btn-danger"
            type="submit"
            @click.prevent="toSearch"
          >
            搜索
          </button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      searchKeyWord: "",
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
    /* 清空搜索框 */
    clearSearch(){
      this.searchKeyWord="";
    },
    /* 提交搜索 */
    toSearch() {
      let { searchKeyWord } = this;
      if (searchKeyWord.trim()) {
        //如果当前头部所在组件为search
        let opts={
           name: "search",
          params:{
            keyword:searchKeyWord
          },
          //如果当前对象有query参数就传入
          query:this.$route.query
        };
        if(this.$route.name=="search"){
          this.$router.replace(opts);
        }
        this.$router.push(opts);
        //清空输入内容
        this.searchKeyWord="";
      } else {
        this.$message.warning("请输入完整的内容!");
      }
    },
  },
};
</script>

<style lang="less" scoped>
//头部
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

        a {
          padding: 0 10px;
          & + a {
            border-left: 1px solid #b3aeae;
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
    .searchArea {
      width: 100%;
      max-width: 500px;
      .searchForm {
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
        button {
          height: 32px;
          min-width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          cursor: pointer;
          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>
