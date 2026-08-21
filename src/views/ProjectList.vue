<template>
  <div class="projects-showcase-page min-h-screen bg-(--page-bg)">
    <!-- 顶部全景壁纸 Banner + 落樱与水波纹 -->
    <FireflyBanner />
    <SakuraEffect />

    <!-- 主体栅格容器 (标准双栏大宽屏沉浸式布局，保留右侧各栏目) -->
    <div class="max-w-[1440px] mx-auto px-4 md:px-8 py-8 relative z-20">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-8 items-start">
        
        <!-- 左侧主内容流 (开源作品集展厅) -->
        <div class="main-stream-column flex flex-col gap-6 min-w-0">

          <!-- 1. 作品集头部卡片 -->
          <div class="card-base p-6 md:p-8 relative overflow-hidden">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 rounded-xl bg-(--primary) flex items-center justify-center text-white text-lg shadow-sm">
                  🚀
                </div>
                <h2 class="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100">开源作品集</h2>
              </div>
              <span class="text-xs text-(--text-dim)">
                共 {{ projects.length }} 个项目
              </span>
            </div>
            <p class="text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
              代码创造的开源世界与系统工程实践
            </p>
          </div>

          <!-- 2. 作品卡片网格 -->
          <div v-if="loading" class="text-center py-16 text-sm text-(--text-dim)">
            正在加载作品集...
          </div>
          <div v-else-if="projects.length === 0" class="card-base p-12 text-center text-sm text-(--text-dim)">
            暂无作品数据～
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div 
              v-for="proj in projects" 
              :key="proj.id"
              class="card-base p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-lg border border-(--line-divider) group"
            >
              <div>
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-bold text-base md:text-lg text-(--text-bright) group-hover:text-(--primary) transition-colors">
                    {{ proj.name }}
                  </h3>
                  <span class="text-[10px] px-2.5 py-0.5 rounded-md bg-(--primary)/15 text-(--primary) font-semibold">
                    开源项目
                  </span>
                </div>
                
                <p class="text-xs md:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6 whitespace-pre-line">
                  {{ proj.description || '精心构建的现代化开源项目。' }}
                </p>
              </div>

              <!-- 底部操作与链接 -->
              <div class="flex items-center justify-between pt-4 border-t border-(--line-divider) text-xs">
                <a 
                  v-if="proj.githubUrl" 
                  :href="proj.githubUrl" 
                  target="_blank" 
                  class="text-(--primary) font-bold hover:underline flex items-center gap-1.5"
                >
                  <span>🔗 GitHub 源码</span>
                </a>
                <span v-else class="text-neutral-400">私有项目</span>

                <a 
                  v-if="proj.downloadUrl && proj.downloadUrl !== '暂无'" 
                  :href="proj.downloadUrl" 
                  target="_blank" 
                  class="px-4 py-1.5 text-xs font-bold rounded-xl bg-(--btn-regular-bg) hover:bg-(--primary) hover:text-white transition-all shadow-2xs"
                >
                  前往下载 ⬇
                </a>
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
import { ref, onMounted } from 'vue'
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

const projects = ref<any[]>([])
const loading = ref(true)

const defaultProjects = [
  {
    id: 1,
    name: '学习通位置签到',
    description: '支持学习通位置签到，普通签到，不支持扫码签到\n通过获取cookie，采用伪造ip及机器码的方式完成验证',
    githubUrl: 'https://github.com/Cakehand-abc/XuexitongSign',
    downloadUrl: '暂无'
  }
]

const fetchProjects = async () => {
  loading.value = true
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
    loading.value = false
  }
}

onMounted(() => {
  fetchProjects()
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>
