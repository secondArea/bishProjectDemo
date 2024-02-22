<template>
    <div class="orderDetaiRoot">
    <div class="order-item">
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
          <div class="order-action" v-if="order.status == 1">
            <el-button size="small"  type="primary" @click.stop="payOrder(order.orderNumber)">付款</el-button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        orderNo:'',
        order:{},
      };
    },
    beforeMount(){
      //获取订单编号
      this.orderNo = this.$route.params.orderNumber;
    },
    mounted(){
      //do something
      this.getOrderInfo();
    },
    methods:{

     
      // 获取订单信息
      async getOrderInfo(){
            try {
              let result = await this.$store.dispatch('getOrders');    
              this.order = result.find(item => item.orderNumber == this.orderNo);
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
    },
  };
  </script>
  
  <style scoped>

  .orderDetaiRoot{
    padding: 10px;
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }

  .order-item {
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px;
    max-width: 700px;
    width: 100%;
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
  