// import Home from "@/pages/Home"
const Home = () => import("@/pages/Home")
// 相当于
// const Home = function(){
//     return import("@/pages/Home")
// }
//路由懒加载模式
const Login = () => import("@/pages/Login")

const Search = () => import("@/pages/Search")

const ProductDetail = () => import("@/pages/ProductDetail")
const ShopCart = () => import("@/pages/ShopCart")
const Trade = () => import("@/pages/Trade")
const Pay = () => import("@/pages/Pay")
const PaySuccess = () => import("@/pages/PaySuccess")
const NotFound = () => import("@/pages/404");//404页面
const Account = () => import("@/pages/Account");
const OrderDetail = () => import("@/pages/OrderDetail");

import {Message} from "element-ui"
import store from "@/store/index.js"
export default [

    {
        //支付界面
        path:"/pay",
        name:"pay",
        component:Pay,
        //只有从交易页面(创建订单)页面才能跳转到支付页面
        beforeEnter:(to,from,next) => {
            if(from.path === '/trade' || from.path === '/account' || from.path === '/orderDetail'){
                next();
            }else{
                Message.error("只有从交易页面(创建订单)页面或个人中心页面才能跳转到支付页面");
                next("/");
            }
        }
    },
    {
        //支付成功界面
        path:"/paysuccess",
        name:"paysuccess",
        component:PaySuccess,
        // 只有从支付页面才能跳转到支付成功页面
        beforeEnter:(to,from,next) => {
            if(from.path === '/pay'){
                next();
            }else{
                Message.error("只有从支付页面才能跳转到支付成功页面")
                next("/");
            }
        }
    },
    {
        //结算购物车页面
        path:"/trade",
        name:"trade",
        component:Trade,
        // 只有从购物车界面才能跳转到交易页面(创建订单)
        beforeEnter:(to,from,next) => {
            if(from.path === '/shopcart'){
                next();
            }else{
                Message.error("只有从购物车界面才能跳转到交易页面")
                next("/");
            }
        }
    }
    ,
    {
        //购物车列表
        path:"/shopcart",
        name:"shopcart",
        component:ShopCart
    },
    {
        //商品详情
        path:"/productDetail/:id",
        name:"productDetail",
        component:ProductDetail
    },
    {
        //主页
        path:'/',
        component:Home,
    },
    {
        path:'/login',
        name:"login",
        component:Login,
        // 元数据
        meta:{
            isHidenFooter:true
        },
        // // 路由独享守卫
        beforeEnter:(to,from,next) =>{
            //token存在
            if(store.state.user.token){
                //存在返回主页
                next("/");
            }else{
                //不存在放行
                next();
            }
        }
    },
  
    {
        path:'/account',
        name:"account",
        component:Account,
    },
    {
        path:'/orderDetail/:orderNumber',
        name:"orderDetail",
        component:OrderDetail,
    },
    {
        //搜索商品
        // path:'/search/:category?',
        path:'/search/:keyword?',
        name:"search",
        component:Search,
    },
    {
        //404页面
        path:"*",
        name:"nofound",
        component:NotFound,
        meta:{
            isHidenHeader:true,
            isHidenFooter:true,
        }
    }
]