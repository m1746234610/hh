import { createRouter, createWebHashHistory } from "vue-router";
import Home from '@/views/Home.vue'
import AddGoods from '@/views/AddGoods.vue'
import Login from '@/views/Login.vue'
import Swiper from '@/views/Swiper.vue'
import IndexChange from '@/views/IndexChange.vue'
import Category from '@/views/Category.vue'
import Goods from '@/views/Goods.vue'
import Order from '@/views/Order.vue'
import OrderDetail from '@/views/OrderDetail.vue'
import Guest from '@/views/Guest.vue'
import Account from '@/views/Account.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/add',
      name: 'add',
      component: AddGoods,
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/swiper',
      name: 'swiper',
      component: Swiper
    },
    {
      path: '/hot',
      name: 'hot',
      component: IndexChange
    },
    {
      path: '/new',
      name: 'new',
      component: IndexChange
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: IndexChange
    },
    {
      path: '/category',
      name: 'category',
      component: Category,
      children: [
        {
          path: '/category/level2',
          name: 'level2',
          component: Category,
        },
        {
          path: '/category/level3',
          name: 'level3',
          component: Category,
        }
      ]
    },
    {
      path: '/goods',
      name: 'goods',
      component: Goods
    },
    {
      path: '/order',
      name: 'order',
      component: Order
    },
    {
      path: '/order_detail',
      name: 'order_detail',
      component: OrderDetail
    },
    {
      path: '/guest',
      name: 'guest',
      component: Guest
    },
    {
      path: '/account',
      name: 'account',
      component: Account
    },
    {
      path: '/vuex',
      name: 'vuex',
      component: ()=>import('@/views/Vuex.vue')
    }
  ]
})

export default router