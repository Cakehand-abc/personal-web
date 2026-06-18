import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/oauth2/redirect',
      name: 'oauth2Redirect',
      component: () => import('../views/OAuth2Redirect.vue')
    },
    {
      path: '/admin',
      name: 'adminLayout',
      component: () => import('../views/admin/Layout.vue'),
      children: [
        {
          path: '',
          redirect: '/admin/dashboard'
        },
        {
          path: 'dashboard',
          name: 'adminDashboard',
          component: () => import('../views/admin/Dashboard.vue')
        },
        {
          path: 'settings',
          name: 'adminSettings',
          component: () => import('../views/admin/Settings.vue')
        },
        {
          path: 'articles',
          name: 'adminArticles',
          component: () => import('../views/admin/ArticleList.vue')
        },
        {
          path: 'article-edit',
          name: 'adminArticleEdit',
          component: () => import('../views/admin/ArticleEdit.vue')
        }
      ]
    },
    // 将 /home 重定向到 / 以避免用户直接访问 /home 绕过拦截
    {
      path: '/home',
      redirect: '/'
    }
  ]
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // 如果访问的是 /admin 开头的管理端页面，且没有 token，则踢回首页
  if (to.path.startsWith('/admin') && !token) {
    next('/')
  } else {
    next()
  }
})

export default router
