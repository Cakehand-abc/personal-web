<template>
  <div class="card-base p-6 flex flex-col items-center text-center relative group">
    <!-- 1. 头像区域 (带发光与圆角卡片) -->
    <div class="relative mb-4 mt-2">
      <div class="w-32 h-32 rounded-2xl overflow-hidden shadow-md border-2 border-white/80 dark:border-white/20 relative z-10 transition-transform duration-500 group-hover:scale-105">
        <img 
          :src="displayAvatar" 
          alt="Avatar" 
          class="w-full h-full object-cover"
          @error="handleAvatarError"
        />
      </div>
      <!-- 装饰微光光晕 -->
      <div class="absolute inset-0 rounded-2xl bg-(--primary) opacity-0 group-hover:opacity-25 blur-xl transition-opacity duration-500"></div>
    </div>

    <!-- 2. 博主昵称 -->
    <h3 class="text-2xl font-bold text-(--text-bright) mb-1">
      {{ displayName }}
    </h3>

    <!-- 3. 小绿条指示线 -->
    <div class="h-1 w-6 bg-(--primary) rounded-full mb-3 transition-all duration-300 group-hover:w-12"></div>

    <!-- 4. 个性签名 -->
    <p class="text-xs text-(--text-dim) leading-relaxed mb-6 px-2">
      {{ displayBio }}
    </p>

    <!-- 5. 底部 3 个社交按钮 (GitHub, 邮箱, 哔哩哔哩) -->
    <div class="flex items-center justify-center gap-3.5 w-full">
      <!-- GitHub 按钮 -->
      <a 
        :href="githubUrl" 
        target="_blank" 
        class="btn-regular w-11 h-11 rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm group/btn"
        title="GitHub"
      >
        <img src="/assets/icons/github.png" class="w-5 h-5 object-contain group-hover/btn:rotate-6 transition-transform" alt="GitHub" />
      </a>

      <!-- 邮箱按钮 (使用桌面提供的定制 邮箱.svg) -->
      <a 
        href="#"
        @click.prevent="handleEmailClick"
        class="btn-regular w-11 h-11 rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm cursor-pointer group/btn"
        title="联系站长邮箱 (点击复制)"
      >
        <img src="/assets/icons/email.svg" class="w-5 h-5 object-contain group-hover/btn:scale-110 transition-transform dark:invert" alt="Email" />
      </a>

      <!-- 哔哩哔哩 按钮 -->
      <a 
        :href="bilibiliUrl"
        target="_blank"
        class="btn-regular w-11 h-11 rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm group/btn"
        title="哔哩哔哩空间"
      >
        <img src="/assets/icons/bilibili.png" class="w-5 h-5 object-contain group-hover/btn:rotate-6 transition-transform" alt="Bilibili" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { profileConfig, siteConfig } from '../../config'

const displayAvatar = computed(() => {
  return profileConfig.avatar || '/assets/images/avatar.avif'
})

const displayName = computed(() => {
  return profileConfig.name || siteConfig.title || 'Firefly'
})

const displayBio = computed(() => {
  return profileConfig.bio || "Hello, I'm Firefly."
})

const githubUrl = computed(() => {
  const item = profileConfig.links.find(l => l.icon === 'github' || l.name.toLowerCase().includes('github'))
  return item?.url || 'https://github.com'
})

const bilibiliUrl = computed(() => {
  const item = profileConfig.links.find(l => l.icon === 'bilibili' || l.name.toLowerCase().includes('bilibili'))
  return item?.url || 'https://bilibili.com'
})

const handleEmailClick = () => {
  const emailItem = profileConfig.links.find(l => l.icon === 'email' || l.url.startsWith('mailto:'))
  const email = emailItem ? emailItem.url.replace('mailto:', '') : 'your-email@example.com'
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(email)
    ElMessage.success('已复制博主邮箱：' + email)
  } else {
    ElMessage.info('博主邮箱：' + email)
  }
}

const handleAvatarError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/assets/images/avatar.avif'
}
</script>
