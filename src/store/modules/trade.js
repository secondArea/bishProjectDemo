import {
    reqTradeInfo,
    reqGetAddress,
    reqAddressInfo,
    reqAddAddress,
    reqUpdateAddress,
    reqChangeDefaultAddress,
    reqDeletedAddress
} from "@/api"
import {Message} from "element-ui"
const state = {
    // tradeInfo:{},
    addressInfo:JSON.parse(localStorage.getItem("addresses")) || [],
    changAddress:{},
    provinces:[
        {
          provinceId: 1,
          name: '海南省',
          cities: [
            { cityId: 11, cityName: '海口市' },
            { cityId: 12, cityName: '三亚市' },
            { cityId: 13, cityName: '三沙市' }
          ]
        },
        {
          provinceId: 2,
          name: '广东省',
          cities: [
            { cityId: 21, cityName: '广州市' },
            { cityId: 22, cityName: '深圳市' },
            { cityId: 23, cityName: '佛山市' }
          ]
        },
        {
          provinceId: 3,
          name: '广西壮族自治区',
          cities: [
            { cityId: 31, cityName: '南宁市' },
            { cityId: 32, cityName: '柳州市' },
            { cityId: 33, cityName: '桂林市' }
          ]
        }
    ]
}
const mutations = {
    RECEIVE_CHANGEADDRESSINFO(state,value){
        state.changAddress = value;
    },
    RECEIVE_ADDRESSINFO(state,value){
        state.addressInfo = value;
    },
    GET_ADDTRESS_INFO(state){
        state.addressInfo = JSON.parse(localStorage.getItem("addresses")) || []
    },
}
const actions = {
    //用户修改地址信息暂存
    setChangeAddressInfo({commit},value){
        commit("RECEIVE_CHANGEADDRESSINFO",value);
    },
    //获取商品信息
    async getAddressInfo({commit}){
        let addressInfo = await reqGetAddress();//获取地址信息
        if(addressInfo.code == 200){
            // result.data.userAddressList = addressInfo.data || fakeAddress;空对象空数组也是真啊!
            commit("RECEIVE_ADDRESSINFO",addressInfo.data);
            return addressInfo.data
        }else{
            Message.error(addressInfo.message)

        }
    },

    async addAddressInfo({commit},addressInfo){
        let result = await reqAddAddress(addressInfo);
        if(result.code == 200){
            Message.success('添加地址信息成功');
            commit("GET_ADDTRESS_INFO");
        }else{
            Message.error(result.message)

        }
    },


    async changeDefaultAddress({commit},defaultAddress){
        let result = await reqChangeDefaultAddress(defaultAddress);
        if(result.code == 200){
            Message.success('修改默认地址成功');
            commit("GET_ADDTRESS_INFO");
        }else{
            Message.error(result.message)

        }
    },

    async updateAddressInfo({commit},updatedAddress){
        let result = await reqUpdateAddress(updatedAddress);
        if(result.code == 200){
            Message.success('修改地址信息成功');
            commit("GET_ADDTRESS_INFO");
        }else{
            Message.error(result.message)

        }
    },

    async deletedAddress({commit},deletedAddress){
        let result = await reqDeletedAddress(deletedAddress);
        if(result.code == 200){
            Message.success('删除地址成功');
            commit("GET_ADDTRESS_INFO");
        }else{
            Message.error(result.message)

        }
    },

}
const getters = {
    // 用户购物车商品信息
    // detailArrayList(state){
    //     return state.tradeInfo.detailArrayList || [];
    // },
    // 用户地址信息
    userAddressList(state){
        return state.addressInfo || [];
    }
}
export default {
    state,
    mutations,
    actions,
    getters
}