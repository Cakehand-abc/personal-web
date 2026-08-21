<template>
  <div class="fixed right-5 bottom-6 z-40 flex flex-col items-center gap-2.5">
    <!-- 主题设置抽屉面板 -->
    <transition name="fade-slide">
      <div 
        v-if="showSettings" 
        class="settings-panel card-base p-4 w-72 mb-2 shadow-2xl backdrop-blur-xl bg-(--card-bg-transparent) border border-(--line-divider)"
      >
        <div class="flex items-center justify-between mb-3 border-b border-(--line-divider) pb-2">
          <span class="text-sm font-bold text-(--text-bright) flex items-center gap-1.5">
            <span>🎨</span>
            <span>主题个性化设置</span>
          </span>
          <button @click="showSettings = false" class="text-xs text-(--text-dim) hover:text-(--text-bright) p-1">✕</button>
        </div>

        <!-- 1. 亮色 / 暗色模式切换 -->
        <div class="mb-4">
          <div class="text-xs text-(--text-dim) mb-1.5 font-medium">界面外观</div>
          <div class="grid grid-cols-2 gap-2">
            <button 
              @click="themeStore.isDark && themeStore.toggleTheme()"
              class="px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all"
              :class="!themeStore.isDark ? 'bg-(--primary) text-white border-(--primary)' : 'border-(--line-divider) text-(--text-normal) hover:bg-(--btn-plain-bg-hover)'"
            >
              <span>☀️</span> 亮色模式
            </button>
            <button 
              @click="!themeStore.isDark && themeStore.toggleTheme()"
              class="px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all"
              :class="themeStore.isDark ? 'bg-(--primary) text-white border-(--primary)' : 'border-(--line-divider) text-(--text-normal) hover:bg-(--btn-plain-bg-hover)'"
            >
              <span>🌙</span> 暗色模式
            </button>
          </div>
        </div>

        <!-- 2. 主题色相 (Hue) 滑块 -->
        <div class="mb-4">
          <div class="flex items-center justify-between text-xs text-(--text-dim) mb-1.5 font-medium">
            <span>360° 主题色相</span>
            <span class="font-bold text-(--primary)">{{ themeStore.hue }}°</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="360" 
            v-model.number="themeStore.hue"
            @input="themeStore.setHue(themeStore.hue)"
            class="hue-slider w-full h-2 rounded-lg cursor-pointer appearance-none"
          />
          <div class="flex justify-between gap-1 mt-2">
            <button 
              v-for="preset in huePresets" 
              :key="preset.hue"
              @click="themeStore.setHue(preset.hue)"
              class="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm transition-transform hover:scale-110"
              :style="{ backgroundColor: `oklch(0.70 0.14 ${preset.hue})` }"
              :title="preset.name"
            ></button>
          </div>
        </div>

        <!-- 3. 特效开关 -->
        <div class="pt-2 border-t border-(--line-divider) flex items-center justify-between">
          <span class="text-xs text-(--text-normal) flex items-center gap-1">
            <span>🌸</span>
            <span>樱花飘落动效</span>
          </span>
          <button 
            @click="themeStore.toggleSakura()"
            class="px-3 py-1 rounded-full text-xs font-bold transition-all"
            :class="themeStore.sakuraEnabled ? 'bg-(--primary) text-white' : 'bg-black/10 dark:bg-white/10 text-(--text-dim)'"
          >
            {{ themeStore.sakuraEnabled ? '开启' : '关闭' }}
          </button>
        </div>
      </div>
    </transition>

    <!-- 设置按钮 -->
    <button 
      @click="showSettings = !showSettings"
      class="control-btn card-base w-11 h-11 rounded-2xl flex items-center justify-center text-lg text-(--text-normal) hover:text-(--primary) hover:scale-105 active:scale-95 transition-all shadow-lg border border-(--line-divider)"
      title="个性化设置"
    >
      ⚙️
    </button>

    <!-- 亮暗切换快捷按钮 -->
    <button 
      @click="themeStore.toggleTheme"
      class="control-btn card-base w-11 h-11 rounded-2xl flex items-center justify-center text-lg text-(--text-normal) hover:text-(--primary) hover:scale-105 active:scale-95 transition-all shadow-lg border border-(--line-divider)"
      :title="themeStore.isDark ? '切换到亮色模式' : '切换到暗色模式'"
    >
      {{ themeStore.isDark ? '🌙' : '☀️' }}
    </button>

    <!-- 返回顶部按钮 (带环形进度) -->
    <button 
      v-show="showBackToTop"
      @click="scrollToTop"
      class="control-btn relative card-base w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold text-(--text-normal) hover:text-(--primary) hover:scale-105 active:scale-95 transition-all shadow-lg border border-(--line-divider) group"
      title="返回顶部"
    >
      <!-- SVG 环形进度条 -->
      <svg class="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 36 36">
        <path
          class="text-(--primary)/20"
          stroke-width="3"
          stroke="currentColor"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          class="text-(--primary) transition-all duration-150"
          stroke-dasharray="100, 100"
          :stroke-dashoffset="100 - scrollProgress"
          stroke-width="3"
          stroke-linecap="round"
          stroke="currentColor"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <span class="relative z-10 text-xs font-bold group-hover:-translate-y-0.5 transition-transform">▲</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '../../store/theme'

const themeStore = useThemeStore()
const showSettings = ref(false)
const showBackToTop = ref(false)
const scrollProgress = ref(0)

const huePresets = [
  { name: '流萤青蓝', hue: 250 },
  { name: '翡翠葱绿', hue: 150 },
  { name: '暮紫幽韵', hue: 290 },
  { name: '樱粉浪漫', hue: 340 },
  { name: '暖阳落日', hue: 45 },
]

const handleScroll = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  showBackToTop.value = scrollTop > 250
  
  if (docHeight > 0) {
    scrollProgress.value = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.hue-slider {
  background: linear-gradient(
    to right,
    oklch(0.75 0.14 0),
    oklch(0.75 0.14 60),
    oklch(0.75 0.14 120),
    oklch(0.75 0.14 180),
    oklch(0.75 0.14 240),
    oklch(0.75 0.14 300),
    oklch(0.75 0.14 360)
  );
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
</style>
