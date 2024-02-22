<template>
    <div>
        <div class="searchArea">
            <!-- <el-form action="###" class="searchForm">
                <el-input type="text" id="autocomplete" class="input-error input-xxlarge" v-model="searchKeyWord" />

   
                <el-button type="primary" @click.prevent="toSearch">
                    搜索
                </el-button>
            </el-form> -->
        </div>
        <vue-loadmore 
            :on-refresh="onRefresh" 
            :finished="finished"
        >


            <!-- <div class="productList" ref="productListContainer" @scroll="handleScroll" @touchstart="handleTouchStart"
            @touchmove="handleTouchMove" @touchend="handleTouchEnd">
            <div class="refresh-indicator" :class="{ refreshing }">
                {{ refreshing ? '刷新中...' : '' }}
            </div> -->
                <div class="productListItems">
                    <Product v-for="product in products" :key="product.id" :product="product" />

                    <div v-if="loading && hasMore" class="loading-indicator">
                        <p>Loading...</p>
                    </div>
                </div>
            <!-- </div> -->
        </vue-loadmore>
    </div>
</template>
  
<script>
import Product from '@/components/Product'; 
import { PullRefresh as MTPullRefresh } from 'mint-ui';

export default {
    components: {
        Product,
        'mt-pull-refresh': MTPullRefresh,
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
            // searchKeyWordFilter: '',
            finished: false
        };
    },
    computed: {
        searchKeyWord() {
        // 在这里动态计算搜索关键字
        return this.$route.params.keyword;
        }
    },
    watch: {
    // 监听 searchKeyWord
        searchKeyWord(newValue, oldValue) {
            // 在这里可以进行一些逻辑处理
            // 调用 fetchProducts 方法
            this.page = 1
            this.fetchProducts(newValue);
        }
    },

    mounted() {
        this.fetchProducts();
        
        this.$nextTick(() => {
            // this.$refs.productListContainer.addEventListener('scroll', this.handleScroll);
            window.addEventListener('scroll', this.handleScroll);
        });
    },
    beforeDestroy() {
        // this.$refs.productListContainer.removeEventListener('scroll', this.handleScroll);
        window.addEventListener('scroll', this.handleScroll);
    },

    methods: {
        handleScroll() {
            // const container = this.$refs.productListContainer;

            // if (container.scrollTop + container.clientHeight >= container.scrollHeight - 1) {
            //     this.loadMore();

            // }
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            if (scrollY + windowHeight >= documentHeight - 200 && !this.loading) {
                // 在距离底部200像素时加载更多产品
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

        // toSearch() {
        //     if(this.searchKeyWord.trim()){
        //         this.page = 1
        //         this.searchKeyWordFilter = this.searchKeyWord;
        //         this.fetchProducts();
        //         // 清空搜索关键字
        //         this.searchKeyWord = '';
        //     }
            
        // },

        fetchProducts() {
            const dummyData = this.$store.state.product.products
            

            const filteredData = dummyData.filter(product => {
                if(this.searchKeyWord){
                    return product.name.includes(this.searchKeyWord);
                }
                return true
            });

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

        onRefresh(done) {
            // 模拟请求延时效果
            setTimeout(() => {
                // 下拉刷新触发时的处理
                this.page = 1;
                this.hasMore = true;
                // this.searchKeyWordFilter = ''
                this.fetchProducts();
        
     
                this.finished = false;
                // this.$refs.productListContainer.scrollTop = 0;
                done();
            }, 0); // 假设请求需要1秒钟
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
  