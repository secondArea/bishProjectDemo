<template>
<div style="padding: 10px;">
  <div class="trade-container">
    <h3 class="title">填写并核对订单信息</h3>
    <div class="content">
      <h5 class="receive">
        收件人信息
        <a href="javascript:;" @click="addAddress">新增收货地址</a>
      </h5>
      <!-- 用户地址信息展示 -->
      <template v-if="userAddressList.length!=0">
        <!-- 存在地址 -->
        <div class="address clearFix" v-for="(userAddress,index) in userAddressList" :key="userAddress.id" @click="changeDefault(userAddress)">
          <span class="username" :class="{selected:userAddress.isDefault}">{{userAddress.consignee}}</span>
          <p>
            <span class="s1">{{userAddress.provinceName}}</span>
            <span class="s2">{{userAddress.cityName}}</span>
            <span class="s1">{{userAddress.userAddress}}</span>
            <span class="s2">{{userAddress.phoneNum}}</span>
            <span class="s3" v-if="userAddress.isDefault">默认地址</span>
          </p>
          <!-- 地址操作区 -->
          <span class="place" style="float: right;">
            <!-- 通过index可以获取到userAddress.id  -->
            <a href="javascript:;" style="margin-right: 7px;" @click.stop="updateUserAddress(userAddress.id)">修改</a>
            <el-popconfirm title="确定删除该地址吗?" @confirm="removeUserAddress(userAddress)" ref="popconfirm">
              <a href="javascript:;" slot="reference" @click.stop="handleDeleteClick">删除</a>
            </el-popconfirm>
          </span>
        </div>
      </template>
        <!-- 不存在地址的时候 -->
      <template v-else>
        <div class="no-address">
          <a href="javascript:;" @click="addAddress" >找不到您的地址信息,赶快去添加地址信息吧~</a>
        </div>
      </template>
      
      
      
      <!-- 商品清单 -->
      <div class="detail">
        <h5>商品清单</h5>
      
        <div class="cart-body">
          <ul class="cart-list" v-for="shopCart in detailArrayList" :key="shopCart.id">
          
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
                <span class="price">￥{{ shopCart.price }}</span>
            </li>
            <li class="cart-list-con5">
              <span class="infoTitle" v-if="windowWidth <= 768">数量：</span>
                <span>x{{ shopCart.quantity }}</span>
            </li>
            <li class="cart-list-con6">
              <span class="infoTitle" v-if="windowWidth <= 768">小计（元）：</span>
                <span class="sum">￥{{ shopCart.quantity * shopCart.price }}</span>
            </li>
          </ul>
        </div>


       
      </div>
      
      <!-- <div class="line"></div> -->
      
    </div>
    <div class="money clearFix">
      <ul>
        <li>
          <b><i>{{totalAmount}}</i>件商品，总商品金额</b>
          <span><i>¥{{totalAccount}}</i></span>
        </li>
      </ul>
    </div>
    <div class="trade">
      <div class="price">应付金额:　<span>¥{{totalAccount}}</span></div>
      <!-- Object.keys(this.defaultUserAddress).length === 0 -->
      <div class="receiveInfo" v-if="Object.keys(this.defaultUserAddress).length !== 0">
        寄送至:
        <span>{{defaultUserAddress.userAddress}}</span>
        收货人：<span>{{defaultUserAddress.consignee}}</span>
        <span>{{defaultUserAddress.phoneNum}}</span>
      </div>
      <div class="receiveInfo" v-else>
        未选择收获地址信息
      </div>
    </div>
    <div class="sub clearFix">
      <el-button class="subBtn" type="primary" @click="orderShop">提交订单</el-button>
    </div>
  </div>
  <!-- 地址编辑  -->
   <AddressInfoModel :controlAddressShow.sync="controlAddressShow" @confirmAddress="clickConfirm"/>
  </div>
</template>

