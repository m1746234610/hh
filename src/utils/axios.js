import axios from "axios";
import router from "@/router/index"
import config from "~/config"
// import { ElMessage } from 'element-plus'
import { localGet } from './index.js'

// 这边由于后端没有区分测试和正式，姑且都写成一个接口。
axios.defaults.baseURL = config[import.meta.env.MODE]
// 携带 cookie，对目前的项目没有什么作用，因为我们是 token 鉴权
axios.defaults.withCredentials = true

/**
 * 设置请求头信息，一般是用来校验身份的
 * 
 * 告诉服务器，这是一个ajax（异步）请求，如果'X-Requested-With'值为null，就表示这是一个普通（同步，一般是表单提交）请求。
 * headers['X-Requested-With'] = 'XMLHttpRequest'
 * 
 * 添加token校验信息
 * headers['token'] =  localStorage.getItem('token') || ''
 * 
 * 默认 post 请求，使用 application/json 形式
 * headers.post['Content-Type'] = 'application/json'
 * 
 */
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['token'] = localGet('token') || ''
axios.defaults.headers.post['Content-Type'] = 'application/json'

// 请求拦截器，内部根据返回值，重新组装，统一管理
axios.interceptors.response.use(res => {
  if (typeof res.data !== 'object') {
    ElMessage.error('服务器异常')
    return Promise.reject(res)
  }
  if (res.data.resultCode != 200) {
    if (res.data.message) ElMessage.error(res.data.message)

    // 说明超时，进入登录页面
    if (res.resultCode == 419) {
      router.push({ path: '/login' })
    }

    return Promise.reject(res.data)
  }

  return res.data.data
})

export default axios


// export default axios.create({
//   baseURL: config[import.meta.env.MDDE],
//   withCredentials: true,
//   headers: {
//     'X-Requested-With': 'XMLHttpRequest',
//     'token': localStorage.getItem('token') || ''
//   }
// })