import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/add',
      name: 'add',
      component: () => import('@/views/Add.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/swiper',
      name: 'swiper',
      component: () => import('@/views/Swiper.vue')
    }
  ]
})

export default router