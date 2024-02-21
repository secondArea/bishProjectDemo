<template>
<div class="shopcart-container">
  <!-- 购物车不为空的时候显示 -->
  <template v-if="shopCartList.length!==0">
    <div class="cart">
      <h4 style="padding: 10px">购物车</h4>
      


      <div class="cart-main">
          <div class="cart-th" v-if="windowWidth > 768">
              <div class="cart-th1">全部</div>
              <div class="cart-th2">商品</div>
              <div class="cart-th3">单价（元）</div>
              <div class="cart-th4">数量</div>
              <div class="cart-th5">小计（元）</div>
              <div class="cart-th6">操作</div>
          </div>
          <div class="cart-body">
              <ul class="cart-list" v-for="shopCart in shopCartList" :key="shopCart.id">
                  <li class="cart-list-con1">
                      <el-checkbox v-model="shopCart.isChecked" @change="setCheckCart(shopCart.id)"></el-checkbox>
                  </li>
                  <li class="cart-list-con2">
                      <router-link :to="'/productDetail/' + shopCart.id">
                          <img :src="require('../../../public/images/s-l960.jpg')" />
                      </router-link>
                      <router-link :to="'/productDetail/' + shopCart.id">
                          <div class="item-msg">
                              {{ shopCart.name }}
                          </div>
                      </router-link>
                  </li>
                  <li class="cart-list-con4">
                      <span class="infoTitle" v-if="windowWidth <= 768">单价（元）：</span>
                      <span class="price">{{ shopCart.price }}</span>
                  </li>
                  <li class="cart-list-con5">
                      <el-input-number size="small" :value="shopCart.quantity" :step="1" label="数量" @change="handleChange(shopCart, $event)"></el-input-number>
                  </li>
                  <li class="cart-list-con6">
                    <span class="infoTitle" v-if="windowWidth <= 768">小计（元）：</span>
                      <span class="sum">{{ shopCart.quantity * shopCart.price }}</span>
                  </li>
                  <li class="cart-list-con7">
                      <el-button @click="deleteOne(shopCart.id)">删除</el-button>
                      <br />
                   
                  </li>
              </ul>
          </div>
      </div>
    


      <div class="cart-tool">
        <div class="select-all">
          <el-checkbox class="chooseAll" v-model="isCheckedAll">全选</el-checkbox>
        </div>
        <div class="option">
          <!-- <a href="javascript:;" @click="deleteAll">删除选中的商品</a> -->
          <el-button @click="deleteSelected">删除选中的商品</el-button>
          <el-button @click="deleteAll">清空购物车</el-button>
        </div>
        <div class="money-box">
          <div>
            <div class="chosed">已选择 <span>{{totalAmount}}</span>件商品</div>
            <div class="sumprice">
              <em>总价（不含运费） ：</em>
              <i class="summoney">{{totalAccount}}</i>
            </div>
          </div>
          <div class="sumbtn">
            <el-button class="sum-btn" type="primary" @click="toTrade">结算</el-button>
          </div>
        </div>
      </div>
    </div>
  </template>
  <!-- 购物车为空的时候显示 -->
  <template v-else>
    <div class="empty-cart">
      <!-- 图片区域 -->

      <div class="info">
        <div class="title">购物车为空</div>
        <router-link to="/" class="toshop">点我去购物</router-link>
      </div>
    </div>
  </template>
</div>
</template>

