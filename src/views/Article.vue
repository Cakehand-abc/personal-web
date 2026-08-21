<template>
  <div class="firefly-article-page w-full min-h-screen">
    <!-- 樱花粒子特效 -->
    <SakuraEffect />

    <div v-if="loading" class="flex justify-center items-center h-screen text-sm text-(--text-dim)">
      正在加载文章...
    </div>

    <template v-else-if="article">
      <!-- 1. Firefly 沉浸式文章顶部 Hero Banner -->
      <div class="article-hero relative w-full h-[45vh] min-h-[320px] max-h-[480px] flex flex-col justify-between overflow-hidden select-none">
        <!-- 封面背景 -->
        <div class="absolute inset-0 z-0 overflow-hidden">
          <img 
            :src="articleCover" 
            :alt="article.title" 
            class="w-full h-full object-cover object-center filter brightness-[0.85] dark:brightness-[0.65]"
          />
          <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70"></div>
        </div>

        <!-- 顶部返回小链接 -->
        <div class="relative z-20 max-w-[1400px] mx-auto w-full px-6 pt-6 flex justify-between items-center">
          <button 
            @click="goBack" 
            class="px-4 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1.5 border border-white/20 transition-all hover:scale-105"
          >
            <span>←</span>
            <span>返回列表</span>
          </button>
        </div>

        <!-- 居中标题与文章信息 -->
        <div class="relative z-20 max-w-4xl mx-auto px-6 text-center text-white pb-6">
          <!-- 分类胶囊 -->
          <div class="flex justify-center items-center gap-2 mb-3">
            <span 
              v-if="article.categoryName" 
              class="px-3 py-1 rounded-full text-xs font-semibold bg-(--primary) text-white shadow-md shadow-(--primary)/30"
            >
              {{ article.categoryName }}
            </span>
          </div>

          <!-- 文章标题 -->
          <h1 class="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 drop-shadow-md">
            {{ article.title }}
          </h1>

          <!-- 文章元数据 (发布时间, 字数, 阅读时间) -->
          <div class="flex flex-wrap justify-center items-center gap-4 text-xs md:text-sm text-white/90">
            <span class="flex items-center gap-1">
              📅 {{ formatDate(article.createTime || article.createdAt) }}
            </span>
            <span>·</span>
            <span>✍️ {{ articleWords }} 字</span>
            <span>·</span>
            <span>⏱️ 约 {{ Math.max(1, Math.ceil(articleWords / 300)) }} 分钟</span>
          </div>
        </div>

        <!-- 底部水波纹过渡 -->
        <div class="relative z-20 w-full">
          <WavesEffect />
        </div>
      </div>

      <!-- 2. 主体阅读与目录双栏区域 -->
      <div class="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">
          
          <!-- 左侧正文白盒 -->
          <div class="article-main-card card-base p-6 md:p-10 min-w-0" v-scroll-reveal>
            <!-- 标签列表 -->
            <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap gap-2 mb-6 pb-4 border-b border-(--line-divider)">
              <span 
                v-for="tag in article.tags" 
                :key="tag.id || tag.tagName" 
                class="tag-badge"
              >
                #{{ tag.tagName || tag.name || tag }}
              </span>
            </div>

            <!-- Markdown 内容渲染 -->
            <div class="firefly-markdown-render">
              <MdPreview 
                :modelValue="article.content || article.summary || '*暂无内容*'" 
                :theme="themeStore.isDark ? 'dark' : 'light'" 
                previewTheme="default" 
              />
            </div>

            <!-- 3. 文章版权许可声明 (Firefly 风格 License Block) -->
            <div class="license-box mt-10 p-5 rounded-2xl bg-(--btn-regular-bg) border border-(--line-divider) text-xs">
              <div class="font-bold text-(--text-bright) mb-2 flex items-center gap-1.5 text-sm">
                <span>📜</span>
                <span>版权声明 / License</span>
              </div>
              <div class="flex flex-col gap-1.5 text-(--text-normal)">
                <div><strong>本文作者：</strong>{{ settingStore.siteName ? settingStore.siteName.split(' ')[0] : '博主' }}</div>
                <div><strong>本文链接：</strong><span class="text-(--primary) break-all">{{ currentUrl }}</span></div>
                <div><strong>版权许可：</strong>本博客所有文章除特别声明外，均采用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" class="text-(--primary) underline">CC BY-NC-SA 4.0</a> 许可协议。转载请注明出处！</div>
              </div>
            </div>

            <!-- 底部导航与点赞操作 -->
            <div class="mt-8 pt-6 border-t border-(--line-divider) flex flex-wrap items-center justify-between gap-4">
              <button 
                @click="goBack" 
                class="btn-regular px-5 py-2.5 rounded-xl text-xs font-bold hover:scale-105 active:scale-95 transition-all"
              >
                ← 返回上一页
              </button>

              <div class="flex items-center gap-2">
                <button 
                  @click="handleLike" 
                  class="btn-regular px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
                  :class="{ 'bg-(--primary) text-white': isLiked }"
                >
                  <span>{{ isLiked ? '❤️ 已赞' : '🤍 点赞' }}</span>
                  <span v-if="likeCount > 0">({{ likeCount }})</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 右侧目录 TOC 小组件 (吸顶) -->
          <aside class="toc-column hidden lg:block sticky top-6">
            <div class="card-base p-4">
              <div class="flex items-center gap-2 mb-3 font-bold text-sm text-(--text-bright) border-b border-(--line-divider) pb-2">
                <span>📑</span>
                <span>文章目录</span>
              </div>

              <div v-if="tocList.length === 0" class="text-xs text-(--text-dim) py-4 text-center">
                本文无标题目录
              </div>

              <nav v-else class="toc-nav flex flex-col gap-1 max-h-[70vh] overflow-y-auto pr-1">
                <a 
                  v-for="item in tocList" 
                  :key="item.id" 
                  :href="'#' + item.id"
                  @click.prevent="scrollToHeading(item.id)"
                  class="toc-link text-xs py-1 px-2 rounded-lg transition-colors truncate block"
                  :class="[
                    item.level === 1 ? 'font-bold' : item.level === 2 ? 'pl-4' : 'pl-6 text-[11px]',
                    activeTocId === item.id ? 'bg-(--primary)/15 text-(--primary) font-semibold' : 'text-(--text-normal) hover:text-(--primary)'
                  ]"
                  :title="item.text"
                >
                  {{ item.text }}
                </a>
              </nav>
            </div>
          </aside>

        </div>
      </div>
    </template>

    <div v-else class="flex flex-col justify-center items-center h-screen text-sm text-(--text-dim)">
      <h2 class="text-xl mb-4 font-bold text-(--text-bright)">文章不存在或已被删除</h2>
      <button @click="goBack" class="btn-regular px-4 py-2 rounded-xl text-xs font-bold text-(--primary)">返回首页</button>
    </div>

    <!-- 右下角悬浮控制按钮组 -->
    <FloatingControls />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import WavesEffect from '../components/features/WavesEffect.vue'
