<script setup lang="ts">
import ArticleCard from '../components/ArticleCard.vue'
import FeatureSection from '../components/FeatureSection.vue'
import MessageBoard from '../components/MessageBoard.vue'
import Footer from '../components/Footer.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { activeSection } from '../store/navState'

const articles = ref<any[]>([])
const projects = ref<any[]>([])
const loading = ref(true)
const projectsLoading = ref(true)

const fetchArticles = async () => {
  try {
    const res = await axios.get('/api/articles/list', { params: { current: 1, size: 10 } })
    if (res.data.code === 200) {
      articles.value = res.data.data.records
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
    const res = await axios.get('http://localhost:8080/api/projects/list')
    if (res.data.code === 200) {
      projects.value = res.data.data
    }
  } catch (error) {
    console.error('获取作品集失败:', error)
  } finally {
    projectsLoading.value = false
  }
}

let observer: IntersectionObserver | null = null

onMounted(() => {
  fetchArticles()
  fetchProjects()
  
  // 设置精准的高度检测 ScrollSpy (这里的数组顺序必须与页面上的锚点顺序完全一致)
  const sections = ['#home', '#featured', '#articles', '#essays', '#gallery', '#projects', '#message', '#about']
  
  const handleScroll = () => {
    const triggerLine = window.innerHeight / 2 // 以屏幕一半作为触发分界线
    let currentId = '#home'
    
    for (const selector of sections) {
      const el = document.querySelector(selector) as HTMLElement
      if (el) {
        const rect = el.getBoundingClientRect()
        // 找到最后一个越过屏幕中线的锚点
        if (rect.top <= triggerLine) {
          currentId = selector
        }
      }
    }
    if (activeSection.value !== currentId) {
      activeSection.value = currentId
    }
  }

  // 使用 throttle 节流可以优化性能，这里直接简单绑定
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll() // 初始化调用

  // 清理
  observer = { disconnect: () => window.removeEventListener('scroll', handleScroll) } as any
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <div class="block">
    <FeatureSection />
    <div class="mt-8">
      <div class="flex flex-col relative">
        <div id="articles" class="relative -top-32"></div>
        <div class="mt-8 mb-4 flex items-center gap-4">
          <h2 class="text-2xl font-bold text-ob-bright">全部文章 Articles</h2>
          <div class="flex-1 h-px bg-ob-deep-800"></div>
        </div>
        <ul class="tab">
          <li class="active">
            <span class="first-tab">全部</span>
          </li>
          <li>
            <span>前端技术</span><b>12</b>
          </li>
          <li>
            <span>二次元随笔</span><b>8</b>
          </li>
          <li>
            <span>日常</span><b>5</b>
          </li>
        </ul>
        
        <div v-if="loading" class="text-center text-ob-dim py-10">
          加载中...
        </div>
        <ul v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <li v-for="article in articles" :key="article.id">
            <ArticleCard :data="article" />
          </li>
        </ul>
        
        <!-- 随笔区域锚点 -->
        <div id="essays" class="relative -top-20 mt-16"></div>
        <div class="mt-8 mb-4 flex items-center gap-4">
          <h2 class="text-2xl font-bold text-ob-bright">随笔 Essays</h2>
          <div class="flex-1 h-px bg-ob-deep-800"></div>
        </div>
        <div class="text-ob-dim mb-8">在这里记录生活的点点滴滴... (占位)</div>
        
        <!-- 画廊区域锚点 -->
        <div id="gallery" class="relative -top-20 mt-16"></div>
        <div class="mt-8 mb-4 flex items-center gap-4">
          <h2 class="text-2xl font-bold text-ob-bright">画廊 Gallery</h2>
          <div class="flex-1 h-px bg-ob-deep-800"></div>
        </div>
        <div class="bg-ob-deep-800 p-8 rounded-2xl shadow-md text-ob-dim text-center min-h-[150px] flex items-center justify-center">
          <p>（画廊模块开发中，敬请期待...）</p>
        </div>

        <!-- 项目区域锚点 -->
        <div id="projects" class="relative -top-20 mt-16"></div>
        <div class="mt-8 mb-4 flex items-center gap-4">
          <h2 class="text-2xl font-bold text-ob-bright">作品集 Projects</h2>
          <div class="flex-1 h-px bg-ob-deep-800"></div>
        </div>
        
        <div v-if="projectsLoading" class="text-center text-ob-dim py-10">加载中...</div>
        <div v-else-if="projects.length === 0" class="bg-ob-deep-800 p-8 rounded-2xl shadow-md text-ob-dim text-center min-h-[150px] flex items-center justify-center">
          <p>（暂无项目数据，请前往管理端添加...）</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <div v-for="proj in projects" :key="proj.id" class="bg-ob-deep-800 p-6 rounded-2xl shadow-md flex flex-col transition-transform hover:-translate-y-1">
            <h3 class="font-bold text-ob-bright text-lg mb-2">{{ proj.name }}</h3>
            <p class="text-sm text-ob-dim flex-1 mb-4">{{ proj.description || '暂无描述' }}</p>
            <div class="flex justify-between items-center text-sm font-medium border-t border-gray-700/50 pt-3 mt-auto">
              <a v-if="proj.githubUrl" :href="proj.githubUrl" target="_blank" class="text-blue-400 hover:text-blue-300 flex items-center gap-1">Github 🔗</a>
              <span v-else class="text-gray-500">无 Github</span>
              
              <a v-if="proj.downloadUrl" :href="proj.downloadUrl" target="_blank" class="text-green-400 hover:text-green-300 flex items-center gap-1">下载源码 ⬇</a>
              <span v-else class="text-gray-500">无下载</span>
            </div>
          </div>
        </div>

        <!-- 留言板区域锚点 -->
        <div id="message" class="relative -top-20 mt-16"></div>
        <div class="mt-8 mb-4 flex items-center gap-4">
          <h2 class="text-2xl font-bold text-ob-bright">留言板 Message</h2>
          <div class="flex-1 h-px bg-ob-deep-800"></div>
        </div>
        <MessageBoard />

        <!-- 底部页脚区域 (Footer) -->
        <div id="about" class="relative -top-20 mt-16"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.block {
  margin: 0 auto;
  max-width: var(--max-width);
  padding: 0 1rem;
}

.tab {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background: var(--background-secondary);
  padding-left: 1.5rem;
  padding-right: 3rem;
  margin-bottom: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  height: auto;

  li {
    cursor: pointer;
    margin: 1rem 0.75rem 1rem 0;
    transition: opacity 0.3s;
    display: flex;

    &:hover {
      opacity: 0.5;
    }

    &.active {
      color: white;
      span {
        background: var(--text-accent);
      }
      b {
        background: var(--text-accent);
        opacity: 0.8;
      }
    }

    span {
      white-space: nowrap;
      background: var(--background-primary);
      color: var(--text-normal);
      text-align: center;
      padding: 0.5rem 1rem;
      border-top-left-radius: 0.375rem;
      border-bottom-left-radius: 0.375rem;
      font-size: 0.875rem;

      &.first-tab {
        border-radius: 0.375rem;
        padding-left: 1.5rem;
        padding-right: 1.5rem;
      }
    }

    b {
      white-space: nowrap;
      background: var(--background-primary);
      color: var(--text-normal);
      opacity: 0.7;
      text-align: center;
      padding: 0.5rem 1rem;
      border-top-right-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
      font-size: 0.875rem;
    }
  }
}

.bg-ob-deep-800 {
  background: var(--background-secondary);
}
.text-ob-bright {
  color: var(--text-bright);
}
.text-ob-dim {
  color: var(--text-dim);
}
</style>
