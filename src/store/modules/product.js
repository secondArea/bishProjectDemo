const generateProducts = () =>{
    const dummyData = [];
    for (let i = 1; i <= 18; i++) {
        dummyData.push({
            id: i,
            name: `手机 ${i}`,
            price: parseFloat((Math.random() * (100 - 10) + 10).toFixed(2)),
            description: `Description ${i}`,
            inventory: Math.floor(Math.random() * 100) + 1,
        });
    }

    return dummyData
}

const state = {
    products:generateProducts()
}
const mutations = {
   
}
const actions = {
   
}
const getter = {

}

export default {
    state,
    mutations,
    actions,
    getter
}