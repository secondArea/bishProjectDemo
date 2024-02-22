<template>
  <!-- 商品分类导航 -->
  <div class="type-nav">
    <div class="container">
       
     
      <div @mouseleave="hideFirst" @mouseenter="showFirst" class="container-sub">
        <h2 class="all">目录</h2>
        <transition name="slide">
        <div class="sort">
          <!-- 利用事件委派跳转路由 -->
          <div class="all-sort-list2">
            <div
              class="item"
              v-for="(c1, index) in baseCategoryList"
              :key="c1.categoryId"
              :class="{ active: currentIndex == index }"
              @mouseenter="showCurrentItem(index)"
            >
    
              <h3>
            
                <a
                  href="javascript:;"
                  :data-categoryname="c1.categoryName"
                  :data-category1Id="c1.categoryId"
                  >{{ c1.categoryName }}</a
                >
              </h3>
              
            </div>
          </div>
        </div>
         </transition>
      </div>
      
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import throttle from "lodash/throttle";
export default {
  name: "Nav",
  data() {
    return {
      
      currentIndex: -2,
     
      isShowFirst:this.$route.path==="/"
    };
  },
  computed: {
    
    ...mapState({
      baseCategoryList: (state) => state.home.baseCategoryList,
    }),
  },
  methods: {
    
    
    showCurrentItem:throttle(function(index){
      if(this.currentIndex!=-2){
        this.currentIndex=index;
      }
    },200),
    
    
    showFirst(){
      this.currentIndex=-1;
      // this.isShowFirst=true;
    },
    
   
    hideFirst(){
      if(this.$route.path!=="/"){
        this.isShowFirst=false;
      }
        this.currentIndex=-2; 
    }
  },
};
</script>

<style lang="less" scoped>
.type-nav {
  border-bottom: 2px solid var(--primary-color);

  .container {
    margin: 0 auto;
    display: flex;
    position: relative;

    .container-sub{
      display: flex;
    }

    .all {
      min-width:100px;
      height: 45px;
      background-color:var(--primary-color);
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      background: #fafafa;
      display: flex;
      &.slide-enter,
      &.slide-leave-to{
        opacity: 0;
        height: 0;
      }
      &.slide-enter-active,
      &.slide-leave-active{
        transition: all .3s;
      }

      .all-sort-list2 {
        display: flex;
        align-items: center;
        gap: 10px;
        .item {
          height: 100%;
          h3 {
            display: flex;
            align-items: center;
            height: 100%;
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }
          //控制分类列表显示隐藏
          &.active {
            background-color: rgb(139, 134, 134);
            .item-list {
              display: block;
            }
          }
        }
      }
    }
  }
}
</style>