<script>
  import AddressInfoModel from "@/pages/AddressModel";
  import {mapGetters, mapState} from "vuex"
  export default {
    name: 'Trade',
    components:{AddressInfoModel},
    data(){
      return {
        // 用户留言 
        userWant:"",
        //地址信息对话框显示和隐藏
        controlAddressShow:false,
        windowWidth: window.innerWidth
      }
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
    computed:{
      ...mapGetters(["userAddressList"]), 
      ...mapState({
        // tradeInfo: state => state.trade.tradeInfo
      }),
      //计算最终确认的用户信息
      defaultUserAddress(){
        return this.userAddressList.find(item => item.isDefault) || {};
      },
      detailArrayList() {
        // 从localStorage中获取shoppingCart对象
        const shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
        
        // 筛选出isChecked为true的项
        const checkedItems = shoppingCart.filter(item => item.isChecked);

        return checkedItems;
      },

      totalAccount() {
        return this.detailArrayList.reduce((prev, shop) => {
          if (shop.isChecked) {
            prev += (shop.price * shop.quantity);
          }
          return prev;
        }, 0)
      },
      //总商品数量
      totalAmount() {
        return this.detailArrayList.reduce((prev, shop) => {
          if (shop.isChecked) {
            prev += (shop.quantity);
          }
          return prev;
        }, 0)
      }
    },
    mounted(){
      // this.sendTradeInfo();
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

      handleDeleteClick(event) {
        // 阻止点击事件传播到父元素
        event.stopPropagation();
        
        // 打开 el-popconfirm
        // this.$refs.popconfirm.showPopper();
      },
      handleConfirm() {
        // 处理确认事件
        this.removeUserAddress(userAddress);
      },
      // 删除地址
      async removeUserAddress(userAddress) {
      // 数据库移除
        try {
          await this.$store.dispatch("deletedAddress", userAddress)
          if (result.code == 200) {
            //删除地址成功
            this.$message.success("删除地址成功!");
 
          } else {
            this.$message.error(result.message);
            console.log(result.message, "删除地址失败!");
          }
        } catch (error) {

        }

      },
      // 修改地址
      updateUserAddress(id){
      
        let addInfo = this.userAddressList.find(address => address.id == id);
        
        this.$store.state.trade.changAddress = addInfo;
        //显示弹窗
        this.controlAddressShow = true;
      },
      // 地址弹出框用户单击确定
      clickConfirm(){
        //隐藏弹窗
        
        this.controlAddressShow=false;
        //刷新界面 后面愿意优化的话可以把获取地址信息和商品信息分离开
        // this.sendTradeInfo();
      },
      // 添加地址
      addAddress(){
        // this.$store.state.trade.changAddress = {}
        this.controlAddressShow = true;
      },
      // 提交订单
      async orderShop(){
        // 判断是否已经选了地址
        if(Object.keys(this.defaultUserAddress).length === 0){
          //禁止提交数据
          this.$message({
              message: '请选择您的地址后再提交订单',
              type: 'warning'
          });
          return;
        }
        // let {tradeNo} = this.tradeInfo;
        let {consignee,phoneNum,userAddress,provinceName,cityName} = this.defaultUserAddress;
        

        const orderNumber = Math.floor(10000000 + Math.random() * 90000000);
        function formatChineseDateTime(date) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const seconds = String(date.getSeconds()).padStart(2, '0');

          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }

        let currentDate = new Date();
        let formattedDate = formatChineseDateTime(currentDate);
          // 提交订单信息
        let infoObj = {
          consignee:consignee,
          consigneeTel:phoneNum,
          deliveryAddress:userAddress,
          orderDetailList:this.detailArrayList,
          orderNumber,
          orderDate:formattedDate,
          status:1,
          totalAccount:this.totalAccount,
          provinceName,
          cityName

        }
        
        try {
          await this.$store.dispatch("submitOrder",infoObj)

          const filterShopcart = JSON.parse(localStorage.getItem("shoppingCart")).filter(item => !item.isChecked)
          localStorage.setItem("shoppingCart", JSON.stringify(filterShopcart)); 
          this.$store.commit('UPDATE_SHOPPING_CART');

          
          function updateInventoryAfterOrder(productList, orderList) {
          for (const orderItem of orderList) {
            const orderedProduct = productList.find(product => product.id === orderItem.id);

            if (orderedProduct && orderedProduct.inventory >= orderItem.quantity) {
              // 扣除库存
              orderedProduct.inventory -= orderItem.quantity;
          
            } else {
     
            }
          }
          // 返回更新后的产品列表
          return productList;
        }

        const productList = JSON.parse(localStorage.getItem("products"))
        const newProductList = updateInventoryAfterOrder(productList, this.detailArrayList);
        localStorage.setItem("products", JSON.stringify(newProductList));
        this.$store.state.product.products = newProductList

        this.$router.push("/pay?orderNo="+orderNumber);
        } catch (error) {
          
        }
        
          
            //提交订单成功
        
            //跳转,附带orderId 订单号
        // this.$router.push("/pay?orderNo="+result.data);
          
       
        
      },
      // 改变默认地址
      async changeDefault(userAddress){
        //传入引用数据类型,然后
        try {
          await this.$store.dispatch("changeDefaultAddress", userAddress)
        } catch (error) {
          
        }
      },
      //获取信息
      // sendTradeInfo(){
      //   this.$store.dispatch("getTradeInfo");
      // }
    },
  }
</script>

