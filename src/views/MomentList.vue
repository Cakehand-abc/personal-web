<template>
  <div class="moments-timeline-page min-h-screen bg-(--page-bg)">
    <!-- 顶部全景壁纸 Banner + 落樱与水波纹 -->
    <FireflyBanner />
    <SakuraEffect />

    <!-- 主体栅格容器 (标准双栏大宽屏沉浸式布局，保留右侧各栏目) -->
    <div class="max-w-[1440px] mx-auto px-4 md:px-8 py-8 relative z-20">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-8 items-start">
        
        <!-- 左侧主内容流 (日常随笔动态) -->
        <div class="main-stream-column flex flex-col gap-6 min-w-0">

          <!-- 1. 随笔头部卡片 -->
          <div class="card-base p-6 md:p-8 relative overflow-hidden">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 rounded-xl bg-(--primary) flex items-center justify-center text-white text-lg shadow-sm">
                  🍃
                </div>
                <h2 class="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100">日常随笔</h2>
              </div>
              <span class="text-xs text-(--text-dim)">
                共 {{ displayMoments.length }} 条动态
              </span>
            </div>
            <p class="text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
              碎碎念、灵感火花与生活瞬间的时间轴记录
            </p>
          </div>

          <!-- 2. 随笔卡片流 (时间轴卡片) -->
          <div v-if="loading" class="text-center py-16 text-sm text-(--text-dim)">
            正在加载随笔动态中...
          </div>
          <div v-else class="flex flex-col gap-4">
            <div 
              v-for="moment in displayMoments" 
              :key="moment.id"
              class="card-base p-6 transition-all duration-300 hover:shadow-md border border-(--line-divider)"
            >
              <!-- 头部标签与发布时间 -->
              <div class="flex items-center justify-between text-xs text-(--text-dim) mb-3 pb-2.5 border-b border-(--line-divider)">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-(--primary) animate-pulse"></span>
                  <span class="font-bold text-(--primary) text-xs md:text-sm"># {{ moment.tag || '生活随笔' }}</span>
                </div>
                <span>📅 {{ formatDate(moment.createTime) }}</span>
              </div>

              <!-- 正文内容 -->
              <p class="text-xs md:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed break-words whitespace-pre-line mb-4">
                {{ moment.content }}
              </p>

              <!-- 底部点赞互动栏 -->
              <div class="flex items-center justify-between text-xs text-(--text-dim) pt-2 border-t border-(--line-divider)/60">
                <button 
                  @click="handleLike(moment)"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-(--btn-regular-bg) hover:bg-(--primary) hover:text-white transition-all font-semibold cursor-pointer"
                  :class="{ 'bg-(--primary) text-white': moment.isLiked }"
                >
                  <span>{{ moment.isLiked ? '❤️ 已赞' : '🤍 点赞' }}</span>
                  <span>({{ moment.likes || 0 }})</span>
                </button>

                <span class="text-[11px] text-neutral-400">
                  Firefly Moments
                </span>
              </div>
            </div>
          </div>

        </div>

        <!-- 右侧完整小组件栏 (分段式：上部 3 卡片自然滚动，最后 3 卡片吸顶保留) -->
        <aside class="sidebar-widgets-column flex flex-col gap-6 w-full">
          <div class="flex flex-col gap-6">
            <ProfileWidget />
            <AnnouncementWidget />
            <MusicWidget />
          </div>

          <div class="flex flex-col gap-6 lg:sticky lg:top-6">
            <DynamicWidget />
            <SiteStatsWidget 
              :article-count="2" 
              :category-count="2"
              :tag-count="3"
              :total-words="16293" 
            />
            <SiteInfoWidget />
          </div>
        </aside>

      </div>
    </div>

    <!-- 底部悬浮控制组件 -->
    <FloatingControls />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import FireflyBanner from '../components/FireflyBanner.vue'
import SakuraEffect from '../components/features/SakuraEffect.vue'
import FloatingControls from '../components/controls/FloatingControls.vue'
import ProfileWidget from '../components/widgets/ProfileWidget.vue'
import AnnouncementWidget from '../components/widgets/AnnouncementWidget.vue'
import MusicWidget from '../components/widgets/MusicWidget.vue'
import DynamicWidget from '../components/widgets/DynamicWidget.vue'
import SiteStatsWidget from '../components/widgets/SiteStatsWidget.vue'
import SiteInfoWidget from '../components/widgets/SiteInfoWidget.vue'

const moments = ref<any[]>([])
const loading = ref(true)

const defaultMoments = [
  {
    id: 1,
    content: '欢迎来到日常随笔空间！这里记录代码之外的生活点滴与思考瞬间。愿我们始终心怀热忱，不负韶华 ✨',
    tag: '置顶随笔',
    createTime: '2026-08-21T10:00:00.000Z',
    likes: 18
  },
  {
    id: 2,
    content: '在 Astro 与 Vue 3 之间探寻属于自己的现代化前端工程化美学，Firefly（流萤）的主题质感真的太令人心动了。',
    tag: '技术沉思',
    createTime: '2026-08-19T14:20:00.000Z',
    likes: 9
  }
]

const displayMoments = computed(() => {
  return moments.value.length > 0 ? moments.value : defaultMoments
})

const fetchMoments = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/moments/list')
    if (res.data.code === 200 && Array.isArray(res.data.data) && res.data.data.length > 0) {
      moments.value = res.data.data
    }
  } catch (error) {
    // 降级显示
  } finally {
    loading.value = false
  }
}

const handleLike = (item: any) => {
  if (item.isLiked) {
    item.likes = Math.max(0, (item.likes || 1) - 1)
    item.isLiked = false
  } else {
    item.likes = (item.likes || 0) + 1
    item.isLiked = true
  }
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '2026-08-21'
  return dateStr.substring(0, 10).replace(/\//g, '-')
}

onMounted(() => {
  fetchMoments()
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>
