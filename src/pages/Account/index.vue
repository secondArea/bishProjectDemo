<template>
  <div class="accountRoot">
    <div class="account">
        <h2>{{ userInfo.username}}</h2>
        <img :src="userInfo.avatar" alt="User Avatar" style="max-width: 100px; max-height: 100px; border-radius: 50%;">
        
        <!-- <div v-if="userInfo.orders.length > 0">
          <h3>订单数据：</h3>
          <ul>
            <li v-for="(order, index) in userInfo.orders" :key="index">{{ order }}</li>
          </ul>
        </div> -->
        <el-button  @click="loginOut">退出登录</el-button>
        

    </div>
    <div class="order-list">
      <h3 v-if="orders.length === 0">暂无订单</h3>
      <div v-else>
        <h3 style="text-align: center;">订单列表：</h3>
      </div>
      <div v-for="(order, index) in orders" :key="index" class="order-item">
        <div class="order-header">
          <span>订单编号：{{ order.orderNumber }}</span>
          <span>状态：{{ order.status === 1 ? '未付款' : '已付款' }}</span>
        </div>
        <div class="order-details">
          <div class="customer-info">
            <p>收货人：{{ order.consignee }}</p>
            <p>电话：{{ order.consigneeTel }}</p>
            <p>地址：{{ order.provinceName }}, {{ order.cityName }}, {{ order.deliveryAddress }}</p>
          </div>
          <div class="order-items">
            <div v-for="(item, i) in order.orderDetailList" :key="i" class="order-item-details">
              <div class="order-item-image" @click.stop="viewProduct(item.id)">
                <img :src="require('../../../public/images/s-l960.jpg')" style="width: 50px; height: 50px;"/>
              </div>
              <div class="order-item-info">
                <p>{{ item.name }}</p>
                <p>价格：￥{{ item.price }}</p>
                <p>数量：{{ item.quantity }}</p>
              </div>
            </div>
          </div>
          <div class="order-summary">
            <p>总计：￥{{ order.totalAccount }}</p>
            <p>下单时间：{{ order.orderDate }}</p>
          </div>
          <div class="order-action">
            <el-button size="small" v-if="order.status == 1" type="primary" @click.stop="payOrder(order.orderNumber)">付款</el-button>
            <el-button size="small" @click.stop="viewOrder(order.orderNumber)">立即查看</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </template>
  
  <script>

  export default {
    data() {
      return {
        userInfo: {},
        orders:[]
      };
    },

    mounted() {
      this.loadUserInfo();
      this.getOrderInfo();
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


          async getOrderInfo(){
            try {
              let result = await this.$store.dispatch('getOrders');    
              this.orders = result.reverse();
            } catch (error) {
              this.$message.error(error);
            }

            
          },

          viewProduct(id){
            this.$router.push(`/productDetail/${id}`);
          },

          payOrder(orderNumber){
            this.$router.push("/pay?orderNo="+orderNumber);
          },

          viewOrder(orderNumber){
            this.$router.push(`/orderDetail/${orderNumber}`);
          }
      },
  };
  </script>

<style scoped>

  .accountRoot{
    margin: 50px 0;
    padding: 20px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 15px;
  }

  .account{
    display: flex;
    flex-direction: column;
    align-items: center;
    

    gap: 30px;
  }

  .order-list {
    max-width: 700px;
    
  }
  
  .order-item {
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px;
    margin-top: 20px;
  }
  
  .order-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  .customer-info {
    margin-bottom: 10px;
  }
  
  .order-items {
    border-top: 1px solid #ccc;
    padding-top: 10px;
  }
  
  .order-item-details {
    margin-bottom: 10px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;
    align-items: center;
  }

  .order-item-image{
    border: 1px solid #ccc;
    width: 50px;
    height: 50px;
    cursor: pointer;
  }
  
  .order-summary {
    margin-top: 10px;
  }

  .order-action{
    border-top: 1px solid #ccc;
    padding-top: 10px;
    margin-top: 10px;
  }
  
  /* 响应式布局 */
  @media screen and (max-width: 600px) {
    .order-item {
      padding: 15px;
    }
  }
</style>
  