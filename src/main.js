import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/iconfont.css'

const app = createApp(App)

// 全局方法
app.config.globalProperties.$bus = app

// 翻页回到顶部
app.config.globalProperties.goTop = function () {
  const main = document.querySelector('.main')
  main.scrollTop = 0
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
}

// 过滤器
const orderStatus = {
  0: '待支付',
  1: '已支付',
  2: '配货完成',
  3: '出库成功',
  4: '交易成功',
  '-1': '手动关闭',
  '-2': '超时关闭',
  '-3': '商家关闭'
}

app.config.globalProperties.$filters = {
  // 返回统一样式url
  prefix(url) {
    if (url.startsWith('http')) {
      return url
    } else {
      url = `http://backend-api-02.newbee.ltd${url}`
    }
  },

  // 返回当前订单状态
  orderMap(status) {
    return orderStatus[status] || '未知状态'
  }
}


app.use(router)
  .use(store)
console.log(app);

app.mount('#app')