import Vue from "vue"
import VueRouter from "vue-router"
//引入路由文件
import routes from "./routes.js"
import store from "@/store"
import {Message} from "element-ui";
Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject)
        return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch((err) => {
        if (VueRouter.isNavigationFailure(err)) {
            // resolve err
            return err
        }
        // rethrow error
        return Promise.reject(err)
    })
}
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location, onResolve, onReject) {
    if (onResolve || onReject){
     
        return originalReplace.call(this, location, onResolve, onReject)
    }
    return originalReplace.call(this, location).catch((err) => {
        if (VueRouter.isNavigationFailure(err)) {
          
           
            return err
        }
     
        return Promise.reject(err)
    })
}

const router = new VueRouter({
    mode: "history",
    routes,
    //处理路由切换的时候滚动条位置问题
    scrollBehavior(to, from, savedPosition){
        return {x:0,y:0}
    }
})

//全局前置守卫
router.beforeEach(async (to,from,next) => {
    //获取token
    let token = store.state.user.token;
    //如果token存在
    if(token){
        //有了token还单击了登录按钮
        if(to.path==="/login"){
            //跳回主页去
            next("/");
        }else{
            let userInfo = !!store.state.user.userInfo.skuName;//转布尔值
            //用户信息存在,则登录过了
            if(userInfo){
                next();
            }else{
                //从localStorage获取的,这里判断token是否过期
                try {
                    await store.dispatch("getUserInfo");
                    //没有过期,放行
                    next();
                } catch (error) {
                    //代表登录过期或者其他错误
                    Message.warning("登录过期!请重新登录!");
                    // alert(error.message);
                    store.dispatch("restUserInfo");//清空token数据
                    // store.dispatch("setLoginOut");
                    next("/login?redirect="+to.path);
                } 
            }
        }
    }else{
        const storedUserInfoStr = localStorage.getItem("userInfo");
        const storedUserInfo =storedUserInfoStr ? JSON.parse(storedUserInfoStr) : {};
        //没有登录就跳转到我的订单页面了
        if((to.name === "myorder" || to.name === "account" || to.name === "shopcart") && !storedUserInfo.username){
            Message.warning("还没有登录,请先登录!");
            // 跳转到登录页面,并记录当前路径
            next("/login?redirect="+to.path);
        }
        next();
        
    }
});
export default router;
