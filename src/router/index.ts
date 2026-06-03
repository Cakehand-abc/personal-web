import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    // 将 /home 重定向到 / 以避免用户直接访问 /home 绕过拦截
    {
      path: '/home',
      redirect: '/'
    }
  ]
})

export default router
