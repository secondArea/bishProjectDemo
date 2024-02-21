<template>

  <div class="addressmodel-wrap" v-show="controlAddressShow">
    <el-dialog
      :title="changAddressInfo.id?'请修改您的地址信息':'请添写您的收货地址'"
      :visible.sync="controlAddressShow"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close	= "false"
      :modal="false"
      @open="handleOpen"
      :width="dialogWidth"
    >
      <!-- :model="form" -->
      <el-form :rules="rules" :model="addressInfo" ref="ruleForm">
        <el-form-item label="收货人:" :label-width="formLabelWidth" prop="consignee">
          <el-input
            autocomplete="off"
            v-model="addressInfo.consignee"
            class="input-item"
          ></el-input>
        </el-form-item>
    
        <el-form-item label="联系电话:" :label-width="formLabelWidth" prop="phoneNum">
          <el-input
            autocomplete="off"
            v-model="addressInfo.phoneNum"
            class="input-item"
          ></el-input>
        </el-form-item>
    
        <el-form-item label="省份:" :label-width="formLabelWidth" prop="provinceId">
          <el-select
            placeholder="请选择省份"
            v-model="addressInfo.provinceId"
            @change="handleProvinceChange"
          >
            <el-option
              :label="province.name"
              :value="province.provinceId"
              v-for="province in provinces"
              :key="province.provinceId"
            ></el-option>
          </el-select>
    
          
        </el-form-item>

        <el-form-item label="城市:" :label-width="formLabelWidth" prop="cityId">
          <!-- 选择城市 -->
          <el-select
            placeholder="请选择城市"
            v-model="addressInfo.cityId"
            prop="cityId"
          >
            <el-option
              :label="city.cityName"
              :value="city.cityId"
              v-for="city in selectedProvince.cities"
              :key="city.cityId"
            ></el-option>
          </el-select>
        </el-form-item>
    
        <el-form-item label="详细地址:" :label-width="formLabelWidth" prop="userAddress">
          <el-input
            autocomplete="off"
            v-model="addressInfo.userAddress"
            class="input-item special"
          ></el-input>
        </el-form-item>
    
        <el-form-item label="是否设为默认地址:" :label-width="formLabelWidth" prop="isDefault">
          <el-checkbox v-model="addressInfo.isDefault"></el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- @click="dialogFormVisible = false" -->
        <el-button @click="btnConfirm('ruleForm')" type="primary">确 定</el-button>
        <el-button @click="btnCancel('ruleForm')">取 消</el-button>
        <!-- @click="dialogFormVisible = false" -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "AddressInfoModel",
  data() {
    return {
      addressInfo: {
        //收货人
        consignee: "",
        //联系电话
        phoneNum: "",
        // 是否设置默认地址
        isDefault: false,
        //区域id
        provinceId: "",
        //省份
        cityId: "",
        //详细地址
        userAddress: "",
      },
      //文本提示的长度
      formLabelWidth: window.innerWidth > 768 ? "130px" : "100px",
      //存储请求获取的区域代码
      regions: [],
      addresses:[],
      rules: {
        consignee: [{ required: true, message: "请输入收货人", trigger: "blur" }],
        phoneNum: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          {
            pattern: /^[0-9]*$/,
            message: "联系电话必须为数字",
            trigger: "blur",
          },
        ],
        provinceId: [{ required: true, message: "请选择省份", trigger: "change" }],
        cityId: [{ required: true, message: "请选择城市", trigger: "change" }],
        userAddress: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
      },
      dialogWidth: window.innerWidth > 768 ? '50%' : '85%',
    };
  },
  props: {
    controlAddressShow: Boolean,
    clickConfirm: Function,
  },
  computed: {
    // 如果是修改地址,则该项会有值
    ...mapState({
      changAddressInfo: (state) => state.trade.changAddress,
      provinces:(state) => state.trade.provinces
      
    }),
    selectedProvince() {
      return this.provinces.find(province => province.provinceId === this.addressInfo.provinceId) || { cities: [] };
    },
    // 区域id
    provinceId() {
      return this.addressInfo.provinceId;
    },

    responsiveWidth() {
      // 在此可以根据需要调整计算逻辑
      // 例如，可以使用 window.innerWidth 获取屏幕宽度
      return window.innerWidth * 0.8 + "px";
    },
  },
  mounted() {
    //初始化获取区域地址
    this.getAddressInfo();

    window.addEventListener('resize', this.handleResize);
  },
  destroyed() {
    // Remove event listener when component is destroyed
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      // Update dialog width on window resize
      this.dialogWidth = window.innerWidth > 768 ? '50%' : '85%';
      this.formLabelWidth = window.innerWidth > 768 ? "130px" : "100px"  
    },
    //阻止默认行为-滚动条的
    preventDefault(e){
      e.preventDefault();
    },
    //阻止默认行为-滚动条的
    preventDefaultForScrollKeys(e) {
      const keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
      if (keys[e.keyCode]) {
        this.preventDefault(e);
        return false;
      }
    },
    //禁用滚动条
    forbiddenScroll(){
      let supportsPassive = false;
        try {
          window.addEventListener("test", null, Object.defineProperty({}, "passive", {
              get: function () {
                supportsPassive = true;
              },
            })
          );
        } catch (e) {}
        let wheelOpt = supportsPassive ? { passive: false } : false;
        let wheelEvent = "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";
        window.addEventListener("DOMMouseScroll", this.preventDefault, false); // older FF
        window.addEventListener(wheelEvent, this.preventDefault, wheelOpt); // modern desktop
        window.addEventListener("touchmove", this.preventDefault, wheelOpt); // mobile
        window.addEventListener("keydown", this.preventDefaultForScrollKeys, false);
    },
    //启用滚动条
    enableScroll(){
        let supportsPassive = false;
        try {
          window.addEventListener("test", null, Object.defineProperty({}, "passive", {
              get: function () {
                supportsPassive = true;
              },
            })
          );
        } catch (e) {}
        let wheelOpt = supportsPassive ? { passive: false } : false;
        let wheelEvent = "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";
        // call this to Enable
        window.removeEventListener("DOMMouseScroll", this.preventDefault, false);
        window.removeEventListener(wheelEvent, this.preventDefault, wheelOpt);
        window.removeEventListener("touchmove", this.preventDefault, wheelOpt);
        window.removeEventListener("keydown", this.preventDefaultForScrollKeys, false);
    },
    //处理dialog打开
    handleOpen(){
      //禁用滚动条
      this.forbiddenScroll();
    },
    //取消按钮
    btnCancel(formName) {
      //启用滚动条
      this.resetForm(formName);
      this.enableScroll();
      //按下取消按钮,触发父类绑定的$on事件
      this.$emit("update:controlAddressShow", false);
    },
    //确认按钮
    async btnConfirm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
           
            if (this.changAddressInfo.id) {
              
              //存在,说明是修改地址信息
              const resultAddressInfo = this.addProvinceAndCityInfo(this.addressInfo, this.provinces);
              await this.$store.dispatch("updateAddressInfo", resultAddressInfo)
            } else {
              //说明是添加地址
              const resultAddressInfo = this.addProvinceAndCityInfo(this.addressInfo, this.provinces);
              
              await this.$store.dispatch("addAddressInfo", resultAddressInfo)
            }
            //启动滚动条
            this.resetForm(formName);
            this.enableScroll();
            //告诉父亲我操作了
            this.$emit("confirmAddress");
          } catch (error) {

          }

        } else {
          console.log('error submit!!');
          return false;
        }
      });

    },

    addProvinceAndCityInfo(inputObj, provincesList) {
      const provinceId = parseInt(inputObj.provinceId);
      const cityId = parseInt(inputObj.cityId);

      const province = provincesList.find(p => p.provinceId == provinceId);
      if (province) {
          const city = province.cities.find(c => c.cityId == cityId);
          if (city) {
              inputObj.provinceName = province.name;
              inputObj.cityName = city.cityName;
          }
      }

      return inputObj;
  },

    resetForm(formName) {
      // 重置表单
      this.$refs[formName].resetFields();
      // 清空表单数据
      this.addressInfo = {
        consignee: '',
        phoneNum: '',
        provinceId: '',
        cityId: '',
        userAddress: '',
        isDefault: false,
      };
    },
    //添加地址
    async addAddress() {
      this.addressInfo.isDefault = this.addressInfo.isDefault ? "1" : "0"; //是否勾选默认地址,勾选了则为1,没有则为0;
      //判断是否含有空
      try {
        //完整输入
        let result = await this.$API.reqSaveUserAddress(this.addressInfo);
        if (result.code == 200) {
          this.$message.success("添加地址信息成功!");
        } else {
          this.$message.warning("添加地址失败");
          
        }
      } catch (error) {
        this.$message.warning("请填写完整的值!");
      }
    },
    //修改地址
    async updateAddress() {
      this.addressInfo.isDefault = this.addressInfo.isDefault ? "1" : "0"; //是否勾选默认地址,勾选了则为1,没有则为0;
      let sendInfo = {
        ...this.addressInfo,
        userId: this.changAddressInfo.userId,
        id: this.changAddressInfo.id,
      };
      let result = await this.$API.reqUpdateUserAddress(sendInfo);
      if (result.code == 200) {
        this.$message.success("修改地址信息成功!");
      } else {
        this.$message.success("修改失败!");
        console.log(result);
      }
    },
    
    async getAddressInfo() {
      let result = await this.$store.dispatch("getAddressInfo")
      if (result.code == 200) {
        this.addresses = result.data;
      } else {

      }
    },

    handleProvinceChange() {
      // 省份切换时，将城市值重置为空或新省份的第一个城市
      this.addressInfo.cityId = this.selectedProvince.cities[0].cityId; // 或者设置为新省份的第一个城市的值
    },
  },
  watch: {
    //当为修改地址的时候,为执行到这里
    changAddressInfo: {
      handler() {
        let {
          consignee,
          phoneNum,
          isDefault,
          provinceId,
          cityId,
          userAddress,
          id,
        } = this.changAddressInfo;
        this.addressInfo = {
          consignee,
          phoneNum,
          isDefault,
          provinceId,
          cityId,
          userAddress,
          id
        };
      },
      deep: true,
    },

    responsiveWidth(newWidth) {
      this.dialogWidth = newWidth;
    },
    
  },
};
</script>

<style lang="less" scoped>
.addressmodel-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  .el-dialog__wrapper {
    width: 100%;
    height: 100%;
  }
  .input-item {
    width: 100%; /* 使输入框在移动端充满父容器 */
    height: 20px;
    &.special {
      width: 100%; /* 调整特殊输入框宽度 */
    }
  }
}

/* 添加移动端样式 */
@media screen and (max-width: 767px) {
  .addressmodel-wrap {
    .input-item {
      width: 100%;
      &.special {
        width: 100%;
      }
    }
  }

  .el-dialog{
    width: 85% !important;
  }
}
</style>
