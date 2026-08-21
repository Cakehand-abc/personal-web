<template>
  <div class="card-base p-4" v-scroll-reveal>
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <span class="text-lg">🏷️</span>
        <h4 class="font-bold text-sm text-(--text-bright)">热门标签</h4>
      </div>
      <span class="text-xs text-(--text-dim)">{{ tags.length }} 个</span>
    </div>

    <div v-if="tags.length === 0" class="text-xs text-(--text-dim) text-center py-3">
      暂无标签
    </div>

    <div v-else class="flex flex-wrap gap-2">
      <button
        v-for="tag in tags"
        :key="tag.id || tag.name"
        @click="$emit('select', tag.name)"
        class="tag-pill px-3 py-1 rounded-xl text-xs font-medium transition-all duration-200 border border-transparent"
        :class="activeTag === tag.name 
          ? 'bg-(--primary) text-white shadow-sm shadow-(--primary)/30 scale-105' 
          : 'bg-(--btn-regular-bg) text-(--btn-content) hover:bg-(--btn-regular-bg-hover) hover:border-(--primary)/30'"
      >
        #{{ tag.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tags: Array<{ id?: number; name: string; count?: number }>
  activeTag?: string
}>()

defineEmits<{
  (e: 'select', tagName: string): void
}>()
</script>
