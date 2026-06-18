<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-900 text-white">
    <div class="text-center">
      <h2 class="text-2xl font-bold mb-4">正在进行安全认证...</h2>
      <p class="text-gray-400">正在与 GitHub 建立连接并获取管理员通行证，请稍候</p>
      <!-- 简单的加载动画 -->
      <div class="mt-6 flex justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  // 从 URL 参数中提取 token
  // 例如：http://localhost:5173/oauth2/redirect?token=xxx
  const token = route.query.token as string

  if (token) {
    // 保存到 Pinia 和 localStorage
    authStore.setToken(token)
    ElMessage.success('GitHub 授权成功，欢迎回来！')
    
    // 跳转到管理端控制台
    router.replace('/admin/dashboard')
  } else {
    ElMessage.error('授权失败，未获取到通行证')
    router.replace('/')
  }
})
</script>
