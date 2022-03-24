<template>
  <div class="login">
    <!-- 登录框div -->
    <div class="login-container">
      <!-- 登录框顶部logo -->
      <div class="head">
        <img src="../assets/images/login.jpg" alt />
        <div class="name">
          <span class="title">小宝后台</span>
          <span class="tips">vue3.0后台管理系统</span>
        </div>
      </div>

      <el-form
        class="login-form"
        label-position="top"
        :model="ruleForm"
        :rules="rules"
        ref="loginForm"
      >
        <el-form-item label="账号" prop="userAccount">
          <el-input
            type="text"
            size="large"
            v-model.trim="ruleForm.userAccount"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item class="inpt" label="密码" prop="userPassword">
          <el-input
            size="large"
            type="password"
            v-model.trim="ruleForm.userPassword"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item>
          <div style="color: #333">
            登录表示您已同意
            <a>《服务条款》</a>
          </div>
          <el-button style="width: 100%" type="primary" @click="submitForm">立即登录</el-button>
        </el-form-item>
        <el-checkbox v-model="checked" @change="!checked">下次自动登录</el-checkbox>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios'
// 密码需要 md5 加密，服务端是解密 md5 的形式
import md5 from 'js-md5'
import { ref, reactive, toRefs } from "vue"
import { localSet } from '../utils'
export default {
  name: 'Login',
  setup() {
    let loginForm = ref(null)
    // 收集并校验信息
    let state = reactive({
      ruleForm: {
        userAccount: '',
        userPassword: '',
      },
      checked: true,
      rules: {
        userAccount: [
          { required: 'true', message: '账户不能为空', trigger: 'blur' }
        ],
        userPassword: [
          { required: 'true', message: '密码6-13位', trigger: 'blur', min: 6, max: 13 }
        ],
      }
    })
    console.log('login');
    // 表单提交方法
    const submitForm = async () => {
      loginForm.value.validate((valid) => {
        // valid 是一个布尔值，表示表单是否通过了上面 rules 的规则
        if (valid) {
          // /adminUser/login 登录接口路径
          axios.post('/adminUser/login', {
            // 这里名字要跟后端一致
            userName: state.ruleForm.userAccount || '',
            passwordMd5: md5(state.ruleForm.userPassword)
          }).then(res => {
            // 返回的时候会有一个 token，这个令牌就是我们后续去请求别的接口时要带上的，否则会报错，非管理员。
            // 这里我们将其存储到 localStorage 里面
            localSet('token', res)
            // 此处登录完成之后，需要刷新页面，否则 axios.js 文件内，axios.defaults.headers 是拿不到最新的 token 信息的。会导致停留在登录页面
            window.location.href = '/'
          })
        } else {
          console.log('error submit!!')
          return false;
        }

        // if (valid) {
        //   axios.post('/adminUser/login', {
        //     userName: state.ruleForm.userAccount || '',
        //     passwordMd5: md5(state.ruleForm.userPassword)
        //   }).then(res => {
        //     localSet('token', res)
        //     window.location.href = '/'
        //   })
        // } else {
        //   console.log('error submit!!')
        //   return false;
        // }
      })
    }

    return {
      ...toRefs(state),
      loginForm,
      submitForm,
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: #fff;
  .login-container {
    width: 420px;
    height: 480px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 21px 41px 0px rgba(0, 0, 0, 0.2);
    .head {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 40px 0 20px 0;
      img {
        height: 100px;
      }
      .name {
        display: flex;
        flex-direction: column;
        .title {
          color: #1baeae;
          font-size: 28px;
          font-weight: bold;
        }
        .tips {
          font-size: 12px;
          text-align: center;
        }
      }
    }
    .login-form {
      width: 70%;
      margin: 0 auto;
      .el-form-item {
        margin-bottom: 10px;
        .el-button {
          height: 40px;
        }
      }
    }
  }
}
</style>