<script>
import {mapState} from "vuex"
export default {
  name: "ShopCart",
  data() {
    return {
      windowWidth: window.innerWidth
    };
  },
  created() {
    // 添加窗口大小变化的监听器
    window.addEventListener("resize", this.handleResize);
    // 初始化时获取窗口宽度
    this.getWindowWidth();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  mounted(){
    this.getShopCartList();
  },
  methods:{
    handleResize() {
      // 窗口大小变化时更新窗口宽度
      this.getWindowWidth();
    },
    getWindowWidth() {
      // 获取窗口宽度
      this.windowWidth = window.innerWidth;
    },

    //用户单击去结算界面
    toTrade(){
        //1.判断是否登录
        if(this.$store.state.user.token){
           //2.登录了直接跳转
          this.$router.push("/trade");
        }else{
            this.$message.warning("亲亲,请先登录后再下单哦~");
           //3.没有登录就跳转到登录页面并传递参数
           this.$router.push({path:"/login",query:{redirect:"/shopcart"}})
        }
    },

    async deleteSelected(){
      try {
        const shoppingCart = JSON.parse(localStorage.getItem("shoppingCart"))
        const selectedProductIds = shoppingCart.filter(item => item.isChecked).map(item => item.id)

        if(selectedProductIds.length == 0){
          this.$message({
            showClose: true,
            message: `未选择任何商品`,
            type: 'warning'
          });
          return
        }

        await this.$store.dispatch("removeSelectedFromCart",selectedProductIds)
        this.$message({
          showClose: true,
          message: `删除商品成功`,
          type: 'success'
        });
        this.getShopCartList();
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    // 删除所有选中购物车
    async deleteAll(){
      try {
        await this.$store.dispatch("resetShoppingCart");
        this.getShopCartList();
        this.$message({
          showClose: true,
          message: `清空购物车成功`,
          type: 'success'
        });
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    // 删除单个购物车
    async deleteOne(productId){
      //接口挂了
      try {
        await this.$store.dispatch("removeFromCart",productId);
        this.$message({
          showClose: true,
          message: `删除商品成功`,
          type: 'success'
        });
        //重新获取数据
        // this.getShopCartList();
      } catch (error) {
        this.$message.error("删除失败");
        console.log(error.message);
      }
    },
    // 切换购物车选中状态
    async setCheckCart(id){
      try {
        
        const shoppingCart = JSON.parse(localStorage.getItem("shoppingCart"))
        const product = shoppingCart.find(item=> item.id===id);
        const newshoppingCart = shoppingCart.map(item => {
          if (item.id == product.id) {
            return {
              ...product,
              isChecked: !product.isChecked,
            };
          } else {
            return item
          }
        });
        localStorage.setItem("shoppingCart", JSON.stringify(newshoppingCart));
        //重新获取数据
        this.getShopCartList();
      } catch (error) {
        this.$message.error("修改状态发生错误!");
        console.log(error.message);
      }
      
    },
    

    async handleChange(shopCart, quantity) {

      if (!Number.isInteger(quantity)) {
        this.$message({
          showClose: true,
          message: `请输入有效的商品数量`,
          type: 'warning'
        });

        return;
      }
      try {
        await this.$store.dispatch("updateQuantity", { productId: shopCart.id, newQuantity: quantity });

        this.$message({
          showClose: true,
          message: `更改商品数量成功`,
          type: 'success'
        });
      } catch (error) {
        console.log(error);
      }

    },
    //发送获取购物车列表
    getShopCartList(){
      this.$store.dispatch("getShoppingCartData");
    }
  },
  computed:{
    ...mapState({
      //获取购物车列表
      shopCartList:state=>state.car.shoppingCart
    }),
    // 是否全部选中
    isCheckedAll:{
      get(){
        if(this.shopCartList.length===0){
          return false;
        }else{
          return this.shopCartList.every(function(item){
            return item.isChecked;
          });
        }
        //或者简写return this.shopCartList.every((item)=>item.isChecked);
      },
      async set(newValue){
        // console.log("isCheckedAll set被调用",newValue);
        //获取返回的结果,注意,此promise不是checkAll当中的promise,知识一个结果
        try{
          // let resultAll = await this.$store.dispatch("checkAll",newValue ? 1 : 0);
          // console.log(resultAll);
          const shoppingCart = JSON.parse(localStorage.getItem("shoppingCart"))

          shoppingCart.forEach(item => {
            item.isChecked = newValue;
          })
          localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
          //更新所有状态
          this.getShopCartList();
        }catch(error){
          this.$message.error("修改全部选中失败"+error.message);
          // alert("修改全部选中失败",error.message);
        }
        //为什么单击选择框不会调用这个
        // console.log(newValue);
      }
    },
    //总价
    totalAccount(){
      return this.shopCartList.reduce((prev,shop)=>{
        if(shop.isChecked){
          prev+=(shop.price * shop.quantity);
        }
        return prev;
      },0)
    },
    //总商品数量
    totalAmount(){
      return this.shopCartList.reduce((prev,shop)=>{
        if(shop.isChecked){
          prev+=(shop.quantity);
        }
        return prev;
      },0)
    }
  },

};
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box !important;
} 
.empty-cart{
    width: 1200px;
    margin: 0 auto;
    text-align: center;
    height: 250px;
    border: 1px solid #eee;
    border-radius: 10px;
    box-shadow: 0 0 50px 5px rgba(0,0,0,0.2);
    margin-bottom: 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    .info{
      .title{
        font-size: 16px;
      }
      .toshop{
        font-size: 20px;
        color: rgb(141, 141, 218)
      }
    }
}


.cart {
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    padding: 10px;
    @media (max-width: 768px){
      padding: 10px;
    }
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      display: grid;
      text-align: center;
      grid-template-columns: 1fr 1fr 1fr 4fr 2fr 3fr;

      & > div {
        float: left;
      }

      .cart-th1 {


        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {

      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {

      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;
      @media (max-width: 768px){
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }
      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
      
        @media (min-width: 768px) {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 4fr 2fr 3fr;
      
          & > li {
            float: left;
          }
      
          .cart-list-con1 {
            //grid-area: auto / span 1 / auto / span 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
      
          .cart-list-con2 {
            //grid-area: auto / span 2 / auto / span 2;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
      
            img {
              width: 82px;
              height: 82px;
            }
      
            .item-msg { 
              margin: 0 10px;
              line-height: 18px;
            }
          }
      
          .cart-list-con4 {
            //grid-area: auto / span 1 / auto / span 1;
            display: flex;
            justify-content: center;
            align-items: center;
          }
      
          .cart-list-con5 {
            //grid-area: auto / span 1 / auto / span 1;
            display: flex;
            justify-content: center;
            align-items: center;
      
            .mins {
              border: 1px solid #ddd;
              border-right: 0;
              float: left;
              color: #666;
              width: 6px;
              text-align: center;
              padding: 8px;
            }
      
            input {
              border: 1px solid #ddd;
              width: 40px;
              height: 31px;
              float: left;
              text-align: center;
              font-size: 14px;
            }
      
            .plus {
              border: 1px solid #ddd;
              border-left: 0;
              float: left;
              color: #666;
              width: 6px;
              text-align: center;
              padding: 8px;
            }
          }
      
          .cart-list-con6 {
            //grid-area: auto / span 1 / auto / span 1;
            display: flex;
            justify-content: center;
            align-items: center;
      
            .sum {
              font-size: 16px;
            }
          }
      
          .cart-list-con7 {
            //grid-area: auto / span 1 / auto / span 1;
            display: flex;
            justify-content: center;
            align-items: center;
      
            a {
              color: #666;
            }
          }
        }
      
        @media (max-width: 768px) {
          /* 移动端布局 */
          display: flex;
          flex-direction: column;

          & > li {
            margin-bottom: 20px; 
          }
      
          .cart-list-con2 {
            display: flex;
            flex-direction: column;
            align-items: center;
      
            img {
              width: 100%; /* 图片宽度占满容器 */
              height: auto; /* 根据宽度等比例缩放高度 */
            }
      
            .item-msg {
              margin-top: 10px;
            }
          }
      
          .cart-list-con5 {
            display: flex;
            justify-content: space-between;
            align-items: center;
      
            .mins,
            .plus {
              width: 20px;
              padding: 5px;
            }
      
            input {
              width: 50px;
              margin: 0 10px;
            }
          }
        }
      }
      



    }
  }

  .cart-tool {

    overflow: hidden;
    border: 1px solid #ddd;
    display: inline-grid; 
    margin: 30px 10px;
    @media (max-width: 768px) {
      
      display: grid; 
      margin: 30px 10px;
      
    }
    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      display: grid;
      gap: 10px;
      font-size: 16px;
      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        padding: 10px;
        
      }
    }
  }
}


</style>