<template>
  <div class="firefly-banner relative w-full h-[50vh] md:h-[62vh] min-h-[350px] max-h-[600px] flex flex-col justify-between overflow-hidden select-none">
    
    <!-- 1. 自动轮播壁纸背景 (平滑淡入淡出与微缓动景深效果) -->
    <div class="banner-wallpaper-carousel absolute inset-0 z-0 overflow-hidden">
      <div 
        v-for="(wp, index) in wallpapers" 
        :key="wp"
        class="carousel-slide absolute inset-0 transition-all duration-1000 ease-in-out"
        :class="currentWallpaperIndex === index ? 'opacity-100 scale-105 z-1' : 'opacity-0 scale-100 z-0 pointer-events-none'"
      >
        <img 
          :src="wp" 
          :alt="'Firefly Banner Wallpaper ' + (index + 1)" 
          class="w-full h-full object-cover object-center filter brightness-[0.88] dark:brightness-[0.7]"
        />
      </div>

      <!-- 渐变暗层与光晕，保证文字极致清晰 -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 dark:from-black/60 dark:via-black/40 dark:to-black/80 z-2"></div>
    </div>

    <!-- 顶部微光高亮 -->
    <div class="top-gradient-highlight absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/20 to-transparent pointer-events-none z-10"></div>

    <!-- 2. 居中核心大标题 (纯净极简，不遮挡壁纸) -->
    <div class="banner-center-content relative z-20 flex-1 flex flex-col items-center justify-center text-center px-4">
      <!-- 站点主标题 -->
      <h1 class="banner-title text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-wider drop-shadow-lg font-sans">
        {{ displayTitle }}
      </h1>
    </div>

    <!-- 3. 底部动态水波纹 -->
    <div class="relative z-20 w-full">
      <WavesEffect />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { backgroundWallpaper, siteConfig } from '../config'
import WavesEffect from './features/WavesEffect.vue'

const displayTitle = computed(() => {
  return backgroundWallpaper.homeText.title || siteConfig.title || 'Firefly · 流萤'
})

const wallpapers = backgroundWallpaper.wallpapers
const currentWallpaperIndex = ref(0)
let carouselTimer: any = null

const startCarousel = () => {
  if (!backgroundWallpaper.carousel?.enable || wallpapers.length <= 1) return
  const interval = backgroundWallpaper.carousel.interval || 6000
  carouselTimer = setInterval(() => {
    currentWallpaperIndex.value = (currentWallpaperIndex.value + 1) % wallpapers.length
  }, interval)
}

const stopCarousel = () => {
  if (carouselTimer) {
    clearInterval(carouselTimer)
    carouselTimer = null
  }
}

onMounted(() => {
  startCarousel()
})

onUnmounted(() => {
  stopCarousel()
})
</script>

<style scoped>
.banner-title {
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.45);
}

.carousel-slide {
  will-change: opacity, transform;
}
</style>
