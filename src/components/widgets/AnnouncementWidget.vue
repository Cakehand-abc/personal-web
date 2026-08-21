<template>
  <div id="signature-widget" class="card-base p-5 relative overflow-hidden h-auto">
    <!-- 标题 (带左侧绿色竖条指示器) -->
    <div class="flex items-center gap-2 mb-2.5">
      <span class="w-1.5 h-4.5 rounded-full bg-(--primary)"></span>
      <h4 class="font-bold text-base text-(--text-bright)">签名</h4>
    </div>

    <!-- 签名正文内容 (高度根据文字行数自适应撑开) -->
    <p class="text-xs md:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed break-words whitespace-pre-line m-0">
      {{ content || announcementConfig.content || '山高水长，天涯未远。愿我们在星光指引下，奔赴所热爱的未来 ✨' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { announcementConfig } from '../../config'

withDefaults(
  defineProps<{
    content?: string
  }>(),
  {
    content: ''
  }
)
</script>
