<template>
  <div class="min-h-screen bg-gray-50 text-gray-800 flex">
    <!-- 侧边栏 -->
    <aside class="w-64 bg-white shadow-xl border-r border-gray-200 p-6 flex flex-col z-10">
      <div class="mb-8">
        <h1 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          控制台面板
        </h1>
      </div>
      
      <nav class="flex-1 space-y-2 font-medium">
        <router-link to="/admin/dashboard" class="block px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-gray-600" active-class="bg-blue-50 text-blue-600 font-bold">
          仪表盘
        </router-link>
        <router-link to="/admin/settings" class="block px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-gray-600" active-class="bg-blue-50 text-blue-600 font-bold">
          网站设置
        </router-link>
        <!-- 文章管理 -->
        <router-link 
          to="/admin/articles" 
          class="block px-4 py-3 rounded-xl mb-2 transition-colors text-gray-600 hover:bg-gray-100"
          :class="route.path.includes('/admin/article') ? 'bg-pink-50 text-pink-600 font-bold' : ''"
        >
          文章管理
        </router-link>

        <router-link to="/" class="block px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors mt-auto text-gray-400 font-medium">
          返回博客前台
        </router-link>
        
        <button @click="handleLogout" class="w-full text-left block px-4 py-3 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors text-gray-400 font-medium mt-2">
          退出登录
        </button>
      </nav>
    </aside>

    <!-- 主内容区 -->
    <main class="flex-1 p-8 overflow-y-auto">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const handleLogout = () => {
  localStorage.removeItem('token')
  ElMessage.success('已成功退出登录')
  router.push('/')
}
</script>
