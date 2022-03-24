<template>
  <div class="layout">
    <el-container v-if="showMenu" class="container">
      <!-- 左侧边栏 -->
      <el-aside class="aside">
        <div class="head">
          <img src="./assets/images/logo.jpg" alt="logo" />
          <span>小宝后台</span>
        </div>

        <el-menu
          background-color="#222832"
          text-color="#fff"
          :router="true"
          :default-active="currentPath"
          :default-openeds="defaultOpen"
        >
          <!-- 多层 -->
          <el-sub-menu index="1">
            <template #title>
              <span>一级菜单</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/">
                <i class="iconfont iconfont-position icon-zhuye" />
                <span>首页</span>
              </el-menu-item>
              <el-menu-item index="/add">
                <i class="iconfont icon-tianjia" />
                <span>添加</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>

          <!-- 添加轮播图配置 -->
          <el-sub-menu index="2">
            <template #title>
              <span>首页配置</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/swiper">
                <i class="iconfont icon-lunboxiaoguo" />
                <span>轮播图</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- 右边内容 -->
      <el-container class="content">
        <Header />
        <div class="main">
          <router-view />
        </div>
        <Footer />
      </el-container>
    </el-container>

    <el-container v-else class="container">
      <router-view />
    </el-container>
  </div>
</template>

<script>
import Header from "./components/Header.vue"
import Footer from "./components/Footer.vue"
import { ref, reactive, toRefs, nextTick } from "vue"
import { useRouter } from "vue-router"
import { localGet, pathMap } from "./utils"
const ENV = import.meta.env
export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  setup() {
    const noMenu = ['login']
    const router = useRouter()
    const state = reactive({
      showMenu: true,
      currentPath: '/',
      defaultOpen: ['1', '2'],
    })


    nextTick(() => {
      //** 组件在刷新后会重新加载，如果url路径不变，路由守卫就不会触发
      if (location.hash.split('/')[1] === 'login') {
        // 防止菜单栏和登录组件一起出现
        state.showMenu = false
      }

      // url改变后，导航栏对应子菜单项高亮
      state.currentPath = location.hash.split('/')[1]
    })


    // 这种写法会晚，因为组件都加载出来了，在判断就晚了
    // state.showMenu = noMenu.includes(location.hash.split('/')[1]) === true ? false : true

    // 跳转之前，判断是否登录
    router.beforeEach((to, from, next) => {
      // 要进入登录页面
      if (to.path === '/login') {
        state.showMenu = false
        next()
      } else {
        // 进入其他路由页面要进行鉴权
        if (localGet('token')) {
          state.showMenu = true
          // 本地有token，鉴权通过
          next()
        } else {
          state.showMenu = false
          // 没有登录，需要登录
          router.push({ path: '/login' })
        }
      }
      state.currentPath = to.path
    })

    // 成功切换路由后，更新网页title
    router.afterEach((to) => {
      document.title = pathMap[to.name]
    })



    return {
      ...toRefs(state)
    }
  }
}
</script>

<style lang="less">
.layout {
  min-height: 100vh;
  background-color: #fff;
  .container {
    min-height: 100vh;
    // 左侧边栏
    .aside {
      width: 200px !important;
      background-color: #222832;
      // 导航栏--头部
      .head {
        display: flex;
        align-items: center;
        justify-content: space-around;
        img {
          width: 50px;
        }
        span {
          cursor: default;
          font-size: 20px;
          color: #ffffff;
        }
      }
      // 导航栏--路由
      .el-menu {
        border-right: none !important;
        .el-submenu {
          border-top: 1px solid hsla(0, 0%, 100%, 0.05);
          border-bottom: 1px solid rgba(0, 0, 0, 0.2);
          &:first-child {
            border-top: none;
          }
          &[class^="el-icon-"] {
            vertical-align: -1px !important;
          }
        }
        .el-menu-item {
          position: relative;
        }
      }
    }

    // 右边
    .content {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
      .main {
        height: calc(100vh - 100px);
        overflow: auto;
        padding: 10px;
      }
    }
  }
}
</style>

<style lang="less" scoped>
.iconfont-position {
  margin-right: 5px;
  position: absolute;
  top: -1px;
}
.iconfont + span {
  margin-left: 5px;
}
.iconfont-position + span {
  margin-left: 21px;
}
</style>