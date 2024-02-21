import { Message } from "element-ui";
// 导入你的api模块
import {
    reqGetShoppingCartData,
    reqResetShoppingCart,
    reqAddToCart,
    reqRemoveFromCart,
    reqRemoveSelectedFromCart,
    reqIncreaseQuantity,
    reqDecreaseQuantity,
    reqUpdateQuantity,
} from "@/api";

const state = {
    shoppingCart: JSON.parse(localStorage.getItem("shoppingCart")) || []
};

const mutations = {
    RESET_SHOPPING_CART(state) {
        state.shoppingCart = [];
    },

    UPDATE_SHOPPING_CART(state, payload) {
        state.shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || []
    }
};



const actions = {
    async getShoppingCartData({ commit, dispatch }) {
        try {
            let result = await reqGetShoppingCartData();
            if (result.code === 200) {
                // 将购物车数据传递给 mutation
                commit("UPDATE_SHOPPING_CART");
                return "OK";
            } else {
                throw new Error("获取购物车数据失败");
            }
        } catch (error) {
            Message.error("获取购物车数据失败");
            return Promise.reject(error);
        }
    },

    async resetShoppingCart({ commit, dispatch }) {
        try {
            let result = await reqResetShoppingCart();
            if (result.code === 200) {
                commit("RESET_SHOPPING_CART");
                return "OK";
            } else {
                throw new Error("清空购物车失败");
            }
        } catch (error) {
            Message.error("清空购物车失败");
            return Promise.reject(error);
        }
    },

    async addToCart({ commit, dispatch }, productInfo) {
        try {
            let result = await reqAddToCart(productInfo);
            if (result.code === 200) {
                // 将商品信息传递给 mutation
                commit("UPDATE_SHOPPING_CART");
                return "OK";
            } else {
                // Message.error(result.message);
                throw new Error(result.message);
            }
        } catch (error) {
            Message.error(error);
            return Promise.reject(error);
        }
    },

    async removeFromCart({ commit, dispatch }, productId) {
        try {
            let result = await reqRemoveFromCart(productId);
            if (result.code === 200) {
                // 将商品ID传递给 mutation
                commit("UPDATE_SHOPPING_CART");
                return "OK";
            } else {
                throw new Error("从购物车移除商品失败");
            }
        } catch (error) {
            Message.error("从购物车移除商品失败");
            return Promise.reject(error);
        }
    },

    async removeSelectedFromCart({ commit, dispatch }, selectedProductIds) {
        try {
            let result = await reqRemoveSelectedFromCart(selectedProductIds);
            if (result.code === 200) {
                // 将商品ID传递给 mutation
                commit("UPDATE_SHOPPING_CART");
                return "OK";
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            Message.error(error);
            return Promise.reject(error);
        }
    },

    async increaseQuantity({ commit, dispatch }, productId) {
        try {
            let result = await reqIncreaseQuantity(productId);
            if (result.code === 200) {
                // 将商品ID传递给 mutation
                commit("UPDATE_SHOPPING_CART");
                return "OK";
            } else {
                throw new Error("增加商品数量失败");
            }
        } catch (error) {
            Message.error("增加商品数量失败");
            return Promise.reject(error);
        }
    },

    async decreaseQuantity({ commit, dispatch }, productId) {
        try {
            let result = await reqDecreaseQuantity(productId);
            if (result.code === 200) {
                commit("UPDATE_SHOPPING_CART");
                return "OK";
            } else {
                throw new Error("减少商品数量失败");
            }
        } catch (error) {
            Message.error("减少商品数量失败");
            return Promise.reject(error);
        }
    },

    async updateQuantity({ commit, dispatch }, updateInfo) {
        try {
            let result = await reqUpdateQuantity(updateInfo);
            if (result.code === 200) {
                // 将更新信息传递给 mutation
                commit("UPDATE_SHOPPING_CART");
                return "OK";
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            Message.error(error);
            return Promise.reject(error);
        }
    },
};
const getters = {
    // 可以添加一些计算属性，如计算购物车总价等
};

export default {
    state,
    mutations,
    actions,
    getters
};
