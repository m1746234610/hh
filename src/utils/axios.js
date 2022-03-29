import axios from "axios";
import router from "@/router/index"
import config from "~/config"
// import { ElMessage } from 'element-plus'
import { localGet } from './index.js'

/**
 * 1. 这边由于后端没有区分测试和正式，姑且都写成一个接口。
 * 
 * 2. 携带 cookie，对目前的项目没有什么作用，因为我们是 token 鉴权
 * 
 * 3. 告诉服务器，这是一个ajax（异步）请求，如果'X-Requested-With'值为null，就表示这是一个普通（同步，一般是表单提交）请求。
 * 
 * 4.设置请求头信息，一般是用来校验身份的，这里添加token校验信息
 * 
 * 5. 默认 post 请求，使用 application/json 形式
 * 
 * 6. 设置响应拦截器，内部根据返回值，重新组装，统一管理
 */
axios.defaults.baseURL = config[import.meta.env.MODE]
axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['token'] = localGet('token') || ''
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.interceptors.response.use(res => {
  if (typeof res.data !== 'object') {
    ElMessage.error('服务器异常')
    return Promise.reject(res)
  }
  if (res.data.resultCode < 200 || res.data.resultCode > 200 && res.data.resultCode != 304) {
    
    if (res.data.message) ElMessage.error(res.data.message + '  ' + '嘿嘿，来了')

    // 说明登录超时，重新进入登录页面
    if (res.resultCode === 419) router.push({ path: '/login' })

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