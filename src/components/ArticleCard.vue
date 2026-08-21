<template>
  <div 
    @click="goToArticle" 
    class="post-card-wrapper card-base cursor-pointer group flex flex-col justify-between overflow-hidden relative transition-all duration-300 hover:-translate-y-1"
    :class="[
      isGrid ? 'h-full' : 'md:flex-row min-h-[180px]',
      displayCover ? 'has-cover' : 'no-cover'
    ]"
    v-scroll-reveal
  >
    <!-- 封面图部分 (如果是网格模式放上方；如果是列表模式放右侧) -->
    <div 
      v-if="displayCover"
      class="post-card-image relative overflow-hidden flex-shrink-0"
      :class="isGrid ? 'w-full aspect-[16/9]' : 'w-full md:w-[32%] md:min-w-[200px] md:max-w-[260px] aspect-[16/10] md:aspect-auto md:order-2'"
    >
      <img 
        :src="displayCover" 
        :alt="data.title" 
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        @error="handleImageError"
      />
      <!-- 悬浮微光遮罩 -->
      <div class="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors"></div>
      
      <!-- 悬浮箭头图标 -->
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span class="w-10 h-10 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md flex items-center justify-center text-(--primary) text-lg shadow-md transform scale-75 group-hover:scale-100 transition-transform">
          →
        </span>
      </div>

      <!-- 分类角标 (在图片右上角) -->
      <span 
        v-if="data.categoryName" 
        class="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-sm"
      >
        {{ data.categoryName }}
      </span>
    </div>

    <!-- 文字与元信息内容区域 -->
    <div 
      class="post-card-content p-5 md:p-6 flex flex-col justify-between flex-1 relative"
      :class="{ 'md:order-1': !isGrid }"
    >
      <div>
        <!-- 头部元信息：置顶、发布时间、阅读预估 -->
        <div class="post-meta flex flex-wrap items-center gap-2 text-xs text-(--text-dim) mb-2.5">
          <span v-if="data.isFeatured || data.pinned" class="px-2 py-0.5 rounded-md bg-(--primary)/15 text-(--primary) font-bold flex items-center gap-1">
            <span>📌</span> 置顶
          </span>
          <span v-if="!displayCover && data.categoryName" class="px-2 py-0.5 rounded-md bg-(--btn-regular-bg) text-(--btn-content) font-medium">
            {{ data.categoryName }}
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" stroke-width="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke-width="2"/></svg>
            {{ formatDate(data.createTime || data.date) }}
          </span>
          <span>·</span>
          <span>{{ estimateReadingTime(data.summary || data.content) }} 分钟阅读</span>
        </div>

        <!-- 文章标题 (带 Firefly 左侧竖条指示与 hover 强调色) -->
        <h3 class="post-title text-lg md:text-xl font-bold text-(--text-bright) mb-2.5 leading-snug line-clamp-2 group-hover:text-(--primary) transition-colors relative pl-0 md:group-hover:pl-2">
          {{ data.title }}
        </h3>

        <!-- 文章摘要描述 -->
        <p class="post-summary text-xs md:text-sm text-(--text-normal) leading-relaxed line-clamp-2 md:line-clamp-3 mb-4">
          {{ data.summary || '这是一篇精彩的博文，点击进入查看完整内容与细节分享...' }}
        </p>
      </div>

      <!-- 底部标签与操作栏 -->
      <div class="post-footer flex items-center justify-between mt-auto pt-2 border-t border-(--line-divider)">
        <!-- 标签组 -->
        <div class="flex flex-wrap gap-1.5 items-center max-w-[80%]">
          <span 
            v-for="tag in tagList" 
            :key="tag.id || tag.name || tag" 
            class="text-[11px] font-medium text-(--text-dim) hover:text-(--primary) transition-colors"
          >
            #{{ tag.name || tag.tagName || tag }}
          </span>
          <span v-if="tagList.length === 0" class="text-[11px] text-(--text-dim)">#日常随笔</span>
        </div>

        <!-- 列表无图时的独立进入按钮 -->
        <div 
          v-if="!displayCover" 
          class="btn-regular w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold group-hover:bg-(--primary) group-hover:text-white transition-colors"
        >
          →
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { activeSection } from '../store/navState'
import { useThemeStore } from '../store/theme'

const props = defineProps<{
  data: any
  grid?: boolean
}>()

const router = useRouter()
const themeStore = useThemeStore()

const isGrid = computed(() => {
  if (props.grid !== undefined) return props.grid
  return themeStore.postLayout === 'grid'
})

const defaultCovers = [
  '/assets/images/DesktopWallpaper/d1.avif',
  '/assets/images/DesktopWallpaper/d2.avif',
  '/assets/images/DesktopWallpaper/d3.avif',
  '/assets/images/DesktopWallpaper/d4.avif',
  '/assets/images/DesktopWallpaper/d5.avif',
  '/assets/images/DesktopWallpaper/d6.avif'
]

const displayCover = computed(() => {
  if (props.data.coverUrl) return props.data.coverUrl
  if (props.data.cover) return props.data.cover
  // 随机挑选一张默认 Firefly 壁纸作为封面
  const index = Math.abs((props.data.id || 1) % defaultCovers.length)
  return defaultCovers[index]
})

const tagList = computed(() => {
  if (Array.isArray(props.data.tags)) return props.data.tags
  return []
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return '刚刚'
  return dateStr.substring(0, 10).replace(/-/g, '.')
}

const estimateReadingTime = (text?: string) => {
  if (!text) return 3
  const words = text.length
  return Math.max(1, Math.ceil(words / 300))
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/assets/images/DesktopWallpaper/d1.avif'
}

const goToArticle = () => {
  if (props.data && props.data.id !== undefined) {
    router.push({ 
      path: `/article/${props.data.id}`, 
      state: { sourceAnchor: activeSection.value || '#articles' } 
    })
  }
}
</script>

<style scoped>
.post-title {
  transition: all 0.2s ease;
}
</style>
