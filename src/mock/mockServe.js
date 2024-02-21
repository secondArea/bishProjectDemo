/* 假数据服务 */
import Mock from "mockjs"
//数据文档
import floor from "./floor.json"
import baseCategoryList from "./offlineData/baseCategoryList.json"
import indexBannerList from "./offlineData/indexBanner.json"
const uuid = require('uuid');

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


// 模拟获取收货地址的接口
Mock.mock("/mock/address/getAddress", "get", () => {
    // 从浏览器缓存中获取已保存的地址列表
    const savedAddresses = JSON.parse(localStorage.getItem("addresses")) || [];

    return Mock.mock({
        code: 200,
        data: savedAddresses,
        message: "收货地址获取成功"
    });
});

// 模拟添加收货地址的接口
Mock.mock("/mock/address/addAddress", "post", (options) => {
    // 从请求参数中获取新的地址信息
    const newAddress = JSON.parse(options.body);

    // 从浏览器缓存中获取已保存的地址列表
    const savedAddresses = JSON.parse(localStorage.getItem("addresses")) || [];

    // 判断是否将该地址设为默认地址
    if (newAddress.isDefault) {
        // 取消其他地址的默认选项
        savedAddresses.forEach(address => {
            address.isDefault = false;
        });
    }

    const newId = uuid.v4();
    newAddress.id = newId;
    // 将新地址添加到地址列表
    savedAddresses.push(newAddress);

    // 将更新后的地址列表保存回浏览器缓存
    localStorage.setItem("addresses", JSON.stringify(savedAddresses));

    return Mock.mock({
        code: 200,
        message: "收货地址添加成功"
    });
});

// 模拟修改收货地址的接口
Mock.mock("/mock/address/updateAddress", "post", (options) => {
    // 从请求参数中获取要修改的地址信息
    const updatedAddress = JSON.parse(options.body);

    // 从浏览器缓存中获取已保存的地址列表
    const savedAddresses = JSON.parse(localStorage.getItem("addresses")) || [];

    // 查找要修改的地址在地址列表中的索引
    const index = savedAddresses.findIndex(address => address.id == updatedAddress.id);

    // 如果找到要修改的地址，则更新地址信息
    if (index !== -1) {
        // 判断是否将该地址设为默认地址
        if (updatedAddress.isDefault) {
            // 取消其他地址的默认选项
            savedAddresses.forEach(address => {
                address.isDefault = false;
            });
        }

        savedAddresses[index] = updatedAddress;

        // 将更新后的地址列表保存回浏览器缓存
        localStorage.setItem("addresses", JSON.stringify(savedAddresses));

        return Mock.mock({
            code: 200,
            message: "收货地址修改成功"
        });
    } else {
        // 如果未找到要修改的地址，返回错误信息
        return Mock.mock({
            code: 404,
            message: "未找到要修改的收货地址"
        });
    }
});


// 模拟更改默认收货地址的接口
Mock.mock("/mock/address/changeDefaultAddress", "post", (options) => {
    // 从请求参数中获取要设置为默认的地址信息
    const defaultAddress = JSON.parse(options.body);

    // 从浏览器缓存中获取已保存的地址列表
    const savedAddresses = JSON.parse(localStorage.getItem("addresses")) || [];

    // 查找要设为默认地址的地址在地址列表中的索引
    const index = savedAddresses.findIndex(address => address.id == defaultAddress.id);
  
    // 如果找到要设为默认地址的地址，则更新默认地址信息
    if (index !== -1) {
        // 取消其他地址的默认选项
        savedAddresses.forEach(address => {
            address.isDefault = false;
        });

        // 设置选定地址为默认地址
        savedAddresses[index].isDefault = true;

        // 将更新后的地址列表保存回浏览器缓存
        localStorage.setItem("addresses", JSON.stringify(savedAddresses));

        return Mock.mock({
            code: 200,
            message: "默认收货地址修改成功"
        });
    } else {
        // 如果未找到要设为默认地址的地址，返回错误信息
        return Mock.mock({
            code: 404,
            message: "未找到要设为默认的收货地址"
        });
    }
});

// 模拟删除收货地址的接口
Mock.mock("/mock/address/deleteAddress", "post", (options) => {
    // 从请求参数中获取要删除的地址信息
    const deletedAddress = JSON.parse(options.body);

    // 从浏览器缓存中获取已保存的地址列表
    let savedAddresses = JSON.parse(localStorage.getItem("addresses")) || [];

    // 查找要删除的地址在地址列表中的索引
    const index = savedAddresses.findIndex(address => address.id == deletedAddress.id);

    // 如果找到要删除的地址，则从地址列表中删除
    if (index !== -1) {
        savedAddresses.splice(index, 1);

        // 将更新后的地址列表保存回浏览器缓存
        localStorage.setItem("addresses", JSON.stringify(savedAddresses));

        return Mock.mock({
            code: 200,
            message: "收货地址删除成功"
        });
    } else {
        // 如果未找到要删除的地址，返回错误信息
        return Mock.mock({
            code: 404,
            message: "未找到要删除的收货地址"
        });
    }
});






// 模拟获取订单列表 API
Mock.mock("/mock/order/getOrders", "get", () => {
    // 从本地存储中获取已存在的订单列表
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];

    return Mock.mock({
        code: 200,
        message: "获取订单列表成功",
        orders: savedOrders
    });
});


// 模拟提交订单 API
Mock.mock("/mock/order/submitOrder", "post", (options) => {
    // 从请求参数中解析订单信息
    const orderInfo = JSON.parse(options.body);

    // 生成一个随机8位整数作为订单号
    const orderNumber = Math.floor(10000000 + Math.random() * 90000000);

    // 将订单号和未付款状态添加到订单信息中
    orderInfo.orderNumber = orderNumber;
    orderInfo.status = 1;

    // 从本地存储中获取已存在的订单或初始化一个空数组
    let savedOrders = JSON.parse(localStorage.getItem("orders")) || [];

    // 将新订单添加到订单列表中
    savedOrders.push(orderInfo);

    // 将更新后的订单列表保存回本地存储
    localStorage.setItem("orders", JSON.stringify(savedOrders));

    return Mock.mock({
        code: 200,
        message: "订单提交成功",
        orderNumber: orderNumber
    });
});

// 模拟订单付款 API
Mock.mock("/mock/order/payOrder", "post", (options) => {
    // 从请求参数中解析订单信息
    const { orderNumber } = JSON.parse(options.body);

    // 从本地存储中获取已存在的订单列表
    let savedOrders = JSON.parse(localStorage.getItem("orders")) || [];

    // 查找要付款的订单在订单列表中的索引
    const index = savedOrders.findIndex(order => order.orderNumber == orderNumber);

    // 如果找到要付款的订单，则将订单状态改为已付款
    if (index !== -1) {
        savedOrders[index].status = 2;

        // 将更新后的订单列表保存回本地存储
        localStorage.setItem("orders", JSON.stringify(savedOrders));

        return Mock.mock({
            code: 200,
            message: "订单付款成功"
        });
    } else {
        // 如果未找到要付款的订单，返回错误信息
        return Mock.mock({
            code: 404,
            message: "未找到要付款的订单"
        });
    }
});
