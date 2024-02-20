import {
    reqBaseCategoryList,
    reqBannerList,

}  from "@/api"

const state = {
    //分类栏目
    baseCategoryList:[],
    //首页轮播图片
    bannerList:[],
    //今日推荐
  
    //二个底部
    floorList:[]
}
const mutations = {
    //分类栏目
    GETBASECATEGORYLIST(state,value){
        //太长了,截取前15个
        value=value.splice(0,15);
        state.baseCategoryList=value;
    },
    //首页轮播
    GETBANNERLIST(state,value){
        state.bannerList=value;
    },
    
}
const actions = {
    //获取三级分类
    async getBaseCategoryList({ commit }){
        //发送ajax请求
        let categoryList = await reqBaseCategoryList();
        if(categoryList.code==200){
            //请求成功
            commit("GETBASECATEGORYLIST",categoryList.data);
        }
    },
    //获取首页轮播
    async getBannerList({commit}){
        //调用ajax,发送,将返回值放在bannerList
        let bannerList = await reqBannerList();
        if(bannerList.code==200){
            commit("GETBANNERLIST",bannerList.data);
        }
    },
}
const getter = {

}

export default {
    state,
    mutations,
    actions,
    getter
}