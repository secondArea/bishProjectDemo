<template>
    <div class="product-detail">
        <div>
            <img class="detail-image" :src="require('../../../public/images/s-l960.jpg')" :alt="product.name" />
        </div>
        <p>名称：{{ product.name }}</p>
        <p>价格：{{ product.price }}</p>
        <p>简介：{{ product.description }}</p>
        <p>库存: {{ product.inventory }}</p>

        <!-- 添加数量选择框 -->
        <el-input-number v-model="quantity" :min="1" :max="product.inventory" label="数量"></el-input-number>

        <!-- 添加购物车按钮 -->
        <el-button @click="addToCart">添加到购物车</el-button>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            product: {}, 
            quantity: 1, 
        };
    },
    computed: {
        // 从Vuex中获取商品数据
        getProductById() {
            
            return this.$store.state.product.products.find(product => product.id == this.$route.params.id);
        }
    },
    watch: {
        // 监听商品数据的变化
        getProductById: {
            immediate: true,
            handler(newVal) {
                console.log('Product:', newVal);
                this.product = newVal;
            }
        }
    },
    methods: {
        // 添加到购物车的方法
        addToCart() {
            if (this.$store.state.user.token) {
                // 在这里执行添加到购物车的逻辑，你可以使用Vuex来管理购物车状态
                this.$message({
                    showClose: true,
                    message: `已添加 ${this.quantity} 件商品到购物车`,
                    type: 'success'
                });
            } else {
                // 如果未登录，弹出登录提示
                this.$message({
                    showClose: true,
                    message: '请先登录',
                    type: 'warning'
                });
            }
        }
    },
   
};
</script>
  
<style scoped>
.product-detail {
    text-align: center;
    margin: 20px;
}

.detail-image {
    max-width: 500px; /* 设置最大宽度为500px */
    width: 100%; /* 保持图片响应式 */
    display: block; /* 避免底部留白 */
    margin: 0 auto; /* 图片水平居中 */
    height: auto;
}
</style>
  