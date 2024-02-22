<template>
  <div class="paysuccess">

    <div class="success">
      <h1>
            支付成功啦
      </h1>
      <div class="paydetail">
        <p class="button">
          <el-button type="primary" class="btn-look" @click="look">查看订单</el-button>
          <el-button class="btn-goshop" @click="goToShoo">继续购物</el-button>
        </p>
      </div>
    </div>

  </div>    
</template>

<script>
  export default {
    name: 'PaySuccess',
    methods:{
      look(){
        this.$router.push('/account')
      },
      goToShoo(){
        this.$router.push('/')
      }
    }
  }
</script>

<style lang="less" scoped>

  .success{
    display: flex;
    flex-direction: column;
    align-items: center;  
    gap: 10px;
    padding: 10px;
  }
  
  
</style>