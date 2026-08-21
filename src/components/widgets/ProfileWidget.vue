<template>
  <div class="card-base p-5 flex flex-col items-center text-center relative group" v-scroll-reveal>
    <!-- 头像区域 (带悬浮缩放、发光外边框、旋转特效) -->
    <div class="relative mb-4 mt-1">
      <div class="w-28 h-28 rounded-2xl overflow-hidden shadow-lg border-2 border-white/80 dark:border-white/20 relative z-10 transition-transform duration-500 group-hover:scale-105">
        <img 
          :src="settingStore.avatarUrl || '/assets/images/avatar.avif'" 
          alt="Avatar" 
          class="w-full h-full object-cover transition-transform duration-700 group-hover:rotate-6"
          @error="handleAvatarError"
        />
      </div>
      <!-- 装饰背景光圈 -->
      <div class="absolute inset-0 rounded-2xl bg-(--primary) opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"></div>
    </div>

    <!-- 博主昵称 -->
    <h3 class="text-xl font-bold text-(--text-bright) mb-1 transition-colors">
      {{ settingStore.siteName ? settingStore.siteName.split(' ')[0] : 'Firefly' }}
    </h3>

    <!-- 小装饰条 -->
    <div class="h-1 w-6 bg-(--primary) rounded-full mb-3 transition-all duration-300 group-hover:w-12"></div>

    <!-- 个性签名 -->
    <p class="text-xs text-(--text-dim) leading-relaxed mb-5 px-2 line-clamp-3">
      {{ settingStore.siteSignature || '生如夏花之绚烂，死如秋叶之静美。在这漫长旅途中，记录属于我们的每一刻。' }}
    </p>

    <!-- 统计数字三栏 (文章数, 分类数, 标签数) -->
    <div class="grid grid-cols-3 w-full border-t border-b border-(--line-divider) py-3 mb-4">
      <div class="flex flex-col items-center">
        <span class="text-xs text-(--text-dim)">文章</span>
        <span class="text-base font-bold text-(--text-bright) mt-0.5">{{ articleCount }}</span>
      </div>
      <div class="flex flex-col items-center border-l border-r border-(--line-divider)">
        <span class="text-xs text-(--text-dim)">分类</span>
        <span class="text-base font-bold text-(--text-bright) mt-0.5">{{ categoryCount }}</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="text-xs text-(--text-dim)">标签</span>
        <span class="text-base font-bold text-(--text-bright) mt-0.5">{{ tagCount }}</span>
      </div>
    </div>

    <!-- 社交链接按钮列表 -->
    <div class="flex flex-wrap gap-2 justify-center w-full">
      <a 
        href="https://github.com" 
        target="_blank" 
        class="btn-regular w-9 h-9 rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm"
        title="GitHub"
      >
        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
      </a>
      <a 
        href="https://bilibili.com" 
        target="_blank" 
        class="btn-regular w-9 h-9 rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm"
        title="哔哩哔哩"
      >
        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.813 4.653h.854c1.51.054 2.769.578 3.774 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.264 1.52-3.774 1.56H5.333c-1.51-.04-2.769-.56-3.773-1.56C.556 20.116.036 18.857 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.264-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.08-.08c.249-.249.551-.373.907-.373.355 0 .657.124.906.373L9.6 4.653h4.8l2.747-2.653c.248-.249.55-.373.906-.373.356 0 .658.124.907.373l.08.08c.249.249.373.551.373.907 0 .355-.124.657-.373.906l-1.127 1.16zM7.2 10.4c0-.44-.16-.813-.48-1.12-.32-.307-.693-.46-1.12-.46-.44 0-.813.153-1.12.46-.307.307-.46.68-.46 1.12v3.2c0 .44.153.813.46 1.12.307.307.68.46 1.12.46.427 0 .8-.153 1.12-.46.32-.307.48-.68.48-1.12zm12 0c0-.44-.16-.813-.48-1.12-.32-.307-.693-.46-1.12-.46-.44 0-.813.153-1.12.46-.307.307-.46.68-.46 1.12v3.2c0 .44.153.813.46 1.12.307.307.68.46 1.12.46.427 0 .8-.153 1.12-.46.32-.307.48-.68.48-1.12z"/></svg>
      </a>
      <a 
        href="mailto:example@gmail.com" 
        class="btn-regular w-9 h-9 rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm"
        title="发送邮件"
      >
        <svg class="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
      </a>
      <a 
        href="#about" 
        class="btn-regular px-3 h-9 rounded-xl flex items-center gap-1 text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-sm"
      >
        <span>关于我</span>
        <span>→</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettingStore } from '../../store/setting'

defineProps<{
  articleCount?: number
  categoryCount?: number
  tagCount?: number
}>()

const settingStore = useSettingStore()

const handleAvatarError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = 'https://picsum.photos/seed/avatar/150/150'
}
</script>
