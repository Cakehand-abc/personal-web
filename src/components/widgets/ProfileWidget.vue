<template>
  <div class="card-base p-5 flex flex-col items-center text-center relative group" v-scroll-reveal>
    <!-- 头像区域 (带悬浮缩放、发光外边框、旋转特效) -->
    <div class="relative mb-4 mt-1">
      <div class="w-28 h-28 rounded-2xl overflow-hidden shadow-lg border-2 border-white/80 dark:border-white/20 relative z-10 transition-transform duration-500 group-hover:scale-105">
        <img 
          :src="displayAvatar" 
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
      {{ displayName }}
    </h3>

    <!-- 小装饰条 -->
    <div class="h-1 w-6 bg-(--primary) rounded-full mb-3 transition-all duration-300 group-hover:w-12"></div>

    <!-- 个性签名 -->
    <p class="text-xs text-(--text-dim) leading-relaxed mb-5 px-2 line-clamp-3">
      {{ displayBio }}
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
        v-for="link in profileConfig.links"
        :key="link.name"
        :href="link.url" 
        target="_blank" 
        class="btn-regular w-9 h-9 rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm"
        :title="link.name"
      >
        <img v-if="link.icon === 'github'" src="/assets/icons/github.png" class="w-4 h-4 object-contain" alt="GitHub" />
        <img v-else-if="link.icon === 'bilibili'" src="/assets/icons/bilibili.png" class="w-4 h-4 object-contain" alt="Bilibili" />
        <svg v-else class="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
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
import { computed } from 'vue'
import { useSettingStore } from '../../store/setting'
import { profileConfig } from '../../config'

defineProps<{
  articleCount?: number
  categoryCount?: number
  tagCount?: number
}>()

const settingStore = useSettingStore()

const displayAvatar = computed(() => {
  return profileConfig.avatar || settingStore.avatarUrl || '/assets/images/avatar.avif'
})

const displayName = computed(() => {
  return profileConfig.name || (settingStore.siteName ? settingStore.siteName.split(' ')[0] : 'Firefly')
})

const displayBio = computed(() => {
  return profileConfig.bio || settingStore.siteSignature || '生如夏花之绚烂，死如秋叶之静美。'
})

const handleAvatarError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = 'https://picsum.photos/seed/avatar/150/150'
}
</script>
