import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/iconfont.css'

const app = createApp(App)

// 全局方法
app.config.globalProperties.$bus = app

app.config.globalProperties.$filters = {
  prefix(url) {
    if (url.startsWith('http')) {
      return url
    } else {
      url = `http://backend-api-02.newbee.ltd${url}`
    }
  }
}

app.config.globalProperties.$user = 123
app.config.globalProperties.goTop = function () {
  const main = document.querySelector('.main')
  main.scrollTop = 0
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
}

app.use(router)

app.mount('#app')