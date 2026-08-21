<template>
  <div class="firefly-home-page w-full min-h-screen">
    <!-- 樱花粒子特效 (根据设置开关) -->
    <SakuraEffect />

    <!-- 顶部 Firefly 横幅与波浪 (对应 #home 锚点) -->
    <div id="home">
      <FireflyBanner />
    </div>

    <!-- 主页面内容区域 (双栏布局) -->
    <div class="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-8 items-start">
        
        <!-- 左侧主内容流 -->
        <div class="main-content-flow flex flex-col gap-10 min-w-0">
          
          <!-- 1. 精选文章区域 (对应 #featured 锚点) -->
          <div id="featured" class="scroll-mt-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <span class="text-xl">⭐</span>
                <h2 class="text-xl md:text-2xl font-bold text-(--text-bright)">精选推荐 Featured</h2>
              </div>
              <span class="text-xs text-(--text-dim)">精选优质文章</span>
            </div>

            <!-- 精选文章卡片展示 -->
            <div v-if="loading" class="text-center py-8 text-sm text-(--text-dim)">
              加载精选内容中...
            </div>
            <div v-else-if="featuredArticles.length === 0" class="card-base p-6 text-center text-xs text-(--text-dim)">
              暂无精选推荐文章
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div v-for="item in featuredArticles" :key="'feat-' + item.id">
                <ArticleCard :data="item" :grid="true" />
              </div>
            </div>
          </div>

          <!-- 2. 全部文章区域 (对应 #articles 锚点) -->
          <div id="articles" class="scroll-mt-6">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div class="flex items-center gap-2">
                <span class="text-xl">📚</span>
                <h2 class="text-xl md:text-2xl font-bold text-(--text-bright)">全部文章 Articles</h2>
                <span class="text-xs px-2 py-0.5 rounded-full bg-(--primary)/15 text-(--primary) font-bold">
                  {{ filteredArticles.length }}
                </span>
              </div>

              <!-- 列表 / 网格布局切换按钮 -->
              <div class="flex items-center gap-1.5 p-1 rounded-xl bg-(--card-bg) border border-(--line-divider) shadow-sm">
                <button 
                  @click="themeStore.setPostLayout('list')"
                  class="p-1.5 rounded-lg text-xs font-medium transition-colors"
                  :class="themeStore.postLayout === 'list' ? 'bg-(--primary) text-white shadow-sm' : 'text-(--text-dim) hover:text-(--text-bright)'"
                  title="列表视图"
                >
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>
                </button>
                <button 
                  @click="themeStore.setPostLayout('grid')"
                  class="p-1.5 rounded-lg text-xs font-medium transition-colors"
                  :class="themeStore.postLayout === 'grid' ? 'bg-(--primary) text-white shadow-sm' : 'text-(--text-dim) hover:text-(--text-bright)'"
                  title="网格视图"
                >
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M4 4h7v7H4zm9 0h7v7h-7zm0 9h7v7h-7zm-9 0h7v7H4z"/></svg>
                </button>
              </div>
            </div>

            <!-- 分类筛选横条 (Firefly 胶囊风格) -->
            <div class="flex flex-wrap gap-2 mb-6 items-center">
              <button 
                @click="selectedCategory = ''" 
                class="px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all"
                :class="selectedCategory === '' 
                  ? 'bg-(--primary) text-white shadow-sm shadow-(--primary)/25' 
                  : 'bg-(--card-bg) border border-(--line-divider) text-(--text-normal) hover:border-(--primary)/40'"
              >
                全部 ({{ articles.length }})
              </button>
              <button 
                v-for="cat in categoryList" 
                :key="cat.name"
                @click="selectedCategory = cat.name"
                class="px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5"
                :class="selectedCategory === cat.name 
                  ? 'bg-(--primary) text-white shadow-sm shadow-(--primary)/25' 
                  : 'bg-(--card-bg) border border-(--line-divider) text-(--text-normal) hover:border-(--primary)/40'"
              >
                <span>{{ cat.name }}</span>
                <span class="text-[10px] opacity-75">({{ cat.count }})</span>
              </button>
            </div>

            <!-- 文章列表 -->
            <div v-if="loading" class="text-center py-12 text-sm text-(--text-dim)">
              正在获取文章列表...
            </div>
            <div v-else-if="filteredArticles.length === 0" class="card-base p-10 text-center text-sm text-(--text-dim)">
              该分类下暂无文章，稍后再来看看吧～
            </div>
            <div 
              v-else 
              :class="themeStore.postLayout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-5' : 'flex flex-col gap-4'"
            >
              <div v-for="article in filteredArticles" :key="article.id">
                <ArticleCard :data="article" :grid="themeStore.postLayout === 'grid'" />
              </div>
            </div>
          </div>

          <!-- 3. 随笔动态区域 (对应 #essays 锚点) -->
          <div id="essays" class="scroll-mt-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <span class="text-xl">☕</span>
                <h2 class="text-xl md:text-2xl font-bold text-(--text-bright)">随笔动态 Essays</h2>
              </div>
              <span class="text-xs text-(--text-dim)">瞬间的灵感与日常</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(essay, idx) in essaysList" :key="idx" class="card-base p-5 flex flex-col justify-between" v-scroll-reveal>
                <div>
                  <div class="flex items-center justify-between text-xs text-(--text-dim) mb-2">
                    <span class="font-bold text-(--primary) flex items-center gap-1">
                      <span>✨</span> {{ essay.tag }}
                    </span>
                    <span>{{ essay.date }}</span>
                  </div>
                  <p class="text-xs md:text-sm text-(--text-normal) leading-relaxed">
                    {{ essay.content }}
                  </p>
                </div>
                <div class="mt-4 pt-2 border-t border-(--line-divider) flex items-center justify-between text-[11px] text-(--text-dim)">
                  <span>📍 {{ essay.location }}</span>
                  <span>❤️ {{ essay.likes }} 喜欢</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 4. 画廊相册区域 (对应 #gallery 锚点) -->
          <div id="gallery" class="scroll-mt-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <span class="text-xl">🖼️</span>
                <h2 class="text-xl md:text-2xl font-bold text-(--text-bright)">画廊相册 Gallery</h2>
              </div>
              <span class="text-xs text-(--text-dim)">星空与流光的缩影</span>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-3 gap-3.5">
              <div 
                v-for="(img, idx) in galleryImages" 
                :key="idx" 
                class="gallery-card relative rounded-2xl overflow-hidden aspect-[4/3] group cursor-pointer border border-(--line-divider) shadow-sm"
                v-scroll-reveal
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
          </div>

          <!-- 5. 作品集区域 (对应 #projects 锚点) -->
          <div id="projects" class="scroll-mt-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <span class="text-xl">🚀</span>
                <h2 class="text-xl md:text-2xl font-bold text-(--text-bright)">开源作品集 Projects</h2>
              </div>
              <span class="text-xs text-(--text-dim)">实践出真知</span>
            </div>

            <div v-if="projectsLoading" class="text-center py-8 text-sm text-(--text-dim)">
              获取作品集中...
            </div>
            <div v-else-if="projects.length === 0" class="card-base p-8 text-center text-xs text-(--text-dim)">
              暂无作品数据，请在后台添加～
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div 
                v-for="proj in projects" 
                :key="proj.id" 
                class="card-base p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
                v-scroll-reveal
              >
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="font-bold text-base text-(--text-bright)">{{ proj.name }}</h3>
                    <span class="text-[10px] px-2 py-0.5 rounded-md bg-(--primary)/15 text-(--primary) font-medium">开源项目</span>
                  </div>
                  <p class="text-xs text-(--text-normal) leading-relaxed line-clamp-3 mb-4">
                    {{ proj.description || '精心构建的现代化 Web 应用程序与工具。' }}
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
                    v-if="proj.downloadUrl" 
                    :href="proj.downloadUrl" 
                    target="_blank" 
                    class="btn-regular px-3 py-1 text-[11px] font-bold rounded-lg hover:bg-(--primary) hover:text-white transition-colors"
                  >
                    下载源码 ⬇
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- 6. 留言板区域 (对应 #message 锚点) -->
          <div id="message" class="scroll-mt-6">
            <MessageBoard />
          </div>

          <!-- 7. 关于区域锚点 (对应 #about 锚点) -->
          <div id="about" class="scroll-mt-6 card-base p-6">
            <h3 class="text-lg font-bold text-(--text-bright) mb-2 flex items-center gap-2">
              <span>🌸</span> 关于本站
            </h3>
            <p class="text-xs text-(--text-normal) leading-relaxed mb-3">
              这是一个由 Vue 3 + TypeScript 构建，深度融合 Firefly（流萤）清新美学设计的个人空间。
              在此记录技术探索、架构思考与日常生活，愿每一段代码都能如夏夜流萤般照亮前行的路。
            </p>
            <div class="flex flex-wrap gap-2 text-xs">
              <span class="tag-badge">Vue 3</span>
              <span class="tag-badge">TypeScript</span>
              <span class="tag-badge">TailwindCSS</span>
              <span class="tag-badge">Firefly Aesthetic</span>
              <span class="tag-badge">Spring Boot</span>
            </div>
          </div>

        </div>

        <!-- 右侧 Firefly 侧边栏小组件组 (桌面端吸顶 Sticky) -->
        <aside class="sidebar-widgets-column flex flex-col gap-6 lg:sticky lg:top-6">
          <!-- 1. 个人资料卡 -->
          <ProfileWidget 
            :article-count="articles.length"
            :category-count="categoryList.length"
            :tag-count="tagList.length"
          />

          <!-- 2. 公告栏 -->
          <AnnouncementWidget />

          <!-- 3. 文章分类 -->
          <CategoriesWidget 
            :categories="categoryList" 
            :active-category="selectedCategory"
            @select="cat => selectedCategory = (selectedCategory === cat ? '' : cat)"
          />

          <!-- 4. 热门标签云 -->
          <TagsWidget 
            :tags="tagList" 
            :active-tag="selectedTag"
            @select="tag => selectedTag = (selectedTag === tag ? '' : tag)"
          />

          <!-- 5. 站点统计信息 -->
          <SiteStatsWidget 
            :article-count="articles.length"
            :total-words="calculatedTotalWords"
          />
        </aside>

      </div>
    </div>

    <!-- 右下角悬浮控制按钮组 -->
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
import CategoriesWidget from '../components/widgets/CategoriesWidget.vue'
import TagsWidget from '../components/widgets/TagsWidget.vue'
import SiteStatsWidget from '../components/widgets/SiteStatsWidget.vue'
import { useThemeStore } from '../store/theme'
import { activeSection } from '../store/navState'

const themeStore = useThemeStore()

const articles = ref<any[]>([])
const projects = ref<any[]>([])
const loading = ref(true)
const projectsLoading = ref(true)
const selectedCategory = ref('')
const selectedTag = ref('')

const fetchArticles = async () => {
  try {
    const res = await axios.get('/api/articles/list', { params: { current: 1, size: 20 } })
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

// 精选推荐文章 (过滤 isFeatured 或前 2 篇)
const featuredArticles = computed(() => {
  const featured = articles.value.filter(a => a.isFeatured)
  if (featured.length > 0) return featured.slice(0, 2)
  return articles.value.slice(0, 2)
})

// 分类列表统计
const categoryList = computed(() => {
  const map = new Map<string, number>()
  articles.value.forEach(a => {
    const name = a.categoryName || '默认分类'
    map.set(name, (map.get(name) || 0) + 1)
  })
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }))
})

// 标签列表统计
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
  if (map.size === 0) {
    return [
      { name: 'Vue3', count: 2 },
      { name: 'TypeScript', count: 2 },
      { name: 'Firefly', count: 1 },
      { name: '前端工程化', count: 1 }
    ]
  }
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }))
})

// 根据分类和标签过滤文章
const filteredArticles = computed(() => {
  return articles.value.filter(a => {
    if (selectedCategory.value && a.categoryName !== selectedCategory.value) {
      return false
    }
    if (selectedTag.value) {
      if (!Array.isArray(a.tags)) return false
      const hasTag = a.tags.some((t: any) => (t.tagName || t.name || t) === selectedTag.value)
      if (!hasTag) return false
    }
    return true
  })
})

const calculatedTotalWords = computed(() => {
  let count = 0
  articles.value.forEach(a => {
    if (a.summary) count += a.summary.length
    if (a.content) count += a.content.length
  })
  return Math.max(3400, count)
})

// 随笔动态数据
const essaysList = [
  {
    tag: '前端思考',
    date: '2026.07.15',
    content: '今天把个人博客整体换成了 Firefly 流萤风格，OKLCH 色彩空间与毛玻璃卡片的结合确实带来了超清新的质感！',
    location: '深圳 · 科技园',
    likes: 12
  },
  {
    tag: '生活随笔',
    date: '2026.06.28',
    content: '夏夜微风拂过，抬头仰望星空，仿佛能看到漫天飞舞的流萤。愿我们都能在热爱的代码世界里找到光芒。',
    location: '广州 · 珠江边',
    likes: 8
  }
]

// 画廊相册数据
const galleryImages = [
  {
    url: '/assets/images/DesktopWallpaper/d1.avif',
    title: '星空流萤',
    desc: '漫天星辰下的轻声低语'
  },
  {
    url: '/assets/images/DesktopWallpaper/d2.avif',
    title: '林间微光',
    desc: '阳光穿过树梢的宁静午后'
  },
  {
    url: '/assets/images/DesktopWallpaper/d3.avif',
    title: '暮光之城',
    desc: '夕阳染红云层的梦幻时刻'
  },
  {
    url: '/assets/images/DesktopWallpaper/d4.avif',
    title: '静谧湖畔',
    desc: '倒映着无垠星夜的清澈湖水'
  },
  {
    url: '/assets/images/DesktopWallpaper/d5.avif',
    title: '飞萤之约',
    desc: '向着晨曦与光芒奔赴'
  },
  {
    url: '/assets/images/DesktopWallpaper/d6.avif',
    title: '繁星璀璨',
    desc: '宇宙浩瀚，我们都是星尘'
  }
]

// ScrollSpy 滚动监听与 SideNav 联动
let scrollHandler: any = null

onMounted(() => {
  fetchArticles()
  fetchProjects()

  const sections = ['#home', '#featured', '#articles', '#essays', '#gallery', '#projects', '#message', '#about']

  scrollHandler = () => {
    const triggerLine = window.innerHeight / 2
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
</style>
