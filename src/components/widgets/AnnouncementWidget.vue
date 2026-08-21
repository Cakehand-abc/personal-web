<template>
  <div v-if="announcementConfig.enable && visible" class="card-base p-4 relative overflow-hidden" v-scroll-reveal>
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <span class="text-lg">📢</span>
        <h4 class="font-bold text-sm text-(--text-bright)">{{ announcementConfig.title }}</h4>
      </div>
      <button 
        v-if="announcementConfig.closable"
        @click="visible = false" 
        class="text-(--text-dim) hover:text-(--text-bright) p-1 rounded-md transition-colors text-xs"
        title="关闭公告"
      >
        ✕
      </button>
    </div>
    <p class="text-xs text-(--text-normal) leading-relaxed">
      {{ content || announcementConfig.content }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { announcementConfig } from '../../config'

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
