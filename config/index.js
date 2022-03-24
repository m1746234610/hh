// 配置相应环境的域名地址。开发环境配置 /api，是为了后续配置 proxy 代理接口所用
export default {
  development: '/api', // 开发代理地址
  beta: '//backend-api-02.newbee.ltd/manage-api/v1', // 测试接口域名
  release: '//backend-api-02.newbee.ltd/manage-api/v1',// 正式接口域名
}

// export default {
//   development: {
//     baseUrl: '/api' // 开发代理地址
//   },
//   beta: {
//     baseUrl: '//backend-api-02.newbee.ltd/manage-api/v1' // 测试接口域名
//   },
//   release: {
//     baseUrl: '//backend-api-02.newbee.ltd/manage-api/v1' // 正式接口域名
//   }
// }