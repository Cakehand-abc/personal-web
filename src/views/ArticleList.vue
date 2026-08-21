<template>
  <div class="articles-archive-page min-h-screen bg-(--page-bg)">
    <!-- 顶部全景壁纸 Banner + 落樱与水波纹 -->
    <FireflyBanner />
    <SakuraEffect />

    <!-- 主体栅格容器 (标准双栏大宽屏沉浸式布局，保留右侧各栏目) -->
    <div class="max-w-[1440px] mx-auto px-4 md:px-8 py-8 relative z-20">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-8 items-start">
        
        <!-- 左侧主内容流 (文章归档大全) -->
        <div class="main-stream-column flex flex-col gap-6 min-w-0">

          <!-- 1. 文章列表头部卡片与纯净搜索框 (无多余文字、无多余标签) -->
          <div class="card-base p-6 md:p-8 relative overflow-hidden">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 rounded-xl bg-(--primary) flex items-center justify-center text-white text-lg shadow-sm">
                  📚
                </div>
                <h2 class="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100">精选文章</h2>
              </div>
              <span class="text-xs text-(--text-dim)">
                共 {{ articles.length }} 篇
              </span>
            </div>
            <p class="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              技术探索与系统架构深度归档
            </p>

            <!-- 纯净搜索框 (无占位文字) -->
            <div class="relative w-full">
              <input 
                v-model="searchQuery"
                type="text" 
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-(--line-divider) bg-(--btn-regular-bg) text-xs md:text-sm text-(--text-bright) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20 transition-all"
              />
              <svg class="w-4 h-4 text-neutral-400 absolute left-3.5 top-3 fill-current" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 14z"/>
              </svg>
            </div>
          </div>

          <!-- 2. 文章卡片流 (200px 高度经典对齐卡片) -->
          <div v-if="loading" class="text-center py-16 text-sm text-(--text-dim)">
            正在加载文章列表中...
          </div>
          <div v-else-if="filteredArticles.length === 0" class="card-base p-12 text-center text-sm text-(--text-dim)">
            未找到相关文章～
          </div>
          <div v-else class="flex flex-col gap-4">
            <ArticleCard 
              v-for="article in filteredArticles" 
              :key="article.id" 
              :data="article" 
            />
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
              :article-count="articles.length || 2" 
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
import ArticleCard from '../components/ArticleCard.vue'

const articles = ref<any[]>([])
const loading = ref(true)
const searchQuery = ref('')

const defaultArticles = [
  {
    id: 2,
    title: '现代前端工程化与云端 AI 协同开发实践',
    summary: '现代前端工程化与云端 AI 协同开发实践 在当前的软件工程实践中，前端开发链路的复杂度呈指数级上升。传统的本地开发环境在应对大型复杂项目时，往往受限于硬件资源的瓶颈。本文将探讨如何利用集成大语言模型的云端工作区...',
    createTime: '2026-06-18T16:25:12',
    categoryName: '开发笔记',
    tags: [{ tagName: '前端' }, { tagName: 'AI' }]
  },
  {
    id: 1,
    title: 'Hello,World',
    summary: '这是我的第一篇博客，记录探索技术与生活的开端。',
    createTime: '2026-06-17T16:25:12',
    isFeatured: true,
    categoryName: '文章示例',
    tags: [{ tagName: '博客' }, { tagName: '启程' }]
  }
]

const fetchArticles = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/articles/list', { params: { current: 1, size: 100 } })
    if (res.data.code === 200 && res.data.data?.records?.length > 0) {
      articles.value = res.data.data.records
    } else {
      articles.value = defaultArticles
    }
  } catch (error) {
    articles.value = defaultArticles
  } finally {
    loading.value = false
  }
}

// 智能模糊搜索
const fuzzyMatch = (text: string, query: string): boolean => {
  if (!text || !query) return false
  const t = text.toLowerCase()
  const q = query.toLowerCase()
  if (t.includes(q)) return true
  const chars = q.split('').filter(c => c.trim().length > 0)
  return chars.every(c => t.includes(c))
}

const filteredArticles = computed(() => {
  const q = searchQuery.value.trim()
  if (!q) return articles.value

  return articles.value.filter(a => {
    const text = `${a.title || ''} ${a.summary || ''} ${a.categoryName || ''}`
    return fuzzyMatch(text, q)
  })
})

onMounted(() => {
  fetchArticles()
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>
