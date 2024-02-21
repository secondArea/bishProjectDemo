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



// 模拟购物车相关接口
Mock.mock("/mock/cart/getShoppingCartData", "get", () => {
    const shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

    return Mock.mock({
        code: 200,
        data: shoppingCart,
        message: "获取购物车数据成功",
    });
});

Mock.mock("/mock/cart/resetShoppingCart", "post", () => {
    localStorage.removeItem("shoppingCart");

    return Mock.mock({
        code: 200,
        message: "购物车重置成功"
    });
});

Mock.mock("/mock/cart/addToCart", "post", (options) => {
    const { product, quantityToAdd } = JSON.parse(options.body);
    const quantity = quantityToAdd || 1; // 默认数量为1
    const shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

    const existingItem = shoppingCart.find(item => item.id === product.id);
    if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        if (newQuantity <= product.inventory) {
            const newshoppingCart = shoppingCart.map(item => {
                if (item.id === existingItem.id) {
                    return {
                        ...existingItem,
                        quantity: newQuantity,
                    };
                } else {
                    return item
                }
            });

            localStorage.setItem("shoppingCart", JSON.stringify(newshoppingCart));
            return Mock.mock({
                code: 200,
                message: "商品数量增加成功",
            });
        } else {
            return Mock.mock({
                code: 400,
                message: "商品数量超过库存上限",
            });
        }
    } else {
        if (quantity <= product.inventory) {
            shoppingCart.push({
                ...product,
                quantity,
            });
            localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
            return Mock.mock({
                code: 200,
                message: "商品成功添加到购物车",
            });
        } else {
            return Mock.mock({
                code: 400,
                message: "商品数量超过库存上限",
            });
        }
    }
});

Mock.mock("/mock/cart/removeFromCart", "post", (options) => {
    const productId = JSON.parse(options.body);
    let shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
    shoppingCart = shoppingCart.filter(item => item.id !== productId);
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));

    return Mock.mock({
        code: 200,
        message: "商品成功从购物车中移除"
    });
});

Mock.mock("/mock/cart/removeSelectedFromCart", "post", (options) => {
    const selectedProductIds = JSON.parse(options.body);
    let shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

    // 过滤掉选中的产品
    shoppingCart = shoppingCart.filter(item => !selectedProductIds.includes(item.id));

    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));

    return Mock.mock({
        code: 200,
        message: "选中的商品成功从购物车中移除"
    });
});


Mock.mock("/mock/cart/increaseQuantity", "post", (options) => {
    const productId = JSON.parse(options.body);
    let shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
    const existingItem = shoppingCart.find(item => item.id === productId);

    if (existingItem && existingItem.quantity < existingItem.inventory) {
        const newshoppingCart = shoppingCart.map(item => {
            if(item.id == existingItem.id){
                return {
                    id: existingItem.id,
                    name: existingItem.name,
                    price: existingItem.price,
                    quantity: existingItem.quantity++,
                    description: existingItem.description,
                    inventory:existingItem.inventory
                }
            }else{
                return item;
            }
        })
        localStorage.setItem("shoppingCart", JSON.stringify(newshoppingCart));
        return Mock.mock({
            code: 200,
            message: "商品数量增加成功"
        });
    } else {
        return Mock.mock({
            code: 400,
            message: "商品数量已达到库存上限"
        });
    }
});

Mock.mock("/mock/cart/decreaseQuantity", "post", (options) => {
    const productId = JSON.parse(options.body);
    let shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
    const existingItem = shoppingCart.find(item => item.id === productId);

    if (existingItem && existingItem.quantity > 1) {
        const newshoppingCart = shoppingCart.map(item => {
            if(item.id == existingItem.id){
                return {
                    id: existingItem.id,
                    name: existingItem.name,
                    price: existingItem.price,
                    quantity: existingItem.quantity--,
                    description: existingItem.description,
                    inventory:existingItem.inventory
                }
            }else{
                return item;
            }
        })
        localStorage.setItem("shoppingCart", JSON.stringify(newshoppingCart));
        return Mock.mock({
            code: 200,
            message: "商品数量减少成功"
        });
    } else {
        return Mock.mock({
            code: 400,
            message: "商品数量不能少于1"
        });
    }
});

Mock.mock("/mock/cart/updateQuantity", "post", (options) => {
    const { productId, newQuantity } = JSON.parse(options.body);
    let shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
    const existingItem = shoppingCart.find(item => item.id === productId);

    if (existingItem && newQuantity >= 1 && newQuantity <= existingItem.inventory) {
        const newShoppingCart = shoppingCart.map(item => {
            if (item.id === existingItem.id) {
                return {
                    ...existingItem,
                    quantity: newQuantity,
                };
            } else {
                return item;
            }
        });

        localStorage.setItem("shoppingCart", JSON.stringify(newShoppingCart));
        return Mock.mock({
            code: 200,
            message: "商品数量修改成功",
        });
    } else {
        return Mock.mock({
            code: 400,
            message: "无效的商品数量或已超过库存上限",
        });
    }
});


