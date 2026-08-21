<template>
  <div class="home-container min-h-screen relative">
    <!-- 1. 顶部全景壁纸轮播 Banner (包含落樱特效与水波纹) -->
    <FireflyBanner />
    <SakuraEffect />

    <!-- 2. 主体栅格容器 (单侧栏大宽屏沉浸式布局) -->
    <div class="max-w-[1440px] mx-auto px-4 md:px-8 py-8 relative z-20">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-8 items-start">
        
        <!-- 左侧主内容信息流 (板块间距适度舒适) -->
        <div class="main-stream-column flex flex-col gap-9 min-w-0">
          
          <!-- 1. 全部文章列表流 (对应 #articles 锚点，统一 200px 无封面卡片) -->
          <div id="articles" class="scroll-mt-6 flex flex-col gap-4">
            <!-- 板块头部 -->
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center gap-2">
                <span class="w-1.5 h-4.5 rounded-full bg-(--primary)"></span>
                <h2 class="text-xl md:text-2xl font-bold text-(--text-bright)">精选文章 Articles</h2>
              </div>
              <span class="text-xs md:text-sm text-neutral-400">技术探索与系统架构</span>
            </div>

            <!-- 文章加载中 -->
            <div v-if="loading" class="flex justify-center items-center py-16 text-sm text-(--text-dim)">
              正在加载文章中...
            </div>
            <!-- 文章为空 -->
            <div v-else-if="filteredArticles.length === 0" class="card-base p-8 text-center text-xs text-(--text-dim)">
              该分类下暂无文章～
            </div>
            <!-- 文章卡片列表 (高度统一为 200px) -->
            <template v-else>
              <ArticleCard 
                v-for="article in filteredArticles" 
                :key="article.id" 
                :data="article" 
              />
            </template>

            <!-- 右下角金色 More 操作按钮 -->
            <div class="flex justify-end mt-1">
              <a href="#articles" class="section-more-btn flex items-center gap-2 group cursor-pointer select-none">
                <span class="more-text font-serif tracking-widest text-sm font-bold">More</span>
                <svg class="more-arrow-icon w-10 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" viewBox="0 0 100 32" fill="none">
                  <path d="M 8 18 H 86 L 72 6" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- 2. 日常随笔动态区域 (对应 #essays 锚点) -->
          <div id="essays" class="scroll-mt-6 flex flex-col gap-3.5">
            <!-- 板块头部 -->
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center gap-2">
                <span class="w-1.5 h-4.5 rounded-full bg-(--primary)"></span>
                <h2 class="text-xl md:text-2xl font-bold text-(--text-bright)">日常随笔 Essays</h2>
              </div>
              <span class="text-xs md:text-sm text-neutral-400">灵感与生活瞬间</span>
            </div>

            <!-- 随笔卡片流 (从后端/动态数据库读取) -->
            <div v-if="displayMoments.length === 0" class="card-base p-8 text-center text-xs text-(--text-dim)">
              暂无随笔动态，请在后台发布～
            </div>
            <div v-else class="flex flex-col gap-4">
              <div 
                v-for="essay in displayMoments" 
                :key="essay.id" 
                class="card-base p-5 transition-all duration-300 hover:shadow-md border border-(--line-divider)"
              >
                <div class="flex items-center justify-between text-xs text-(--text-dim) mb-2">
                  <span class="font-bold text-(--primary)"># {{ essay.tag || '生活随笔' }}</span>
                  <span>{{ formatDate(essay.createTime || essay.date) }}</span>
                </div>
                <p class="text-xs md:text-sm text-(--text-normal) leading-relaxed">
                  {{ essay.content }}
                </p>
                <div class="mt-3 flex items-center gap-4 text-xs text-(--text-dim)">
                  <span>❤️ {{ essay.likes || 1 }} 喜欢</span>
                </div>
              </div>
            </div>

            <!-- 右下角金色 More 操作按钮 -->
            <div class="flex justify-end mt-1">
              <a href="#essays" class="section-more-btn flex items-center gap-2 group cursor-pointer select-none">
                <span class="more-text font-serif tracking-widest text-sm font-bold">More</span>
                <svg class="more-arrow-icon w-10 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" viewBox="0 0 100 32" fill="none">
                  <path d="M 8 18 H 86 L 72 6" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- 3. 画廊相册区域 (对应 #gallery 锚点) -->
          <div id="gallery" class="scroll-mt-6 flex flex-col gap-3.5">
            <!-- 板块头部 -->
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center gap-2">
                <span class="w-1.5 h-4.5 rounded-full bg-(--primary)"></span>
                <h2 class="text-xl md:text-2xl font-bold text-(--text-bright)">光影长廊 Gallery</h2>
              </div>
              <span class="text-xs md:text-sm text-neutral-400">定格沿途的美好瞬间</span>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-3 gap-3.5">
              <div 
                v-for="(img, idx) in galleryImages" 
                :key="idx" 
                class="gallery-card relative rounded-2xl overflow-hidden aspect-[4/3] group cursor-pointer border border-(--line-divider) shadow-sm"
              >
                <img 
                  :src="img.url" 
                  :alt="img.title" 
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white">
                  <span class="text-xs font-bold">{{ img.title }}</span>
                  <span class="text-[10px] text-white/80">{{ img.desc }}</span>
                </div>
              </div>
            </div>

            <!-- 右下角金色 More 操作按钮 -->
            <div class="flex justify-end mt-1">
              <a href="#gallery" class="section-more-btn flex items-center gap-2 group cursor-pointer select-none">
                <span class="more-text font-serif tracking-widest text-sm font-bold">More</span>
                <svg class="more-arrow-icon w-10 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" viewBox="0 0 100 32" fill="none">
                  <path d="M 8 18 H 86 L 72 6" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- 4. 开源作品集区域 (对应 #projects 锚点 - 直连后端数据库) -->
          <div id="projects" class="scroll-mt-6 flex flex-col gap-3.5">
            <!-- 板块头部 -->
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center gap-2">
                <span class="w-1.5 h-4.5 rounded-full bg-(--primary)"></span>
                <h2 class="text-xl md:text-2xl font-bold text-(--text-bright)">开源作品集 Projects</h2>
              </div>
              <span class="text-xs md:text-sm text-neutral-400">代码创造的开源世界</span>
            </div>

            <div v-if="projectsLoading" class="text-center py-8 text-sm text-(--text-dim)">
              获取作品集中...
            </div>
            <div v-else-if="projects.length === 0" class="card-base p-8 text-center text-xs text-(--text-dim)">
              暂无作品数据，请在后台添加～
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="proj in projects" 
                :key="proj.id" 
                class="card-base p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-md border border-(--line-divider)"
              >
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="font-bold text-base text-(--text-bright)">{{ proj.name }}</h3>
                    <span class="text-[10px] px-2 py-0.5 rounded-md bg-(--primary)/15 text-(--primary) font-medium">开源项目</span>
                  </div>
                  <p class="text-xs text-(--text-normal) leading-relaxed line-clamp-3 mb-4">
                    {{ proj.description || '精心构建的现代化开源项目。' }}
                  </p>
                </div>

                <div class="flex justify-between items-center text-xs pt-3 border-t border-(--line-divider)">
                  <a 
                    v-if="proj.githubUrl" 
                    :href="proj.githubUrl" 
                    target="_blank" 
                    class="text-(--primary) font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>🔗 GitHub 源码</span>
                  </a>
                  <span v-else class="text-(--text-dim)">私有项目</span>

                  <a 
                    v-if="proj.downloadUrl && proj.downloadUrl !== '暂无'" 
                    :href="proj.downloadUrl" 
                    target="_blank" 
                    class="btn-regular px-3 py-1 text-[11px] font-bold rounded-lg hover:bg-(--primary) hover:text-white transition-colors"
                  >
                    下载 ⬇
                  </a>
                </div>
              </div>
            </div>

            <!-- 右下角金色 More 操作按钮 -->
            <div class="flex justify-end mt-1">
              <a href="#projects" class="section-more-btn flex items-center gap-2 group cursor-pointer select-none">
                <span class="more-text font-serif tracking-widest text-sm font-bold">More</span>
                <svg class="more-arrow-icon w-10 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" viewBox="0 0 100 32" fill="none">
                  <path d="M 8 18 H 86 L 72 6" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- 5. 留言板区域 (对应 #message 锚点 - 无需 More 按钮) -->
          <div id="message" class="scroll-mt-6">
            <MessageBoard />
          </div>

          <!-- 6. 关于区域锚点 (对应 #about 锚点 - 无需 More 按钮) -->
          <div id="about" class="scroll-mt-6 card-base p-6 border border-(--line-divider)">
            <h3 class="text-lg font-bold text-(--text-bright) mb-2 flex items-center gap-2">
              <span class="w-1.5 h-4.5 rounded-full bg-(--primary)"></span>
              <span>关于本站</span>
            </h3>
            <p class="text-xs text-(--text-normal) leading-relaxed mb-3">
              这是一个由 Vue 3 + TypeScript 构建，深度融合 Firefly（流萤）清新美学设计的个人空间。
              在此记录技术探索、架构思考与日常生活，愿每一段代码都能如夏夜流萤般照亮前行的路。
            </p>
            
            <!-- 开源致谢与版权声明 -->
            <div class="p-3.5 mb-4 rounded-xl bg-(--btn-regular-bg) border border-(--line-divider) text-xs text-(--text-dim)">
              <p class="font-semibold text-(--text-bright) mb-1 flex items-center gap-1.5">
                <span>🍀</span>
                <span>开源致谢 / Open Source Attribution</span>
              </p>
              <p class="leading-relaxed">
                本站主题界面与交互设计参考并适配自优秀开源项目 
                <a href="https://github.com/CuteLeaf/Firefly" target="_blank" rel="noopener" class="text-(--primary) font-semibold hover:underline">CuteLeaf/Firefly</a>
                与 
                <a href="https://github.com/saicaca/fuwari" target="_blank" rel="noopener" class="text-(--primary) font-semibold hover:underline">saicaca/fuwari</a>，
                遵循 MIT 开源许可协议。流萤相关素材版权归属米哈游《崩坏：星穹铁道》。
              </p>
            </div>

            <div class="flex flex-wrap gap-2 text-xs">
              <span class="tag-badge">Vue 3</span>
              <span class="tag-badge">TypeScript</span>
              <span class="tag-badge">TailwindCSS</span>
              <span class="tag-badge">Firefly Theme</span>
              <span class="tag-badge">Spring Boot</span>
            </div>
          </div>

        </div>

        <!-- 右侧完整小组件栏 (分段式：上部 3 卡片自然滚动，最后 3 卡片吸顶保留) -->
        <aside class="sidebar-widgets-column flex flex-col gap-6 w-full">
          <!-- 上部组件群 (随页面自然同步下滑滚动) -->
          <div class="flex flex-col gap-6">
            <!-- 1. 博主名片卡 (Profile) -->
            <ProfileWidget />

            <!-- 2. 站点公告 (Announcement) -->
            <AnnouncementWidget />

            <!-- 3. 音乐播放器 (Music) -->
            <MusicWidget />
          </div>

          <!-- 下部组件群 (下滑到最后 3 个卡片时吸顶固定 - Sticky，保证始终留存最后三张) -->
          <div class="flex flex-col gap-6 lg:sticky lg:top-6">
            <!-- 4. 最新动态 (Latest Moments) -->
            <DynamicWidget />

            <!-- 5. 站点统计 (Site Stats) -->
            <SiteStatsWidget 
              :article-count="articles.length || 0" 
              :category-count="categoryList.length || 0"
              :tag-count="tagList.length || 0"
              :total-words="calculatedTotalWords" 
            />

            <!-- 6. 站点信息 (Site Info) -->
            <SiteInfoWidget />
          </div>
        </aside>

      </div>
    </div>

    <!-- 右下角悬浮控制按钮 (Back to Top) -->
    <FloatingControls />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import FireflyBanner from '../components/FireflyBanner.vue'
import ArticleCard from '../components/ArticleCard.vue'
import MessageBoard from '../components/MessageBoard.vue'
import SakuraEffect from '../components/features/SakuraEffect.vue'
import FloatingControls from '../components/controls/FloatingControls.vue'
import ProfileWidget from '../components/widgets/ProfileWidget.vue'
import AnnouncementWidget from '../components/widgets/AnnouncementWidget.vue'
import MusicWidget from '../components/widgets/MusicWidget.vue'
import DynamicWidget from '../components/widgets/DynamicWidget.vue'
import SiteStatsWidget from '../components/widgets/SiteStatsWidget.vue'
import SiteInfoWidget from '../components/widgets/SiteInfoWidget.vue'
import { activeSection, isNavScrolling } from '../store/navState'
import { galleryConfig } from '../config'

const articles = ref<any[]>([])
const projects = ref<any[]>([])
const moments = ref<any[]>([])
const dbCategories = ref<any[]>([])
const dbTags = ref<any[]>([])
const loading = ref(true)
const projectsLoading = ref(true)
const selectedCategory = ref('')

const fetchArticles = async () => {
  try {
    const res = await axios.get('/api/articles/list', { params: { current: 1, size: 50 } })
    if (res.data.code === 200 && res.data.data) {
      articles.value = res.data.data.records || []
    }
  } catch (err) {
    console.error('Failed to fetch articles', err)
  } finally {
    loading.value = false
  }
}

const fetchProjects = async () => {
  projectsLoading.value = true
  try {
    const res = await axios.get('/api/projects/list')
    if (res.data.code === 200) {
      projects.value = res.data.data || []
    }
  } catch (error) {
    console.error('获取作品集失败:', error)
  } finally {
    projectsLoading.value = false
  }
}

const fetchMoments = async () => {
  try {
    const res = await axios.get('/api/moments/list')
    if (res.data.code === 200 && Array.isArray(res.data.data)) {
      moments.value = res.data.data
    }
  } catch (error) {
    // 静默降级
  }
}

const fetchCategoriesAndTags = async () => {
  try {
    const [cRes, tRes] = await Promise.all([
      axios.get('/api/categories/list').catch(() => ({ data: { data: [] } })),
      axios.get('/api/tags/list').catch(() => ({ data: { data: [] } }))
    ])
    if (cRes.data?.data) dbCategories.value = cRes.data.data
    if (tRes.data?.data) dbTags.value = tRes.data.data
  } catch (e) {
    // ignore
  }
}

// 随笔动态展示
const displayMoments = computed(() => {
  if (moments.value.length > 0) return moments.value
  return [
    {
      id: 1,
      content: '欢迎来到流萤主题个人空间，探索技术架构与生活点滴 ✨',
      tag: '置顶随笔',
      createTime: '2026-08-21T10:00:00.000Z',
      likes: 12
    }
  ]
})

// 分类列表统计 (优先按数据库文章动态聚合)
const categoryList = computed(() => {
  const map = new Map<string, number>()
  articles.value.forEach(a => {
    const name = a.categoryName || (a.category && a.category.name)
    if (name) {
      map.set(name, (map.get(name) || 0) + 1)
    }
  })
  dbCategories.value.forEach(c => {
    if (!map.has(c.name)) {
      map.set(c.name, 0)
    }
  })
  if (map.size === 0) {
    return [
      { name: '系统运维', count: 1 },
      { name: '开发笔记', count: 1 }
    ]
  }
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }))
})

// 标签列表统计 (优先按数据库文章动态聚合)
const tagList = computed(() => {
  const map = new Map<string, number>()
  articles.value.forEach(a => {
    if (Array.isArray(a.tags)) {
      a.tags.forEach((t: any) => {
        const tagName = t.tagName || t.name || t
        if (tagName) map.set(tagName, (map.get(tagName) || 0) + 1)
      })
    }
  })
  dbTags.value.forEach(t => {
    if (!map.has(t.name)) {
      map.set(t.name, 0)
    }
  })
  if (map.size === 0) {
    return [
      { name: 'Markdown', count: 2 },
      { name: 'Firefly', count: 2 },
      { name: '前端工程化', count: 1 }
    ]
  }
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }))
})

