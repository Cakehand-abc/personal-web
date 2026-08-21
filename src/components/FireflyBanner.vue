<template>
  <div class="firefly-banner relative w-full h-[60vh] md:h-[75vh] min-h-[420px] max-h-[700px] flex flex-col justify-between overflow-hidden select-none">
    <!-- 背景壁纸图片 -->
    <div class="banner-wallpaper absolute inset-0 z-0 overflow-hidden">
      <img 
        :src="currentWallpaper" 
        alt="Firefly Banner Wallpaper" 
        class="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out hover:scale-100 filter brightness-[0.9] dark:brightness-[0.7]"
      />
      <!-- 渐变暗层与光晕 -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 dark:from-black/60 dark:via-black/40 dark:to-black/80"></div>
    </div>

    <!-- 顶部高光条 -->
    <div class="top-gradient-highlight absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/20 to-transparent pointer-events-none z-10"></div>

    <!-- 切换壁纸小按钮 (右上角) -->
    <div class="absolute top-4 right-4 z-20 flex gap-2">
      <button 
        @click="switchWallpaper" 
        class="wallpaper-btn px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white/90 text-xs flex items-center gap-1.5 transition-all border border-white/20 hover:scale-105 active:scale-95 shadow-md"
        title="随机切换壁纸"
      >
        <span>🎨</span>
        <span>切换壁纸</span>
      </button>
    </div>

    <!-- 居中核心文案区域 -->
    <div class="banner-center-content relative z-20 flex-1 flex flex-col items-center justify-center text-center px-4 pt-12">
      <!-- 站点主标题 -->
      <h1 class="banner-title text-4xl md:text-6xl font-extrabold text-white mb-3 md:mb-5 tracking-wide drop-shadow-lg font-sans">
        {{ settingStore.siteName || '流萤 · Firefly' }}
      </h1>

      <!-- 动态打字机副标题 -->
      <div class="banner-subtitle text-base md:text-xl font-medium text-white/90 mb-6 max-w-2xl px-4 py-2 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 shadow-sm">
        <TypewriterText :texts="subtitleQuotes" />
      </div>

      <!-- 快捷社交 / 功能链接组 -->
      <div class="banner-links flex flex-wrap justify-center items-center gap-3 mt-2">
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener"
          class="banner-link-chip flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/30 backdrop-blur-md text-white font-medium text-sm border border-white/20 transition-all hover:scale-105 shadow-md"
        >
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          <span>GitHub</span>
        </a>
        <a 
          href="https://bilibili.com" 
          target="_blank" 
          rel="noopener"
          class="banner-link-chip flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/30 backdrop-blur-md text-white font-medium text-sm border border-white/20 transition-all hover:scale-105 shadow-md"
        >
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.813 4.653h.854c1.51.054 2.769.578 3.774 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.264 1.52-3.774 1.56H5.333c-1.51-.04-2.769-.56-3.773-1.56C.556 20.116.036 18.857 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.264-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.08-.08c.249-.249.551-.373.907-.373.355 0 .657.124.906.373L9.6 4.653h4.8l2.747-2.653c.248-.249.55-.373.906-.373.356 0 .658.124.907.373l.08.08c.249.249.373.551.373.907 0 .355-.124.657-.373.906l-1.127 1.16zM7.2 10.4c0-.44-.16-.813-.48-1.12-.32-.307-.693-.46-1.12-.46-.44 0-.813.153-1.12.46-.307.307-.46.68-.46 1.12v3.2c0 .44.153.813.46 1.12.307.307.68.46 1.12.46.427 0 .8-.153 1.12-.46.32-.307.48-.68.48-1.12zm12 0c0-.44-.16-.813-.48-1.12-.32-.307-.693-.46-1.12-.46-.44 0-.813.153-1.12.46-.307.307-.46.68-.46 1.12v3.2c0 .44.153.813.46 1.12.307.307.68.46 1.12.46.427 0 .8-.153 1.12-.46.32-.307.48-.68.48-1.12z"/></svg>
          <span>哔哩哔哩</span>
        </a>
        <a 
          href="#articles" 
          class="banner-link-chip flex items-center gap-1.5 px-4 py-2 rounded-xl bg-(--primary) text-white font-medium text-sm transition-all hover:scale-105 shadow-md shadow-(--primary)/30"
        >
          <span>📖 阅读博文</span>
        </a>
      </div>
    </div>

    <!-- 底部动态水波纹 -->
    <div class="relative z-20 w-full">
      <WavesEffect />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSettingStore } from '../store/setting'
import TypewriterText from './features/TypewriterText.vue'
import WavesEffect from './features/WavesEffect.vue'

const settingStore = useSettingStore()

const wallpapers = [
  '/assets/images/DesktopWallpaper/d1.avif',
  '/assets/images/DesktopWallpaper/d2.avif',
  '/assets/images/DesktopWallpaper/d3.avif',
  '/assets/images/DesktopWallpaper/d4.avif',
  '/assets/images/DesktopWallpaper/d5.avif',
  '/assets/images/DesktopWallpaper/d6.avif'
]

const currentWallpaperIndex = ref(0)
const currentWallpaper = ref(wallpapers[0])

const switchWallpaper = () => {
  currentWallpaperIndex.value = (currentWallpaperIndex.value + 1) % wallpapers.length
  currentWallpaper.value = wallpapers[currentWallpaperIndex.value]
}

const subtitleQuotes = [
  '愿你历尽千帆，归来仍是少年。',
  '大切な人といつかまた巡り会えますように。',
  '无论何时何地，请记得仰望璀璨的星空。',
  '飞萤扑火，向死而生。在这静谧的夜空里，寻找属于我们的光。',
  'Where there is coding, there is light.'
]
</script>

<style scoped>
.banner-title {
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}
</style>
