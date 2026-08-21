<template>
  <div class="card-base p-5">
    <!-- 标题 (带左侧绿色竖条指示器 - 100% 对齐原版) -->
    <div class="flex items-center gap-2 mb-3.5">
      <span class="w-1.5 h-4.5 rounded-full bg-(--primary)"></span>
      <h4 class="font-bold text-base text-(--text-bright)">站点统计</h4>
    </div>

    <!-- 统计指标网格列表 (完全对齐 Image 2 原版样式与各行 SVG 间距) -->
    <div class="flex flex-col gap-1.5">
      
      <!-- 1. 文章数 (material-symbols:article-outline) -->
      <div class="flex items-center justify-between px-3 py-1.5">
        <div class="flex items-center gap-2.5">
          <div class="text-(--primary) text-xl flex items-center">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M7 17h7v-2H7zm0-4h10v-2H7zm0-4h10V7H7zM5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm0-2h14V5H5zM5 5v14z"/>
            </svg>
          </div>
          <span class="text-neutral-700 dark:text-neutral-300 font-medium text-sm">文章</span>
        </div>
        <span class="text-base font-bold text-neutral-900 dark:text-neutral-100">{{ articleCount }}</span>
      </div>

      <!-- 2. 分类数 (material-symbols:folder-outline) -->
      <div class="flex items-center justify-between px-3 py-1.5">
        <div class="flex items-center gap-2.5">
          <div class="text-(--primary) text-xl flex items-center">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h6l2 2h8q.825 0 1.413.588T22 8v10q0 .825-.587 1.413T20 20zm0-2h16V8h-8.825l-2-2H4zm0 0V6z"/>
            </svg>
          </div>
          <span class="text-neutral-700 dark:text-neutral-300 font-medium text-sm">分类</span>
        </div>
        <span class="text-base font-bold text-neutral-900 dark:text-neutral-100">{{ categoryCount }}</span>
      </div>

      <!-- 3. 标签数 (material-symbols:label-outline) -->
      <div class="flex items-center justify-between px-3 py-1.5">
        <div class="flex items-center gap-2.5">
          <div class="text-(--primary) text-xl flex items-center">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h11q.475 0 .9.213t.7.587L22 12l-5.4 7.2q-.275.375-.7.588T15 20zm0-2h11l4.5-6L15 6H4zm5.5-6"/>
            </svg>
          </div>
          <span class="text-neutral-700 dark:text-neutral-300 font-medium text-sm">标签</span>
        </div>
        <span class="text-base font-bold text-neutral-900 dark:text-neutral-100">{{ tagCount }}</span>
      </div>

      <!-- 4. 总字数 (material-symbols:text-ad-outline-rounded) -->
      <div class="flex items-center justify-between px-3 py-1.5">
        <div class="flex items-center gap-2.5">
          <div class="text-(--primary) text-xl flex items-center">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm0-2h16V6H4zm0 0V6zm2-1h12q.425 0 .713-.288T19 16t-.288-.712T18 15H6q-.425 0-.712.288T5 16t.288.713T6 17m0-4h12q.425 0 .713-.288T19 12t-.288-.712T18 11H6q-.425 0-.712.288T5 12t.288.713T6 13m0-4h8q.425 0 .713-.288T15 8t-.288-.712T14 7H6q-.425 0-.712.288T5 8t.288.713T6 9"/>
            </svg>
          </div>
          <span class="text-neutral-700 dark:text-neutral-300 font-medium text-sm">总字数</span>
        </div>
        <span class="text-base font-bold text-neutral-900 dark:text-neutral-100">{{ formattedWords }}</span>
      </div>

      <!-- 5. 运行时长 (material-symbols:calendar-clock-outline) -->
      <div class="flex items-center justify-between px-3 py-1.5">
        <div class="flex items-center gap-2.5">
          <div class="text-(--primary) text-xl flex items-center">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M5 8h14V6H5zm0 0V6zm0 14q-.825 0-1.412-.587T3 20V6q0-.825.588-1.412T5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588T21 6v5.675q-.475-.225-.975-.375T19 11.075V10H5v10h6.3q.175.55.413 1.05t.562.95zm9.463-.462Q13 20.075 13 18t1.463-3.537T18 13t3.538 1.463T23 18t-1.463 3.538T18 23t-3.537-1.463m5.212-1.162l.7-.7L18.5 17.8V15h-1v3.2z"/>
            </svg>
          </div>
          <span class="text-neutral-700 dark:text-neutral-300 font-medium text-sm">运行时长</span>
        </div>
        <div class="flex items-center">
          <span class="text-base font-bold text-neutral-900 dark:text-neutral-100">{{ runningDays }}</span>
          <span class="ml-1 text-sm text-neutral-500 dark:text-neutral-400"> 天</span>
        </div>
      </div>

      <!-- 6. 最后活动 (mingcute:heartbeat-line) -->
      <div class="flex items-center justify-between px-3 py-1.5">
        <div class="flex items-center gap-2.5">
          <div class="text-(--primary) text-xl flex items-center">
            <svg class="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 12h3l2.5-8L14 20l3-8h3"/>
            </svg>
          </div>
          <span class="text-neutral-700 dark:text-neutral-300 font-medium text-sm">最后活动</span>
        </div>
        <div class="flex items-center">
          <span class="text-base font-bold text-neutral-900 dark:text-neutral-100">刚刚</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { siteConfig } from '../../config'

const props = withDefaults(
  defineProps<{
    articleCount?: number
    categoryCount?: number
    tagCount?: number
    totalWords?: number
    startDate?: string
  }>(),
  {
    articleCount: 13,
    categoryCount: 2,
    tagCount: 19,
    totalWords: 16293,
    startDate: ''
  }
)

const formattedWords = computed(() => {
  return (props.totalWords || 16293).toLocaleString()
})

const runningDays = computed(() => {
  const dateStr = props.startDate || siteConfig.siteStartDate || '2026-01-01'
  const start = new Date(dateStr).getTime()
  const now = new Date().getTime()
  return Math.max(1, Math.floor((now - start) / (1000 * 60 * 60 * 24)))
})
</script>
