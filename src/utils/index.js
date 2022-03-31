export function localGet(key) {
  const value = window.localStorage.getItem(key)
  try {
    return JSON.parse(window.localStorage.getItem(key))
  } catch (error) {
    return value
  }
}

export function localSet(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function localRemove(key) {
  window.localStorage.removeItem(key)
}

export function localClear() {
  window.localStorage.clear()
}

export const pathMap = {
  home: '首页',
  login: '登录',
  add: '添加商品',
  swiper: '轮播图',
  hot: '热销商品',
  new: '新品上市',
  recommend: '为你推荐',
  category: '分类管理',
  level2: '分类二级管理',
  level3: '分类三级管理',
  goods: '商品管理',
  order: '订单管理',
  order_detail: '订单详情',
  guest: '会员管理',
  account: '修改密码',
}

// 公用图片上传接口
// 单张图片上传
export const uploadImgServer = 'http://backend-api-02.newbee.ltd/manage-api/v1/upload/file'

// 多张图片上传
export const uploadImgsServer = 'http://backend-api-02.newbee.ltd/manage-api/v1/upload/files'