<template>
  <div class="header">
    <div class="left">
      <i v-if="hasBack" class="iconfont icon-fanhui" @click="back" />
      <span>{{ name }}</span>
    </div>
    <div class="right">
      <el-popover placement="bottom" :width="200" trigger="hover" popper-class="popper-user-box">
        <template #reference>
          <div class="author">
            <i class="iconfont icon-yonghu"></i>
            {{ userInfo && userInfo.nickName || '' }}
            <i class="iconfont icon-tabxiala"></i>
          </div>
        </template>
        <div class="nickname">
          <p>用户名:{{ userInfo && userInfo.nickName || '' }}</p>
          <p>账号:{{ userInfo && userInfo.loginUserName || '' }}</p>
          <el-tag size="small" effect="dark" class="logout" @click="logout">退出</el-tag>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router"
import { ref, reactive, toRefs, onMounted } from "vue"
import { pathMap, localRemove } from "@/utils"
import axios from "@/utils/axios"
export default {
  name: 'Header',
  setup() {
    let visible = ref(false)
    // 获取路由实例
    const router = useRouter()
    const state = reactive({
      name: '首页',
      userInfo: null,
      hasBack: false, // 是否展示返回icon
    })

    // 初始化执行方法
    onMounted(() => {
      const pathname = window.location.hash.split('/')[1] || ''
      if (!['login'].includes(pathname)) {
        getUserInfo()
      }
    })
    // 获取用户信息
    const getUserInfo = async () => {
      const userInfo = await axios.get('/adminUser/profile')
      state.userInfo = userInfo
    }

    // 推出登录
    const logout = () => {
      // 向服务器发送一个请求，用来告知用户以推出登录
      axios.delete('/logout').then(res => {
        // 将本地token信息删除
        localRemove('token')
        // 退出登录后，跳转到登录页面
        router.push({ path: '/login' })
      })

    }

    // 成功切换路由后，更新header左侧信息
    router.afterEach((to) => {
      state.name = pathMap[to.name] || '默认'
      // level2 和 level3 需要展示返回icon
      state.hasBack = ['level2', 'level3','order_detail'].includes(to.name)
    })
    state.name = pathMap[location.hash.split('/')[1]] || '默认'

    const back = () => {
      router.back()
    }
    return {
      ...toRefs(state),
      visible,
      logout,
      back
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  width: calc(100% - 200px) ;
  position: fixed;
  top: 0;
  right: 0;
  height: 50px;
  border-bottom: 1px solid #e9e9e9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
  background: #fff;
  z-index: 9999;
  .left {
    font-weight: bold;
    .iconfont {
      margin-right: 20px;
      cursor: pointer;
    }
  }
  .right {
    .author {
      cursor: pointer;
      .iconfont {
        margin: 0 3px;
      }
    }
  }
}
</style>
<style lang="less">
.popper-user-box {
  background: url("../assets/images/loginBack.jpg") 50% 50% no-repeat !important;
  background-size: cover !important;
  border-radius: 0 !important;
  .nickname {
    position: relative;
    color: red;
    font-weight: bold;
    .logout {
      position: absolute;
      right: 0;
      top: 5px;
      cursor: pointer;
    }
  }
}
</style>