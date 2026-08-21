<template>
  <div class="home-container min-h-screen relative">
    <!-- 1. 顶部全景壁纸轮播 Banner (包含落樱特效与水波纹) -->
    <FireflyBanner />
    <SakuraEffect />

    <!-- 2. 主体栅格容器 (单侧栏大宽屏沉浸式布局) -->
    <div class="max-w-[1440px] mx-auto px-4 md:px-8 py-8 relative z-20">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-8 items-start">
        
        <!-- 左侧主内容信息流 -->
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
            <!-- 文章卡片列表 (高度统一为 200px) -->
            <!-- 文章卡片列表 (主页最多展示 3 条，更多需点击 More) -->
            <template v-else>
              <ArticleCard 
                v-for="article in displayArticles.slice(0, 3)" 
                :key="article.id" 
                :data="article" 
              />
            </template>

            <!-- 右下角金色 More 操作按钮 (点击跳转至独立文章大全页面 /articles) -->
            <div class="flex justify-end mt-1">
              <router-link to="/articles" class="section-more-btn flex items-center gap-2 group cursor-pointer select-none">
                <span class="more-text font-serif tracking-widest text-sm font-bold">More</span>
                <svg class="more-arrow-icon w-10 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" viewBox="0 0 100 32" fill="none">
                  <path d="M 8 18 H 86 L 72 6" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </router-link>
            </div>
          </div>

          <!-- 2. 日常随笔动态区域 (对应 #essays 锚点 - 主页展示 3 条) -->
          <div id="essays" class="scroll-mt-6 flex flex-col gap-3.5">
            <!-- 板块头部 -->
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center gap-2">
                <span class="w-1.5 h-4.5 rounded-full bg-(--primary)"></span>
                <h2 class="text-xl md:text-2xl font-bold text-(--text-bright)">日常随笔 Essays</h2>
              </div>
              <span class="text-xs md:text-sm text-neutral-400">灵感与生活瞬间</span>
            </div>

            <!-- 随笔卡片流 (主页展示 3 条) -->
            <div class="flex flex-col gap-4">
              <div 
                v-for="essay in displayMoments.slice(0, 3)" 
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

            <!-- 右下角金色 More 操作按钮 (点击跳转至独立随笔时间轴页面 /essays) -->
            <div class="flex justify-end mt-1">
              <router-link to="/essays" class="section-more-btn flex items-center gap-2 group cursor-pointer select-none">
                <span class="more-text font-serif tracking-widest text-sm font-bold">More</span>
                <svg class="more-arrow-icon w-10 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" viewBox="0 0 100 32" fill="none">
                  <path d="M 8 18 H 86 L 72 6" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </router-link>
            </div>
          </div>

          <!-- 3. 光影长廊区域 (对应 #gallery 锚点 - 主页最多展示 2 行即 4 张相册卡片) -->
          <div id="gallery" class="scroll-mt-6 flex flex-col gap-3.5">
            <!-- 板块头部 -->
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center gap-2">
                <span class="w-1.5 h-4.5 rounded-full bg-(--primary)"></span>
                <h2 class="text-xl md:text-2xl font-bold text-(--text-bright)">光影长廊 Gallery</h2>
              </div>
              <span class="text-xs md:text-sm text-neutral-400">定格沿途的美好瞬间</span>
            </div>

            <!-- 首页相册堆叠卡片预览网格 (最多 2 行) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                v-for="album in homeAlbums.slice(0, 4)" 
                :key="album.id" 
                @click="goToGallery"
                class="group relative cursor-pointer"
              >
                <!-- 底部堆叠阴影层 -->
                <div class="absolute inset-0 rounded-2xl bg-neutral-200/80 dark:bg-neutral-800/80 transform rotate-1 translate-y-1 scale-[0.98] transition-transform duration-300 group-hover:rotate-2"></div>

                <!-- 主相册封面卡片 -->
                <div class="relative z-10 rounded-2xl overflow-hidden aspect-[16/10] border border-(--line-divider) shadow-sm bg-neutral-900">
                  <img 
                    :src="album.cover || album.photos[0]?.url" 
                    :alt="album.name" 
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <!-- 右上角数量徽标 -->
                  <div class="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                    <span>{{ album.photos.length }} 张照片</span>
                  </div>
                  <!-- 底部信息渐变遮罩 -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white z-20">
                    <h3 class="text-base md:text-lg font-bold group-hover:text-(--primary) transition-colors">
                      {{ album.name }}
                    </h3>
                    <p class="text-xs text-white/80 line-clamp-1 mt-0.5">
                      {{ album.description }}
                    </p>
                    <div class="flex items-center justify-between text-[11px] text-white/60 mt-2 pt-2 border-t border-white/10">
                      <span>{{ album.date }}</span>
                      <span class="text-(--primary) font-semibold">进入相册 ➔</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右下角金色 More 操作按钮 (点击跳转至独立光影长廊相册页面 /gallery) -->
            <div class="flex justify-end mt-1">
              <router-link to="/gallery" class="section-more-btn flex items-center gap-2 group cursor-pointer select-none">
                <span class="more-text font-serif tracking-widest text-sm font-bold">More</span>
                <svg class="more-arrow-icon w-10 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" viewBox="0 0 100 32" fill="none">
                  <path d="M 8 18 H 86 L 72 6" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </router-link>
            </div>
          </div>

          <!-- 4. 开源作品集区域 (对应 #projects 锚点 - 主页最多展示 2 行即 4 个作品) -->
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
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="proj in displayProjects.slice(0, 4)" 
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

            <!-- 右下角金色 More 操作按钮 (点击跳转至独立开源作品集页面 /projects) -->
            <div class="flex justify-end mt-1">
              <router-link to="/projects" class="section-more-btn flex items-center gap-2 group cursor-pointer select-none">
                <span class="more-text font-serif tracking-widest text-sm font-bold">More</span>
                <svg class="more-arrow-icon w-10 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" viewBox="0 0 100 32" fill="none">
                  <path d="M 8 18 H 86 L 72 6" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </router-link>
            </div>
          </div>

          <!-- 5. 留言板区域 (对应 #message 锚点 - 无需 More 按钮) -->
          <div id="message" class="scroll-mt-6">
            <MessageBoard />
          </div>

          <!-- 6. 关于区域锚点 (对应 #about 锚点 - 无需 More 按钮) -->
          <div id="about" class="scroll-mt-6 card-base p-6 border border-(--line-divider)">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-bold text-(--text-bright) flex items-center gap-2">
                <span class="w-1.5 h-4.5 rounded-full bg-(--primary)"></span>
                <span>关于本站</span>
              </h3>
              <router-link to="/about" class="text-xs text-(--primary) hover:underline font-semibold flex items-center gap-1">
                <span>查看博主主页 (About Me)</span>
                <span>➔</span>
              </router-link>
            </div>
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
            <!-- 1. 博主名片卡 (Profile - 正圆形头像，点击跳转 /about) -->
            <ProfileWidget />

            <!-- 2. 签名卡片 (Signature) -->
            <AnnouncementWidget />

            <!-- 3. 音乐播放器 (Music) -->
            <MusicWidget />
          </div>

          <!-- 下部组件群 (下滑到最后 3 个卡片时吸顶固定 - Sticky) -->
          <div class="flex flex-col gap-6 lg:sticky lg:top-6">
            <!-- 4. 最新动态 (Latest Moments) -->
            <DynamicWidget />

            <!-- 5. 站点统计 (Site Stats) -->
            <SiteStatsWidget 
              :article-count="displayArticles.length || 0" 
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
import { useRouter } from 'vue-router'
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
import { galleryAlbumConfig } from '../config/galleryConfig'

const router = useRouter()

const articles = ref<any[]>([])
const projects = ref<any[]>([])
const moments = ref<any[]>([])
const dbCategories = ref<any[]>([])
const dbTags = ref<any[]>([])
const loading = ref(true)
const projectsLoading = ref(true)

// 默认预设文章（保证数据库连接或初始状态时始终有美观内容展示）
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

const displayArticles = computed(() => {
  return articles.value.length > 0 ? articles.value : defaultArticles
})

// 默认预设作品集
const defaultProjects = [
  {
    id: 1,
    name: '学习通位置签到',
    description: '支持学习通位置签到，普通签到，不支持扫码签到\n通过获取cookie，采用伪造ip及机器码的方式完成验证',
    githubUrl: 'https://github.com/Cakehand-abc/XuexitongSign',
    downloadUrl: '暂无'
  }
]

const displayProjects = computed(() => {
  return projects.value.length > 0 ? projects.value : defaultProjects
})

// 相册数据
const homeAlbums = computed(() => galleryAlbumConfig)

const goToGallery = () => {
  router.push('/gallery')
}

const fetchArticles = async () => {
  try {
    const res = await axios.get('/api/articles/list', { params: { current: 1, size: 50 } })
    if (res.data.code === 200 && res.data.data?.records?.length > 0) {
      articles.value = res.data.data.records
    } else {
      articles.value = defaultArticles
    }
  } catch (err) {
    articles.value = defaultArticles
  } finally {
    loading.value = false
  }
}

const fetchProjects = async () => {
  projectsLoading.value = true
  try {
    const res = await axios.get('/api/projects/list')
    if (res.data.code === 200 && Array.isArray(res.data.data) && res.data.data.length > 0) {
      projects.value = res.data.data
    } else {
      projects.value = defaultProjects
    }
  } catch (error) {
    projects.value = defaultProjects
  } finally {
    projectsLoading.value = false
  }
}

const fetchMoments = async () => {
  try {
    const res = await axios.get('/api/moments/list')
    if (res.data.code === 200 && Array.isArray(res.data.data) && res.data.data.length > 0) {
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

// 分类列表统计
const categoryList = computed(() => {
  const map = new Map<string, number>()
  displayArticles.value.forEach(a => {
    const name = a.categoryName || (a.category && a.category.name) || '开发笔记'
    map.set(name, (map.get(name) || 0) + 1)
  })
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }))
})

// 标签列表统计
const tagList = computed(() => {
  const map = new Map<string, number>()
  displayArticles.value.forEach(a => {
    if (Array.isArray(a.tags)) {
      a.tags.forEach((t: any) => {
        const tagName = t.tagName || t.name || t
        if (tagName) map.set(tagName, (map.get(tagName) || 0) + 1)
      })
    }
  })
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }))
})

const calculatedTotalWords = computed(() => {
  let count = 0
  displayArticles.value.forEach(a => {
    if (a.summary) count += a.summary.length
    if (a.content) count += a.content.length
  })
  return Math.max(16293, count)
})

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
