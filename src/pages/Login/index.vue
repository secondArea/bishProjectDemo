<template>
  <div class="login-container">
    <!-- 登录 -->
    <div class="login-wrap">
      <div class="login">
        <div class="loginform">
          <ul class="tab clearFix">
            <li>
              <a href="##" class="current">账户登录</a>
            </li>
          </ul>

          <div class="content">
            <form action="##">
              <div class="input-text clearFix">
                <span></span>

                <input type="text" placeholder="用户名" v-model="username" name="用户名"
    v-validate="{ required: true }" :class="{ invalid: errors.has('用户名') }">
  <div class="error-msg">{{ errors.first("用户名") }}</div>
              </div>
              <div class="input-text clearFix"> 
                <span class="pwd"></span>
                <!-- <input type="text" placeholder="请输入密码" v-model="password"> -->
                <input type="password" autocomplete placeholder="请输入密码" v-model="password"
                 name="密码" v-validate="{required:true,min:6}" :class="{invalid:errors.has('密码')}">
                 <div class="error-msg">{{errors.first("密码")}}</div>
              </div>
              <div class="setting clearFix">
                <label class="checkbox inline">
                  <input name="m1" type="checkbox" value="2" v-model="isKeepSecret" >
                  自动登录
                </label>
 
              </div>
              <el-button  type="primary" class="btn" @click.prevent="login">登&nbsp;&nbsp;录</el-button>
            </form>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data(){
      return {
        username:"",
        password:"",
        // 是否保存信息
        isKeepSecret:false
      }
    },
    mounted(){
   
      this.initInfo();
    },
   
    methods:{
      // 登录
      async login(){
        let success = await this.$validator.validateAll();
        if(!success){
          //未通过表单验证
          return;
        }
        let { username,password,isKeepSecret} = this;
        if(username && password){
          //发送请求
          try {
            //不管有没有勾选,都设置为了存储,
            await this.$store.dispatch("login",{username,password,isKeepSecret});
            // alert("登录成功!");
            this.$message.success("登录成功!");
            //如果之前有跳转,则跳转到之前页面,否者跳转到主页
            let redirect = this.$route.query.redirect || "/";
            this.$router.push(redirect);
          } catch (error) {
             this.$message.error(error);
          }
        } 
      },
      // 初始化信息
      async initInfo(){
        let result = JSON.parse(sessionStorage.getItem("AUTOLOGIN"));
        if(result){
          const loading = this.$loading({
            lock: true,
            text: '自动登录中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.3)'
          });
          //结构
          let {username,password} = result;
          //发送请求
          try {
            //不管有没有勾选,都设置为了存储,
            await this.$store.dispatch("login",{username,password});
            // alert("登录成功!");
            this.$message.success("登录成功!");
            //如果之前有跳转,则跳转到之前页面,否者跳转到主页
            let redirect = this.$route.query.redirect || "/";
            this.$router.push(redirect);
          } catch (error) {
             this.$message.error(error);
          }
          //关闭遮罩
          loading.close();
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .login-container {
    .login-wrap {

      display: flex;
      justify-content: center;
      .login {
        margin: 0 auto;
      }

      .loginform {
        max-width: 420px;
        height: 406px;
        box-sizing: border-box;
        background: #fff;

        top: 45px;
        position: relative;
        padding: 20px;

        .tab {

          li {
            width: 100%;
            text-align: center;

            a {
              width: 100%;
              display: block;
              height: 50px;
              line-height: 50px;
              font-size: 20px;
              font-weight: 700;
              color: #333;
              border: 1px solid #ddd;
              box-sizing: border-box;
              text-decoration: none;

            }

            .current {
              border-top-color: #28a3ef;
              color: var(--primary-color);
            }
          }
        }

        .content {
          max-width: 380px;
          box-sizing: border-box;
          border: 1px solid #ddd;
          border-top: none;
          padding: 18px;
          .error-msg{
            color: red;
          }
          form {
            margin: 15px 0 18px 0;
            font-size: 12px;
            line-height: 18px;

            .input-text {
              margin-bottom: 16px;

              span {
                float: left;
                width: 37px;
                height: 32px;
                border: 1px solid #ccc;
                background: url('@/assets/image/icons.png') no-repeat -10px -201px;
                box-sizing: border-box;
                border-radius: 2px 0 0 2px;
              }

              .pwd {
                background-position: -72px -201px;
              }

              input {
                max-width: 302px;
                height: 32px;
                box-sizing: border-box;
                border: 1px solid #ccc;
                border-left: none;
                float: left;
                padding-top: 6px;
                padding-bottom: 6px;
                font-size: 14px;
                line-height: 22px;
                padding-right: 8px;
                padding-left: 8px;

                border-radius: 0 2px 2px 0;
                outline: none;
              }
            }

            .setting {
              label {
                float: left;
                vertical-align: middle;
                input{
                  vertical-align: middle
                }
              }

              .forget {
                float: right;
              }
            }

            .btn {
              width: 100%;
              height: 36px;
              margin-top: 25px;
            }
          }

          .call {
            margin-top: 30px;

            ul {
              float: left;

              li {
                float: left;
                margin-right: 5px;
              }
            }

            .register {
              float: right;
              font-size: 15px;
              line-height: 38px;
            }

            .register:hover {
              color: #4cb9fc;
              text-decoration: underline;
            }
          }

        }
      }
    }

    

  }
</style>