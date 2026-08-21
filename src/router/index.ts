import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  },
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
      path: '/article/:id',
      name: 'articleDetail',
      component: () => import('../views/Article.vue')
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
        },
        {
          path: 'gallery',
          name: 'adminGallery',
          component: () => import('../views/admin/GalleryList.vue')
        },
        {
          path: 'projects',
          name: 'adminProjects',
          component: () => import('../views/admin/ProjectList.vue')
        },
        {
          path: 'messages',
          name: 'adminMessages',
          component: () => import('../views/admin/MessageList.vue')
        }
      ]
    },
    // 将 /home 重定向到 / 以避免用户直接访问 /home 绕过拦截
    {
      path: '/home',
      redirect: '/'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    }
  ]
})

// 全局路由守卫
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')

  // 如果访问的是 /admin 开头的管理端页面，且没有 token，则重定向到登录页
  if (to.path.startsWith('/admin') && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
