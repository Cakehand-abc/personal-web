<template>
  <div class="card-base p-4" v-scroll-reveal>
    <div class="flex items-center gap-2 mb-3">
      <span class="text-lg">📊</span>
      <h4 class="font-bold text-sm text-(--text-bright)">站点统计</h4>
    </div>

    <div class="flex flex-col gap-2.5 text-xs">
      <div class="flex items-center justify-between">
        <span class="text-(--text-dim)">文章总数</span>
        <span class="font-bold text-(--text-bright)">{{ articleCount }} 篇</span>
      </div>

      <div class="flex items-center justify-between">
        <span class="text-(--text-dim)">全站总字数</span>
        <span class="font-bold text-(--text-bright)">{{ totalWords }} 字</span>
      </div>

      <div class="flex items-center justify-between">
        <span class="text-(--text-dim)">建站运行时长</span>
        <span class="font-bold text-(--primary)">{{ runningDays }} 天</span>
      </div>

      <div class="flex items-center justify-between">
        <span class="text-(--text-dim)">最后活动</span>
        <span class="font-medium text-(--text-dim)">刚刚</span>
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
    totalWords?: number
    startDate?: string
  }>(),
  {
    articleCount: 2,
    totalWords: 3420,
    startDate: ''
  }
)

const runningDays = computed(() => {
  const dateStr = props.startDate || siteConfig.siteStartDate || '2026-01-01'
  const start = new Date(dateStr).getTime()
  const now = new Date().getTime()
  const diff = Math.max(1, Math.floor((now - start) / (1000 * 60 * 60 * 24)))
  return diff
})
</script>
