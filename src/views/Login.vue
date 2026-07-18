<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-b from-blue-100 to-transparent rounded-full blur-3xl opacity-50"></div>
      <div class="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-t from-purple-100 to-transparent rounded-full blur-3xl opacity-50"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-10 border border-gray-100 transform transition-all hover:scale-[1.01]">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-extrabold text-gray-800 tracking-tight mb-3">欢迎回来</h1>
        <p class="text-gray-500 font-medium">请登录以访问控制台</p>
      </div>

      <div class="space-y-6">
        <button 
          @click="loginWithGithub" 
          class="w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-4 px-6 rounded-2xl hover:bg-gray-800 transition-colors focus:ring-4 focus:ring-gray-200 font-semibold text-lg"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
          </svg>
          使用 GitHub 登录
        </button>

        <div v-if="hasError" class="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center border border-red-100">
          登录已取消或授权失败，请重试。
        </div>

        <div class="text-center mt-8">
          <router-link to="/" class="text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors">
            &larr; 返回博客首页
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const hasError = ref(false)

onMounted(() => {
  if (route.query.error) {
    hasError.value = true
    // 可选：清除URL中的参数，避免刷新依然显示错误
    router.replace({ query: {} })
  }
})

const loginWithGithub = () => {
  // 跳转到后端的 GitHub OAuth2 授权端点
  window.location.href = 'http://localhost:8080/oauth2/authorization/github'
}
</script>
