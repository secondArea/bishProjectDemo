<template>
    <div class="account">
        <h2>{{ userInfo.username }}</h2>
        <img :src="userInfo.avatar" alt="User Avatar" style="max-width: 100px; max-height: 100px; border-radius: 50%;">
        
        <div v-if="userInfo.orders.length > 0">
          <h3>订单数据：</h3>
          <ul>
            <li v-for="(order, index) in userInfo.orders" :key="index">{{ order }}</li>
          </ul>
        </div>
  
        <el-button  @click="loginOut">退出登录</el-button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        userInfo: null,
      };
    },
    mounted() {
      this.loadUserInfo();
    },
      methods: {
          loadUserInfo() {
              // 尝试从localStorage中获取userInfo
              const localStorageUserInfo = JSON.parse(localStorage.getItem('userInfo'));

              // 如果localStorage中存在userInfo，则使用它；否则，使用Vuex中的userInfo
              this.userInfo = localStorageUserInfo || this.$store.state.user.userInfo;
          },
          async loginOut() {
              try {
                  await this.$store.dispatch("setLoginOut");
                  this.$message.success("退出登录成功!");
                  //回到主页
                  this.$router.push("/");
              } catch (error) {
                  this.$message.error("退出失败!" + error);
              }
          },
      },
  };
  </script>

<style scoped>

  .account{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 50px 0;
    padding: 20px;

    gap: 30px;
  }
</style>
  