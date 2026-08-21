<template>
  <div class="card-base p-5 relative overflow-hidden">
    <!-- 标题 (带左侧绿色竖条指示器) -->
    <div class="flex items-center gap-2 mb-3.5">
      <span class="w-1.5 h-4.5 rounded-full bg-(--primary)"></span>
      <h4 class="font-bold text-base text-(--text-bright)">最新动态</h4>
    </div>

    <!-- 动态列表 (采用原版 Material Symbols 时钟与置顶图标) -->
    <div class="flex flex-col gap-2">
      <a 
        v-for="item in displayMoments" 
        :key="item.id" 
        href="#essays"
        class="group flex flex-col gap-1.5 p-2 rounded-xl text-neutral-700/85 dark:text-neutral-300/85 hover:bg-(--btn-plain-bg-hover) hover:text-(--primary) transition-all duration-200"
      >
        <div class="flex items-center gap-1.5 text-xs text-(--primary) font-medium">
          <!-- 时钟 SVG -->
          <svg class="w-3.5 h-3.5 shrink-0 fill-current" viewBox="0 0 24 24">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
          <time class="text-xs">{{ item.date }}</time>
          
          <!-- 置顶标签 -->
          <span 
            v-if="item.pinned || item.id === 1" 
            class="ml-auto inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-(--primary)/12 text-(--primary) font-bold"
          >
            <!-- 图钉 SVG -->
            <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2z"/>
            </svg>
            置顶
          </span>
        </div>
        <p class="m-0 line-clamp-2 text-xs md:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed group-hover:text-(--primary) transition-colors">
          {{ item.content }}
        </p>
      </a>
    </div>

    <!-- 底部查看更多 -->
    <div class="mt-2 pt-2 border-t border-(--line-divider) text-center">
      <a 
        href="#essays" 
        class="btn-plain flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs text-(--primary) font-semibold hover:underline"
      >
        <!-- 动态流图标 SVG -->
        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M4 21q-.825 0-1.412-.587T2 19v-6q0-.425.288-.712T3 12t.713.288T4 13v6h8q.425 0 .713.288T13 20t-.288.713T12 21zm4-4q-.825 0-1.412-.587T6 15V9q0-.425.288-.712T7 8t.713.288T8 9v6h8q.425 0 .713.288T17 16t-.288.713T16 17zm4-4q-.825 0-1.412-.587T10 11V5q0-.825.588-1.412T12 3h8q.825 0 1.413.588T22 5v6q0 .825-.587 1.413T20 13zm0-2h8V7h-8z"/>
        </svg>
        <span>更多动态</span>
        <span class="opacity-70">({{ totalCount }})</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { dynamicConfig } from '../../config'

const displayMoments = computed(() => {
  return dynamicConfig.slice(0, 2)
})

const totalCount = computed(() => {
  return dynamicConfig.length || 4
})
</script>
