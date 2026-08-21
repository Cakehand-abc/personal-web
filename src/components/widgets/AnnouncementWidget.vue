<template>
  <div v-if="visible" class="card-base p-4 relative overflow-hidden" v-scroll-reveal>
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <span class="text-lg">📢</span>
        <h4 class="font-bold text-sm text-(--text-bright)">站点公告</h4>
      </div>
      <button 
        @click="visible = false" 
        class="text-(--text-dim) hover:text-(--text-bright) p-1 rounded-md transition-colors text-xs"
        title="关闭公告"
      >
        ✕
      </button>
    </div>
    <p class="text-xs text-(--text-normal) leading-relaxed">
      {{ content || '欢迎来到我的全新 Firefly 风格个人博客！这里汇聚了前端技术、生活随笔、画廊与开源项目，愿你在此收获温暖与灵感。' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
  defineProps<{
    content?: string
  }>(),
  {
    content: ''
  }
)

const visible = ref(true)
</script>
