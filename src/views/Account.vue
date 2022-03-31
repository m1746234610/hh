<template>
  <el-card class="account-containe">
    <el-form :model="nameForm" :rules="rules" ref="nameRef" label-width="100px">
      <el-form-item label="登录名" prop="account">
        <el-input style="width:250px" v-model="nameForm.account" />
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input style="width:250px" v-model="nameForm.name" />
      </el-form-item>
      <el-form-item>
        <el-button type="danger" size="large" @click="submitName">确认修改</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card class="account-containe">
    <el-form :model="passForm" :rules="rules" ref="passRef" label-width="100px">
      <el-form-item label="原密码" prop="oldpass">
        <el-input style="width:250px" type="password" v-model="passForm.oldpass" />
      </el-form-item>
      <el-form-item label="新密码" prop="newpass">
        <el-input style="width:250px" type="password" v-model="passForm.newpass" />
      </el-form-item>
      <el-form-item>
        <el-button type="danger" size="large" @click="submitPass">确认修改</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { ref, reactive, toRefs, onMounted } from "vue"
import { useRouter } from "vue-router"
import { localRemove } from "../utils"
import axios from "@/utils/axios"
import md5 from 'js-md5'
export default {
  name: 'Account',
  setup() {
    const nameRef = ref(null)
    const passRef = ref(null)
    const router = useRouter()
    const state = reactive({
      user: null,
      nameForm: {
        account: '',
        name: '',
      },
      passForm: {
        oldpass: '',
        newpass: ''
      },
      rules: {
        account: [
          { required: true, message: '登录名不能为空', trigger: ['change'] }
        ],
        name: [
          { required: true, message: '呢称不能为空', trigger: ['change'] }
        ],
        oldpass: [
          { required: true, message: '原密码不能为空', trigger: ['change'] }
        ],
        newpass: [
          { required: true, message: '新密码不能为空', trigger: ['change'] }
        ]
      },
    })

    // 初始加载用户信息
    onMounted(() => {
      axios.get('/adminUser/profile').then(res => {
        state.user = res
        state.nameForm.account = res.loginUserName
        state.nameForm.name = res.nickName
      })
    })

    // 提交昵称登录名修改
    const submitName = () => {
      nameRef.value.validate((vaild) => {
        if (vaild) {
          axios.put('/adminUser/name', {
            params: {
              loginUserName: state.nameForm.account,
              nickName: state.nameForm.name,
            }
          }).then(() => {
            ElMessage.success('修改成功')
            localRemove('token')
            router.push({ path: '/login' })
          })
        }
      })
    }

    // 提交密码修改
    const submitPass = () => {
      passRef.value.validate((vaild) => {
        if (vaild) {
          console.log(123123);
          axios.put('/adminUser/password', {
            params: {
              originalPassword: md5(state.passForm.oldpass),
              newPassword: md5(state.passForm.newpass),
            }
          }).then(() => {
            ElMessage.success('修改成功')
            localRemove('token')
            router.push({ path: '/login' })
          })
        }
      })
    }

    return {
      nameRef,
      passRef,
      ...toRefs(state),
      submitName,
      submitPass,
    }
  }
}
</script>

<style scoped>
.account-containe {
  margin: 5px 0px 15px 0px;
}
</style>