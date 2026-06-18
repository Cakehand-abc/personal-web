<template>
  <div class="min-h-screen bg-gray-900 text-white flex">
    <!-- 侧边栏 (玻璃态风格) -->
    <aside class="w-64 bg-white/10 backdrop-blur-lg border-r border-white/20 p-6 flex flex-col">
      <div class="mb-8">
        <h1 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          控制台面板
        </h1>
      </div>
      
      <nav class="flex-1 space-y-2">
        <router-link to="/admin/dashboard" class="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors" active-class="bg-blue-500/50">
          仪表盘
        </router-link>
        <router-link to="/admin/settings" class="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors" active-class="bg-blue-500/50">
          网站设置
        </router-link>
        <!-- 预留其他导航 -->
        <router-link to="/" class="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors mt-auto text-gray-400">
          返回博客前台
        </router-link>
      </nav>
    </aside>

    <!-- 主内容区 -->
    <main class="flex-1 p-8 overflow-y-auto">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
// Layout for Admin Dashboard
</script>
