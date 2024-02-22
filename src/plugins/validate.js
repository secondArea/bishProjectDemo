import VeeValidate from "vee-validate";
import zh_CN from "vee-validate/dist/locale/zh_CN"
import Vue from "vue"

// 解决validate和element-ui的冲突
Vue.use(VeeValidate,{
    fieldsBagName:'fieldBags',
});

VeeValidate.Validator.localize("zh_CN", {
    messages: {
        ...zh_CN.messages,
 
        is: (field) => field + "必须与密码相同"
    },
    attributes: {
        phone: "手机号",
        code: "验证码",
        password:'密码',
        password2: "确认密码",
        isCheckRead: "协议",
    }
})



VeeValidate.Validator.extend('agree', {
    validate: value => {
        return value
    },
    getMessage: field => field + '必须同意' 
})