import SakuraEffect from '../components/features/SakuraEffect.vue'
import FloatingControls from '../components/controls/FloatingControls.vue'
import { useSettingStore } from '../store/setting'
import { useThemeStore } from '../store/theme'

const route = useRoute()
const router = useRouter()
const settingStore = useSettingStore()
const themeStore = useThemeStore()

const article = ref<any>(null)
const loading = ref(true)
const isLiked = ref(false)
const likeCount = ref(0)
const activeTocId = ref('')

interface TocItem {
  id: string
  text: string
  level: number
}
const tocList = ref<TocItem[]>([])

const currentUrl = computed(() => window.location.href)

const articleCover = computed(() => {
  if (article.value?.coverUrl) return article.value.coverUrl
  return '/assets/images/DesktopWallpaper/d1.avif'
})

const articleWords = computed(() => {
  if (!article.value?.content) return 800
  return article.value.content.length
})

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '2026.07.16'
  return dateStr.substring(0, 10).replace(/-/g, '.')
}

const fetchArticle = async () => {
  const id = route.params.id
  if (!id) return

  try {
    const res = await axios.get(`/api/articles/${id}`)
    if (res.data.code === 200) {
      article.value = res.data.data
      await nextTick()
      generateTOC()
    }
  } catch (err) {
    console.error('获取文章详情失败', err)
  } finally {
    loading.value = false
  }
}

const generateTOC = () => {
  const headings = document.querySelectorAll('.firefly-markdown-render h1, .firefly-markdown-render h2, .firefly-markdown-render h3')
  const list: TocItem[] = []
  
  headings.forEach((heading, idx) => {
    const text = (heading as HTMLElement).innerText || `段落 ${idx + 1}`
    const id = `heading-${idx}`
    heading.setAttribute('id', id)
    const level = parseInt(heading.tagName.replace('H', ''), 10) || 1
    list.push({ id, text, level })
  })

  tocList.value = list
}

const scrollToHeading = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeTocId.value = id
  }
}

const handleLike = () => {
  if (!isLiked.value) {
    isLiked.value = true
    likeCount.value++
  } else {
    isLiked.value = false
    likeCount.value = Math.max(0, likeCount.value - 1)
  }
}

const goBack = () => {
  router.push('/')
}

let tocScrollHandler: any = null

onMounted(() => {
  fetchArticle()

  tocScrollHandler = () => {
    const headings = document.querySelectorAll('.firefly-markdown-render h1, .firefly-markdown-render h2, .firefly-markdown-render h3')
    const trigger = 120
    let current = ''
    headings.forEach((h) => {
      const rect = h.getBoundingClientRect()
      if (rect.top <= trigger) {
        current = h.getAttribute('id') || ''
      }
    })
    if (current) {
      activeTocId.value = current
    }
  }

  window.addEventListener('scroll', tocScrollHandler, { passive: true })
})

onUnmounted(() => {
  if (tocScrollHandler) {
    window.removeEventListener('scroll', tocScrollHandler)
  }
})
</script>

<style scoped>
:deep(.md-editor) {
  --md-bk-color: transparent !important;
  --md-color: var(--text-normal) !important;
  font-family: inherit;
  font-size: 15px;
  line-height: 1.8;
}

:deep(.md-editor h1),
:deep(.md-editor h2),
:deep(.md-editor h3),
:deep(.md-editor h4) {
  color: var(--text-bright) !important;
  font-weight: 700;
  margin-top: 1.8em;
  margin-bottom: 0.8em;
}

:deep(.md-editor blockquote) {
  border-left: 4px solid var(--primary) !important;
  background-color: var(--btn-regular-bg) !important;
  border-radius: 0 0.5rem 0.5rem 0;
  padding: 0.75rem 1rem !important;
  color: var(--text-normal) !important;
}

:deep(.md-editor pre) {
  border-radius: 0.75rem !important;
  border: 1px solid var(--line-divider);
}
</style>
