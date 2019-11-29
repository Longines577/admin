<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">跃迁系统</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.userName" placeholder="请输入用户名">
            <el-button slot="prepend" icon="el-icon-user"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="ruleForm.password"
            @keyup.enter.native="submitForm('ruleForm')"
          >
            <el-button slot="prepend" icon="el-icon-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
        <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
      </el-form>
    </div>
        <vue-particles color="#fff" :particleOpacity="0.7" :particlesNumber="30" shapeType="star" :particleSize="5" linesColor="#fff" :linesWidth="2" :lineLinked="true" :lineOpacity="0.4" :linesDistance="150" :moveSpeed="3" :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push"></vue-particles>
  </div>
</template>

<script>

import { logined } from "../api/api";
export default {
  data: function() {
    return {
      ruleForm: {
        userName: "",
        password: ""
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      var obj = this.ruleForm;
      console.log(obj)
      logined(obj).then(res => {
        console.log(res)
        if (res.code === 30000) {
          sessionStorage.setItem("userName", obj.userName);
          sessionStorage.setItem("password", obj.password);
          sessionStorage.setItem('userInfo', JSON.stringify(res.result))
          sessionStorage.setItem('token',res.result.token)
          if(res.result.menuList==null||res.result.menuList==''){
            this.$router.push("/403");
          }else{
           
            this.$router.push("/");
          }
          
        }else{
           this.$message.warning(res.message)
        }
      });
      // this.$refs[formName].validate((valid) => {
      //     if (valid) {
      //         console.log(this.ruleForm)
          
      //         sessionStorage.setItem('userName',this.ruleForm.userName);
      //         sessionStorage.setItem('password',this.ruleForm.password);
      //         this.$router.push('/');
      //     } else {
      //         console.log('error submit!!');
      //         return false;
      //     }
      // });
      // var _this = this;

      // _this.$axios.post(URL.Login,obj,
      // {
      //     transformRequest:[
      //         function(data){
      //             return JSON.stringify(obj)
      //         }
      //     ]
      // }
      // )
      //         .then(res =>{
      //             // console.log(res)
      //             if(res.data.code == 30000){
      //                 console.log(res.data.result.token)
      //                 sessionStorage.setItem('userName',obj.userName)
      //                 sessionStorage.setItem('password',obj.password)
      //                 sessionStorage.setItem('token',res.data.result.token)

      //                 _this.$router.push('/');
      //                 console.log('end')
      //             }
      //         })
      //         .catch(error=>{
      //             console.log(error)
      //         })
    }
  }
};
</script>

<style lang="scss" scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/img/bg.jpg) no-repeat center;
  background-size: cover;
  #particles-js {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  position: relative;
  padding: 30px 30px;
  z-index: 999;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>