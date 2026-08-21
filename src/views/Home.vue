<template>
  <div class="firefly-home w-full min-h-screen">
    <!-- 樱花飘落动效 -->
    <SakuraEffect />

    <!-- 1. 顶部全宽 Firefly 巨幅横幅 Banner (对应 #home 锚点) -->
    <section id="home" class="scroll-mt-0">
      <FireflyBanner />
    </section>

    <!-- 2. 主体双栏区域 (左侧主信息流 + 右侧吸顶小组件栏) -->
    <div class="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-8 items-start">
        
        <!-- 左侧主内容信息流 -->
        <div class="main-stream-column flex flex-col gap-12 min-w-0">
          
          <!-- 1. 编辑精选区域 (对应 #featured 锚点) -->
          <div id="featured" class="scroll-mt-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <span class="text-xl">🌟</span>
                <h2 class="text-xl md:text-2xl font-bold text-(--text-bright)">编辑精选 Featured</h2>
              </div>
              <span class="text-xs text-(--text-dim)">精选优质博文</span>
            </div>

            <!-- 精选文章网格 -->
            <div v-if="featuredArticles.length === 0" class="card-base p-8 text-center text-xs text-(--text-dim)">
              暂无精选文章～
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ArticleCard 
                v-for="article in featuredArticles" 
                :key="'feat-' + article.id" 
                :data="article" 
                layout="grid"
              />
            </div>
          </div>

          <!-- 2. 全部文章列表区域 (对应 #articles 锚点) -->
          <div id="articles" class="scroll-mt-6">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div class="flex items-center gap-2">
                <span class="text-xl">📚</span>
                <h2 class="text-xl md:text-2xl font-bold text-(--text-bright)">全部文章 Articles</h2>
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-(--btn-regular-bg) text-(--btn-content) font-bold">
                  {{ filteredArticles.length }} 篇
                </span>
              </div>

              <!-- 列表 / 网格视图切换开关 -->
              <div class="flex items-center gap-1.5 p-1 rounded-xl bg-(--btn-regular-bg) border border-(--line-divider) text-xs">
                <button 
                  @click="themeStore.setPostLayout('list')" 
                  class="px-2.5 py-1 rounded-lg transition-all font-medium flex items-center gap-1"
                  :class="themeStore.postLayout === 'list' ? 'bg-(--primary) text-white shadow-sm' : 'text-(--text-dim) hover:text-(--text-bright)'"
                  title="列表视图"
                >
                  <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>
                  <span class="hidden sm:inline">列表</span>
                </button>
                <button 
                  @click="themeStore.setPostLayout('grid')" 
                  class="px-2.5 py-1 rounded-lg transition-all font-medium flex items-center gap-1"
                  :class="themeStore.postLayout === 'grid' ? 'bg-(--primary) text-white shadow-sm' : 'text-(--text-dim) hover:text-(--text-bright)'"
                  title="网格视图"
                >
                  <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M4 4h7v7H4zm9 0h7v7h-7zm-9 9h7v7H4zm9 0h7v7h-7z"/></svg>
                  <span class="hidden sm:inline">网格</span>
                </button>
              </div>
            </div>

            <!-- 分类筛选小标签栏 -->
            <div v-if="categoryList.length > 0" class="flex flex-wrap gap-2 mb-4">
              <button 
                @click="selectedCategory = ''" 
                class="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                :class="selectedCategory === '' ? 'bg-(--primary) text-white shadow-sm' : 'btn-regular text-(--text-normal)'"
              >
                全部
              </button>
              <button 
                v-for="cat in categoryList" 
                :key="cat.name"
                @click="selectedCategory = cat.name"
                class="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                :class="selectedCategory === cat.name ? 'bg-(--primary) text-white shadow-sm' : 'btn-regular text-(--text-normal)'"
              >
                {{ cat.name }} ({{ cat.count }})
              </button>
            </div>

            <!-- 文章列表主体渲染 -->
            <div v-if="loading" class="flex justify-center items-center py-16 text-sm text-(--text-dim)">
              正在加载文章中...
            </div>
            <div v-else-if="filteredArticles.length === 0" class="card-base p-8 text-center text-xs text-(--text-dim)">
              该分类下暂无文章～
            </div>
            <div 
              v-else 
              :class="themeStore.postLayout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-5' : 'flex flex-col gap-4'"
            >
              <ArticleCard 
                v-for="article in filteredArticles" 
                :key="article.id" 
                :data="article" 
                :layout="themeStore.postLayout"
              />
            </div>
          </div>

          <!-- 3. 随笔动态区域 (对应 #essays 锚点) -->
          <div id="essays" class="scroll-mt-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <span class="text-xl">🍃</span>
                <h2 class="text-xl md:text-2xl font-bold text-(--text-bright)">日常随笔 Essays</h2>
              </div>
              <span class="text-xs text-(--text-dim)">记录灵感与生活的切片</span>
            </div>

            <!-- 随笔卡片流 -->
            <div class="flex flex-col gap-4">
              <div 
                v-for="(essay, idx) in essaysList" 
                :key="idx" 
                class="card-base p-5 transition-all duration-300 hover:scale-[1.01]"
                v-scroll-reveal
              >
                <div class="flex items-center justify-between text-xs text-(--text-dim) mb-2">
                  <span class="font-bold text-(--primary)"># {{ essay.tag }}</span>
                  <span>{{ essay.date }}</span>
                </div>
                <p class="text-xs md:text-sm text-(--text-normal) leading-relaxed">
                  {{ essay.content }}
                </p>
                <div class="mt-3 flex items-center gap-4 text-xs text-(--text-dim)">
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
            <div v-else-if="displayProjects.length === 0" class="card-base p-8 text-center text-xs text-(--text-dim)">
              暂无作品数据，请在后台添加～
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div 
                v-for="proj in displayProjects" 
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

        <!-- 右侧 Firefly 侧边栏小组件组 (桌面端吸顶 Sticky) -->
        <aside class="sidebar-widgets-column flex flex-col gap-6 lg:sticky lg:top-6">
          <!-- 1. 个人资料卡 -->
          <ProfileWidget 
            v-if="sidebarConfig.widgets.profile"
            :article-count="articles.length"
            :category-count="categoryList.length"
            :tag-count="tagList.length"
          />

          <!-- 2. 公告栏 -->
          <AnnouncementWidget 
            v-if="sidebarConfig.widgets.announcement"
          />

          <!-- 3. 文章分类 -->
          <CategoriesWidget 
            v-if="sidebarConfig.widgets.categories"
            :categories="categoryList" 
            :active-category="selectedCategory"
            @select="cat => selectedCategory = (selectedCategory === cat ? '' : cat)"
          />

          <!-- 4. 热门标签云 -->
          <TagsWidget 
            v-if="sidebarConfig.widgets.tags"
            :tags="tagList" 
            :active-tag="selectedTag"
            @select="tag => selectedTag = (selectedTag === tag ? '' : tag)"
          />

          <!-- 5. 站点统计 -->
          <SiteStatsWidget 
            v-if="sidebarConfig.widgets.siteStats"
            :article-count="articles.length" 
            :total-words="calculatedTotalWords" 
          />
        </aside>

      </div>
    </div>

    <!-- 右下角悬浮控制按钮组 (Back to Top / 亮暗切换 / 色相调节 / 樱花开关) -->
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
import { 
  sidebarConfig, 
  galleryConfig, 
  dynamicConfig, 
  projectsConfig 
} from '../config'

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

// 作品集：优先展示后端数据，若后端为空则降级为 projectsConfig 静态配置
const displayProjects = computed(() => {
  if (projects.value.length > 0) return projects.value
  return projectsConfig
})

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

// 随笔动态数据（从 config/dynamicConfig 导入）
const essaysList = dynamicConfig

// 画廊相册数据（从 config/galleryConfig 导入）
const galleryImages = galleryConfig

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