<style lang="less" scoped>
  .trade-container {
    .title {
      max-width: 700px;
      margin: 0 auto;
      font-size: 14px;
      line-height: 21px;
    }
    //没有地址时候的css
    .no-address{
      text-align: center;
      margin: 15px 0;
      a{
        font-size: 16px;
      }
    }
    .content {
      max-width:700px;
      margin: 10px auto 0;
      border: 1px solid rgb(221, 221, 221);
      padding: 25px;
      box-sizing: border-box;

      .receive,
      .pay {
        line-height: 36px;
        margin: 18px 0;
      }

      .receive{
        a{
          font-size: 12px;
          float: right;
          &:hover{
            color: #4cb9fc;
            text-decoration: underline;
          }
        }
      }


      .address {  
        @media (max-width: 768px){
          display: grid;
          grid-template-rows: 1fr 1fr;
          grid-template-columns:1fr ; 
          gap: 5px;
          justify-content: start;
            padding: 10px;
          border: 1px solid #ddd;
        };

   
        display: grid;
        grid-template-columns: auto  1fr auto;
        gap: 10px;
        //padding: 10px;
        //border: 1px solid #ddd;
        .username {

          width: 100px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border: 1px solid #ddd;
          position: relative;
        }

        .username::after {
          content: "";
          display: none;
          width: 13px;
          height: 13px;
          position: absolute;
          right: 0;
          bottom: 0;
    
        }

        .username.selected {
          border-color: var(--primary-color);
        }

        .username.selected::after {
          display: block;
        }

        p {

          line-height: 30px;
          cursor: pointer;

          .s1 {
            float: left;

          }

          .s2 {
            float: left;
            margin: 0 5px;
          }

          .s3 {
            float: left;
            width: 56px;
            height: 24px;
            line-height: 24px;
            margin-left: 10px;
            background-color: #878787;
            color: #fff;
            margin-top: 3px;
            text-align: center;
          }
        }

        p:hover {
          background-color: #ddd;
        }
      }

      .line {
        height: 1px;
        background-color: #ddd;
      }

      .way {
        width: 1080px;
        height: 110px;
        background: #f4f4f4;
        padding: 15px;
        margin: 0 auto;

        h5 {
          line-height: 50px;
        }

        .info {
          margin-top: 20px;

          .s1 {
            float: left;
            border: 1px solid #ddd;
            width: 120px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            margin-right: 10px;
          }

          p {
            line-height: 30px;
          }
        }
      }

      .detail {
        
        //background: #feedef;
        padding: 15px;
        margin: 2px auto 0;
        border: 1px solid #ddd;
        h5 {
          line-height: 50px;
        }

        .list {
          display: flex;
          justify-content: space-between;

          li {
            line-height: 30px;

            p {

              margin-bottom: 20px;
            }

            h4 {
              color: #c81623;
              font-weight: 400;
            }

            h3 {

              color: #e12228;
            }
          }
        }
      }

      .bbs {
        margin-bottom: 15px;

        h5 {
          line-height: 50px;
        }

        textarea {
          width: 100%;
          border-color: #e4e2e2;
          line-height: 1.8;
          outline: none;
          resize: none;
        }
      }

      .bill {
        h5 {
          line-height: 50px;
        }

        div {
          padding-left: 15px;
        }
      }
    }

    .money {
      max-width: 700px;
      margin: 20px auto;

      ul {
        width: 220px;
        float: right;

        li {
          line-height: 30px;
          display: flex;
          justify-content: space-between;

          i {
            color: red;
          }
        }
      }
    }

    .trade {
      box-sizing: border-box;
      max-width: 700px;
      padding: 10px;
      margin: 10px auto;
      text-align: right;
      background-color: #f4f4f4;
      border: 1px solid #ddd;

      div {
        line-height: 30px;
      }

      .price span {
        color: #e12228;
        font-weight: 700;
        font-size: 14px;
      }

      .receiveInfo {
        color: #999;
      }
    }

    .sub {
      max-width: 700px;
      margin: 0 auto 10px;

      .subBtn {
        float: right;
        width: 164px;
      }
    }

  }

  .cart-body {
    margin: 15px 0;
    border: 1px solid #ddd;
    padding: 5px;
    @media (max-width: 768px){
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      border:none;
      padding: 0px;
    }
    .cart-list {
      padding: 10px;
      border-bottom: 1px solid #ddd;
    
      @media (min-width: 768px) {
        display: grid;
        grid-template-columns: repeat(4, minmax(auto, 200px));
        justify-content: start;
        align-items: center;
        & > li {
          float: left;
        }

    
        .cart-list-con2 {
          img {
            width: 82px;
            height: 82px;
          }
    
          .item-msg { 
            margin: 0 10px;
            line-height: 18px;
          }
        }
    
        .cart-list-con5 {
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
          .sum {
            //font-size: 16px;
          }
        }

        &:last-child {
          border-bottom: none;
        }
    
      }
    
      @media (max-width: 768px) {
        /* 移动端布局 */
        border: 1px solid #ddd;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

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
</style>