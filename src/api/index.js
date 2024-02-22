
//假数据的ajax请求
import mockAjax from "./mockAjax.js";


/* 获取分类列表*/
export function reqBaseCategoryList() {
    return mockAjax.get("/product/getBaseCategoryList");
}

/* 获取轮播图 */
export function reqBannerList() {
    return mockAjax.get("/cms/banner");
}

export const reqLogin = (userLoginInfo) => { 
    return mockAjax.post("user/login", userLoginInfo);
}
/* token校验 */
export const loginCheck = () => {
    return mockAjax.get("user/checkToken");
}

/* 退出登录 */
export const loginOut = () => {
    return mockAjax.post("user/logout");
}



//购物车相关
export const reqGetShoppingCartData = () => {
    return mockAjax.get("cart/getShoppingCartData");
};

export const reqResetShoppingCart = () => {
    return mockAjax.post("cart/resetShoppingCart");
};

export const reqAddToCart = (productInfo) => {
    return mockAjax.post("cart/addToCart", productInfo);
};

export const reqRemoveFromCart = (productId) => {
    return mockAjax.post("cart/removeFromCart", productId);
};

export const reqRemoveSelectedFromCart = (selectedProductIds) => {
    return mockAjax.post("cart/removeSelectedFromCart", selectedProductIds);
};

export const reqIncreaseQuantity = (productId) => {
    return mockAjax.post("cart/increaseQuantity", productId);
};

export const reqDecreaseQuantity = (productId) => {
    return mockAjax.post("cart/decreaseQuantity", productId);
};

export const reqUpdateQuantity = (updateInfo) => {
    return mockAjax.post("cart/updateQuantity", updateInfo);
};

export const reqGetAddress = () => {
    return mockAjax.get("address/getAddress");
};


export const reqAddAddress = (newAddress) => {
    return mockAjax.post("address/addAddress", newAddress);
};

export const reqUpdateAddress = (updateAddress) => {
    return mockAjax.post("address/updateAddress", updateAddress);
};

export const reqChangeDefaultAddress = (defaultAddress) => {
    return mockAjax.post("address/changeDefaultAddress", defaultAddress);
};

export const reqDeletedAddress = (deletedAddress) => {
    return mockAjax.post("address/deleteAddress", deletedAddress);
};


export const reqGetOrders = () => {
    return mockAjax.get("order/getOrders");
};

export const reqSubmitOrder = (orderInfo) => {
    return mockAjax.post("order/submitOrder", orderInfo);
};

export const reqPayOrder = (orderInfo) => {
    return mockAjax.post("order/payOrder", orderInfo);
};






