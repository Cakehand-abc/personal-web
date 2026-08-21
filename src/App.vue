<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import SideNav from './components/SideNav.vue'
import GlobalFooter from './components/Footer.vue'
import { useSettingStore } from './store/setting'
import { useThemeStore } from './store/theme'
import { siteConfig } from './config'

const route = useRoute()
const settingStore = useSettingStore()
const themeStore = useThemeStore()

// 判断是否为前台路由（不包含 /admin 和 /oauth2）
const isPublicRoute = computed(() => {
  return !route.path.startsWith('/admin') && !route.path.startsWith('/oauth2')
})

const showIntro = ref(true)
const showLogo = ref(false)
const fadeOut = ref(false)

const handleVisibilityChange = () => {
  if (document.hidden) {
    document.title = '别走好不好(╥╯^╰╥)'
  } else {
    document.title = siteConfig.title || settingStore.siteName || 'Firefly · 流萤'
  }
}

onMounted(async () => {
  // 初始化全局设置与主题引擎
  await settingStore.fetchSettings()
  themeStore.applyTheme()

  // 设置动态标题监听
  document.addEventListener('visibilitychange', handleVisibilityChange)
  handleVisibilityChange()

  // 如果不是前台页面，直接不看动画了
  if (!isPublicRoute.value) {
    showIntro.value = false
    return
  }

  // 禁止整个页面的滚动，强制看完动画
  document.body.style.overflow = 'hidden'

  // 统一开场动画时间为 3 秒 (3000ms)，以配合横向 SVG 流金动画节奏
  const introDuration = 3000

  setTimeout(() => {
    showLogo.value = true
  }, 500)

  setTimeout(() => {
    fadeOut.value = true
    setTimeout(() => {
      document.body.style.overflow = ''
      showIntro.value = false
    }, 800)
  }, introDuration)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <!-- 独立的开场动画遮罩层，仅在前台页面展示 -->
  <div v-if="showIntro && isPublicRoute" class="intro-overlay" :class="{ 'fade-out': fadeOut }" @wheel.prevent @touchmove.prevent>
    
    <!-- 1. 如果后台配置了开场视频 -->
    <video 
      v-if="settingStore.introMediaUrl && settingStore.introMediaType === 'video'" 
      :src="settingStore.introMediaUrl" 
      class="intro-media absolute w-full h-full object-cover"
      :class="{ 'fade-in': showLogo }"
      autoplay muted loop playsinline>
    </video>

    <!-- 2. 如果后台配置了开场图片 -->
    <img 
      v-else-if="settingStore.introMediaUrl && settingStore.introMediaType === 'image'" 
      :src="settingStore.introMediaUrl" 
      class="intro-media absolute w-full h-full object-cover" 
      :class="{ 'fade-in': showLogo }"
      alt="Intro Image" 
    />

    <!-- 3. 如果后台设置了使用旧版“Welcome”动画 -->
    <div v-else-if="settingStore.useOldIntro" class="logo-wrapper relative z-10" :class="{ 'fade-in': showLogo }">
      <h1 class="anime-logo-text text-4xl md:text-6xl font-bold tracking-wider">
        Welcome To My Blog
      </h1>
    </div>

    <!-- 4. 默认兜底动画：横向 SVG 流金岁月动画 -->
    <div v-else class="svg-intro-wrapper absolute w-full h-full flex justify-center items-center">
      <object data="/gemini-svg-horizontal.svg?v=20" type="image/svg+xml" class="w-full max-w-4xl px-4 md:px-10"></object>
    </div>
  </div>

  <!-- 全局布局：前台采用左侧导航 + 右侧主内容 -->
  <div v-if="isPublicRoute" class="flex min-h-screen bg-(--page-bg) transition-colors duration-300">
    <!-- 左侧固定导航栏 (保留) -->
    <SideNav />
    
    <!-- 右侧主内容区域 (避开左侧导航栏的宽度 190px) -->
    <main class="main-content flex flex-col flex-1 min-h-screen">
      <div class="flex-1">
        <RouterView />
      </div>
      <GlobalFooter />
    </main>
  </div>
  
  <!-- 后台路由直接渲染 -->
  <template v-else>
    <RouterView />
  </template>
</template>

<style scoped lang="scss">
.main-content {
  flex: 1;
  margin-left: 190px; /* 为左侧固定的 190px 导航栏留出空间 */
  min-height: 100vh;
  width: calc(100% - 190px);
}

.intro-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #ffffff; /* 纯白背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999;
}

.intro-overlay.fade-out {
  opacity: 0;
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.logo-wrapper {
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 2s ease, transform 3s ease-out;
}

.logo-wrapper.fade-in {
  opacity: 1;
  transform: scale(1);
}

.intro-media {
  opacity: 0;
  transform: scale(1.05);
  transition: opacity 2s ease, transform 3s ease-out;
}

.intro-media.fade-in {
  opacity: 1;
  transform: scale(1);
}

.anime-logo-text {
  color: var(--primary);
  font-family: 'Inter', sans-serif;
  text-shadow: 0 4px 12px rgba(233, 69, 96, 0.3);
  background: linear-gradient(130deg, var(--primary), var(--text-sub-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
