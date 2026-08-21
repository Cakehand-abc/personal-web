<template>
  <div class="card-base p-4" v-scroll-reveal>
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <span class="text-lg">📁</span>
        <h4 class="font-bold text-sm text-(--text-bright)">文章分类</h4>
      </div>
      <span class="text-xs text-(--text-dim)">{{ categories.length }} 个</span>
    </div>

    <div v-if="categories.length === 0" class="text-xs text-(--text-dim) text-center py-3">
      暂无分类
    </div>

    <div v-else class="flex flex-col gap-1.5">
      <button
        v-for="cat in categories"
        :key="cat.id || cat.name"
        @click="$emit('select', cat.name)"
        class="category-item flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group hover:bg-(--btn-regular-bg)"
        :class="{ 'bg-(--primary) text-white hover:bg-(--primary)': activeCategory === cat.name }"
      >
        <span class="truncate">{{ cat.name }}</span>
        <span 
          class="badge text-[11px] px-2 py-0.5 rounded-full transition-colors"
          :class="activeCategory === cat.name ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/10 text-(--text-dim)'"
        >
          {{ cat.count || 1 }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  categories: Array<{ id?: number; name: string; count?: number }>
  activeCategory?: string
}>()

defineEmits<{
  (e: 'select', categoryName: string): void
}>()
</script>
