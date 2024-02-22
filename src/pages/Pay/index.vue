<template>
    <div class="pay-main">


      <div class="checkout-tit">
        <h4 class="tit-txt">
          <span class="success-info">订单提交成功，请您及时付款，以便尽快为您发货~~</span>
          <div class="account"><em class="lead">应付金额：</em><em class="orange money">￥{{orderInfo.totalAccount}}</em></div>
        </h4>

      </div>

      <div class="submit">
        <el-button type="primary" class="btn" @click="payMoney">立即支付</el-button>
      </div>

    </div>
</template>

<script>
  export default {
    name: 'Pay',
    data(){
      return {
        //后期需要根据orderNo生成支付二维码
        orderNo:"",
        orderInfo:{},
        //定时器
        timer:"",
        //支付状态
        payStatu:0
      }
    },
    beforeMount(){
      //获取订单编号
      this.orderNo = this.$route.query.orderNo;
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
          
          const data = result.find(item => item.orderNumber == this.orderNo);
   
          this.orderInfo = data;
        } catch (error) {
          this.$message.error(error);
        }

        
      },

      async payMoney(){
        try {
          await this.$store.dispatch('payOrder',this.orderInfo); 
          this.$router.push(`/paysuccess/${this.orderNo}`);
        } catch (error) {
          this.$message.error(error);
        }
          
      },
    },

  }
</script>

<style lang="less" scoped>
    .pay-main{
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 20px;
      align-items: center;
    }

    .account{
      margin-top: 10px;
    }
</style>