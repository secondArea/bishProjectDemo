/* 假数据服务 */
import Mock from "mockjs"
//数据文档
import floor from "./floor.json"
import baseCategoryList from "./offlineData/baseCategoryList.json"
import indexBannerList from "./offlineData/indexBanner.json"
// 记录数据模板。当拦截到匹配 rurl 的 Ajax 请求时，将根据数据模板 template 生成模拟数据，并作为响应数据返回。


// floor数据
Mock.mock("/mock/floor",{
    code:200,
    data:floor
});
//首页三级分类离线数据
Mock.mock("/mock/product/getBaseCategoryList",baseCategoryList);

// 首页轮播图离线数据
Mock.mock("/mock/cms/banner",indexBannerList);

// 模拟登录接口

Mock.mock("/mock/user/login", "post", (options) => {
    const { username, password } = JSON.parse(options.body);

    // 验证用户名和密码
    if (username === "admin" && password === "123456") {
        const token = Mock.mock("@guid");

        const storedUserInfoStr = localStorage.getItem("userInfo");
        // 如果已有缓存用户信息，则使用缓存的信息
        const storedUserInfo =storedUserInfoStr ? JSON.parse(storedUserInfoStr) : {};
            
        
        const userInfo = {
            userId: storedUserInfo.userId || "@guid",
            username:storedUserInfo.username ||  "admin",
            avatar:storedUserInfo.avatar ||  "/images/avatar.jpg",
            orders:storedUserInfo.orders ||  [], 
            shoppingCart:storedUserInfo.shoppingCart ||  [] 
       
        };

        // 存储token和用户信息，用于后续检验
        localStorage.setItem("token", token);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        return Mock.mock({
            code: 200,
            data: {
                userId: userInfo.userId,
                username: userInfo.username,
                avatar: userInfo.avatar,
                orders: userInfo.orders,
                shoppingCart: userInfo.shoppingCart,
                token: token
            },
            message: "登录成功"
        });
    } else {
        return Mock.mock({
            code: 401,
            message: "用户名或密码错误"
        });
    }
});

// 模拟检验token是否过期接口
Mock.mock("/mock/user/checkToken", "get", () => {
    const token = localStorage.getItem("token");
    const userInfoStr = localStorage.getItem("userInfo");
  
    if (token && userInfoStr) {
      const userInfo = JSON.parse(userInfoStr);
      return Mock.mock({
        code: 200,
        data: {
          userId: userInfo.userId,
          username: userInfo.username,
          avatar: userInfo.avatar,
          orders: userInfo.orders,
          shoppingCart: userInfo.shoppingCart,
          token: token
        },
        message: "Token验证成功"
      });
    } else {
      return Mock.mock({
        code: 401,
        message: "Token过期或不存在"
      });
    }
});

//退出登录
Mock.mock("/mock/user/logout", "post", () => {
    // 从localStorage中清除令牌和用户信息
    localStorage.removeItem("token");

    return Mock.mock({
        code: 200,
        message: "退出登录成功"
    });
});