// 根据分类过滤文章
const filteredArticles = computed(() => {
  if (!selectedCategory.value) return articles.value
  return articles.value.filter(a => (a.categoryName || (a.category && a.category.name)) === selectedCategory.value)
})

const calculatedTotalWords = computed(() => {
  let count = 0
  articles.value.forEach(a => {
    if (a.summary) count += a.summary.length
    if (a.content) count += a.content.length
  })
  return Math.max(16293, count)
})

// 画廊相册数据
const galleryImages = galleryConfig

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '2026-08-21'
  return dateStr.substring(0, 10).replace(/\//g, '-')
}

// ScrollSpy 滚动监听与 SideNav 联动
let scrollHandler: any = null

onMounted(() => {
  fetchArticles()
  fetchProjects()
  fetchMoments()
  fetchCategoriesAndTags()

  const sections = ['#home', '#articles', '#essays', '#gallery', '#projects', '#message', '#about']

  let ticking = false
  scrollHandler = () => {
    if (isNavScrolling.value) return
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (!isNavScrolling.value) {
          const triggerLine = window.innerHeight / 3
          let currentId = '#home'
          for (const selector of sections) {
            const el = document.querySelector(selector) as HTMLElement
            if (el) {
              const rect = el.getBoundingClientRect()
              if (rect.top <= triggerLine) {
                currentId = selector
              }
            }
          }
          if (activeSection.value !== currentId) {
            activeSection.value = currentId
          }
        }
        ticking = false
      })
      ticking = true
    }
  }

  window.addEventListener('scroll', scrollHandler, { passive: true })
  scrollHandler()
})

onUnmounted(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }
})
</script>

<style scoped>
.scroll-mt-6 {
  scroll-margin-top: 2rem;
}

/* 金黄色 More 按钮与箭头样式 (完全对齐左侧导航栏金黄色系统) */
.section-more-btn {
  color: #DDB95B;
  transition: all 0.3s ease;
}

.section-more-btn:hover {
  color: #B89030;
}

.more-text {
  background: linear-gradient(90deg, #DDB95B, #B89030);
  -webkit-background-clip: text;
  color: transparent;
}

.more-arrow-icon {
  color: #DDB95B;
}

.section-more-btn:hover .more-arrow-icon {
  color: #B89030;
}
</style>
