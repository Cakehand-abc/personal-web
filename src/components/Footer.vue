<template>
  <footer v-if="footerConfig.enable" class="w-full mt-16 pb-12 pt-8 text-xs text-(--text-dim) border-t border-dashed border-(--line-divider) select-none">
    <div class="max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center gap-3">
      
      <!-- 装饰徽章 -->
      <div class="flex flex-wrap items-center justify-center gap-2">
        <span class="px-2.5 py-1 rounded-full bg-(--btn-regular-bg) text-(--btn-content) font-medium flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>运行良好 · 持续守护中</span>
        </span>
        <span class="px-2.5 py-1 rounded-full bg-(--btn-regular-bg) text-(--btn-content) font-medium">
          已运行 {{ uptimeDays }} 天
        </span>
      </div>

      <!-- 版权与建站信息 -->
      <div class="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-(--text-normal)">
        <span>&copy; {{ currentYear }} <strong class="text-(--text-bright)">{{ displayName }}</strong>. All Rights Reserved.</span>
        <span>/</span>
        <a href="#home" class="hover:text-(--primary) transition-colors">返回顶部</a>
        <span>/</span>
        <a href="#about" class="hover:text-(--primary) transition-colors">关于本站</a>
        <span v-if="settingStore.recordNumber">/</span>
        <span v-if="settingStore.recordNumber">{{ settingStore.recordNumber }}</span>
      </div>

      <!-- 开源致谢与声明 -->
      <div class="flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-(--text-dim)">
        <span>Powered by</span>
        <span class="text-(--primary) font-semibold">Vue 3</span>
        <span v-if="footerConfig.poweredBy.firefly">&amp;</span>
        <a 
          v-if="footerConfig.poweredBy.firefly"
          href="https://github.com/CuteLeaf/Firefly" 
          target="_blank" 
          rel="noopener" 
          class="text-(--primary) font-semibold hover:underline"
        >
          Firefly Theme
        </a>
        <span v-if="footerConfig.poweredBy.fuwari">(Inspired by</span>
        <a 
          v-if="footerConfig.poweredBy.fuwari"
          href="https://github.com/saicaca/fuwari" 
          target="_blank" 
          rel="noopener" 
          class="text-(--primary) hover:underline"
        >
          fuwari
        </a>
        <span v-if="footerConfig.poweredBy.fuwari">)</span>
      </div>

      <!-- 寄语 -->
      <div class="text-[11px] text-(--text-dim) italic opacity-80 mt-1">
        {{ footerConfig.quote }}
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSettingStore } from '../store/setting'
import { footerConfig, siteConfig } from '../config'

const settingStore = useSettingStore()
const currentYear = new Date().getFullYear()

const displayName = computed(() => {
  if (settingStore.siteName) {
    return settingStore.siteName.split(' ')[0]
  }
  return siteConfig.author || 'Firefly'
})

const uptimeDays = computed(() => {
  const startDateStr = footerConfig.siteStartDate || siteConfig.siteStartDate || '2026-01-01'
  const start = new Date(startDateStr).getTime()
  const now = new Date().getTime()
  return Math.max(1, Math.floor((now - start) / (1000 * 60 * 60 * 24)))
})
</script>
