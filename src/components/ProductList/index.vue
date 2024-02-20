<template>
    <div>
        <div class="searchArea">
            <el-form action="###" class="searchForm">
                <el-input type="text" id="autocomplete" class="input-error input-xxlarge" v-model="searchKeyWord" />

   
                <el-button type="primary" @click.prevent="toSearch">
                    搜索
                </el-button>
            </el-form>
        </div>
        <div class="productList" ref="productListContainer" @scroll="handleScroll" @touchstart="handleTouchStart"
            @touchmove="handleTouchMove" @touchend="handleTouchEnd">
            <div class="refresh-indicator" :class="{ refreshing }">
                {{ refreshing ? '刷新中...' : '' }}
            </div>
            <div class="productListItems">
                <Product v-for="product in products" :key="product.id" :product="product" />

                <div v-if="loading" class="loading-indicator">
                    <p>Loading...</p>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import Product from '@/components/Product'; // 确保路径正确

export default {
    components: {
        Product,
    },
    data() {
        return {
            products: [],
            page: 1,
            pageSize: 6,
            hasMore: true,
            loading: false,
            startY: 0,
            moveY: 0,
            isTouchStart: false,
            refreshing: false,
            searchKeyWord: '',
            searchKeyWordFilter: ''
        };
    },

    mounted() {
        this.fetchProducts();
        this.$nextTick(() => {
            this.$refs.productListContainer.addEventListener('scroll', this.handleScroll);
        });
    },
    beforeDestroy() {
        this.$refs.productListContainer.removeEventListener('scroll', this.handleScroll);
    },

    methods: {
        handleScroll() {
            const container = this.$refs.productListContainer;

            if (container.scrollTop + container.clientHeight >= container.scrollHeight - 1) {
                this.loadMore();

            }
        },
        loadMore() {
            if (this.hasMore && !this.loading) {
                this.loading = true
                setTimeout(() => {
                    this.page++;
                    this.fetchProducts();
                    this.loading = false
                }, 1000);

            }
        },

        toSearch() {
            if(this.searchKeyWord.trim()){
                this.page = 1
                this.searchKeyWordFilter = this.searchKeyWord;
                this.fetchProducts();
                // 清空搜索关键字
                this.searchKeyWord = '';
            }
            
        },

        fetchProducts() {
            const dummyData = [];
            for (let i = 1; i <= 18; i++) {
                dummyData.push({
                    id: i,
                    name: `手机 ${i}`,
                    price: parseFloat((Math.random() * (100 - 10) + 10).toFixed(2)),
                    description: `Description ${i}`,
                    inventory: Math.floor(Math.random() * 100) + 1,
                });
            }

            const filteredData = dummyData.filter(product => {
                return product.name.includes(this.searchKeyWordFilter);
            });
            console.log(filteredData,'filteredData');
            const start = (this.page - 1) * this.pageSize;
            const end = start + this.pageSize;
            const newData = filteredData.slice(start, end);

            if (newData.length === 0) {
                this.hasMore = false;
            }
            
            if (this.page === 1) {
                this.products = newData;
            } else {
                this.products = this.products.concat(newData);
            }
        },

        onRefresh() {
            // 模拟请求延时效果
            setTimeout(() => {
                // 下拉刷新触发时的处理
                this.page = 1;
                this.hasMore = true;
                this.searchKeyWordFilter = ''
                this.fetchProducts();
                // 刷新完成后需要手动设置 refreshing 为 false，通知组件结束刷新状态
                console.log(6666);
                this.refreshing = false;
                this.$refs.productListContainer.scrollTop = 0; // 返回顶部

            }, 1000); // 假设请求需要1秒钟
        },

        handleTouchStart(event) {
            this.startY = event.touches[0].clientY;
            this.isTouchStart = true;
        },

        handleTouchMove(event) {
            if (this.isTouchStart) {
                this.moveY = event.touches[0].clientY - this.startY;

                // 在下拉过程中，可以根据moveY的值来实现一些下拉时的动画效果

                if (this.moveY > 50) {
                    // 在下拉一定距离后触发刷新操作，例如50px
                    this.refreshing = true;
                    this.onRefresh()
                }
            }
        },

        handleTouchEnd() {
            this.isTouchStart = false;
            this.moveY = 0;
        },
    },

};
</script>
  
<style scoped>
.productList {
    padding: 10px;
    max-height: 600px;
    overflow: auto;
    margin: 10px 0;
}

.productListItems {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    padding: 10px;
}

.refresh-indicator {
    text-align: center;
    line-height: 40px;
    font-size: 14px;
    color: #666;
    transition: all 0.3s ease;
    transform: translateY(-40px);
    /* 初始状态上移，隐藏在顶部 */
}

.refreshing {
    transform: translateY(0);
    /* 刷新时下移，显示在顶部 */
}

.loading-indicator {
    display: flex;
    justify-content: center;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
}

.searchArea {
    margin: 10px 10px;
    display: flex;
    justify-content: center;

    .searchForm {
        display: flex;
        max-width: 500px;
        width: 100%;

    }
}


@media (max-width: 768px) {
    .productListItems {
        grid-template-columns: 1fr 1fr;
    }
}
</style>
  