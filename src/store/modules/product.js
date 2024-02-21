const generateProducts = () => {
    const products = JSON.parse(localStorage.getItem("products"))

    if (!products) {
        const dummyData = [];
        for (let i = 1; i <= 18; i++) {
            dummyData.push({
                id: i,
                name: `手机 ${i}`,
                price: Math.floor(Math.random() * (100 - 10 + 1) + 10), 
                description: `Description ${i}`,
                inventory: Math.floor(Math.random() * 100) + 1,
            });
        }
        localStorage.setItem("products", JSON.stringify(dummyData));
        return dummyData
    }

    return products
}
    

const state = {
    products:generateProducts()
}
const mutations = {
    updateProductInventory(state, payload) {
        const { productId, quantity } = payload;
        const product = state.products.find(product => product.id === productId);
        if (product && product.inventory >= quantity) {
            product.inventory -= quantity;
        }
    },
}
const actions = {
    updateCart({ commit, state }, payload) {
        const { productId, quantity, actionType } = payload;
        const product = state.products.find(product => product.id === productId);

        if (!product || quantity <= 0) {
            console.error("无效的操作");
            return;
        }

        if (actionType === "add" && product.inventory >= quantity) {
            
            commit("updateProductInventory", { productId, quantity });

            

        } else if (actionType === "remove") {
            
            commit("updateProductInventory", { productId, quantity: -quantity });

           
        }

       
        localStorage.setItem("products", JSON.stringify(state.products));
    },
};
const getter = {

}

export default {
    state,
    mutations,
    actions,
    getter
}