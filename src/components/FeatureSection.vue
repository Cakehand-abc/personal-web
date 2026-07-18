<template>
  <div id="feature">
    <!-- 顶部锚点：供 Logo 和 Home 滚动使用 -->
    <div id="home" class="absolute -top-20"></div>

    <!-- 轮播图部分：霸占整屏，纯净无暇 -->
    <el-carousel trigger="click" :height="'calc(100vh - 40px)'" class="home-carousel rounded-2xl shadow-lg my-5" :interval="5000">
      <el-carousel-item v-for="item in carouselArticles" :key="item.id">
        <div class="feature-article h-full !transform-none">
          <div class="feature-thumbnail h-full">
            <img class="ob-hz-thumbnail" :src="item.cover" alt="" />
            <!-- 移除文字与蒙版，仅保留纯净图片 -->
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>

    <!-- 精选锚点 -->
    <div id="featured" class="relative -top-20"></div>

    <!-- 编辑精选块 (现已改为个人名片+精选文章) -->
    <div class="grid lg:grid-cols-[320px_1fr] py-8 gap-8 box-border">
      
      <!-- 左侧：个人头像与签名 -->
      <div class="sidebar flex flex-col gap-8 h-full">
        <div class="bg-ob-deep-800 p-6 rounded-2xl shadow-md text-center sidebar-widget relative z-10" v-scroll-reveal>
          <img :src="settingStore.avatarUrl || 'https://picsum.photos/seed/avatar/150/150'" alt="Avatar" class="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg object-cover" />
          <h3 class="text-xl font-bold text-ob-bright">{{ settingStore.siteName || '您的名字' }}</h3>
          <p class="text-ob-dim mt-2 text-sm">在这里记录技术与生活的点滴。</p>
          <div class="mt-6 flex justify-center gap-4">
            <div class="text-center"><div class="font-bold text-ob-bright">文章</div><div class="text-sm text-ob-dim">42</div></div>
            <div class="text-center"><div class="font-bold text-ob-bright">分类</div><div class="text-sm text-ob-dim">8</div></div>
            <div class="text-center"><div class="font-bold text-ob-bright">标签</div><div class="text-sm text-ob-dim">24</div></div>
          </div>
        </div>

        <div class="bg-ob-deep-800 p-6 rounded-2xl shadow-md sidebar-widget flex-1 flex flex-col relative z-10" v-scroll-reveal>
          <h3 class="text-lg font-bold mb-4 flex items-center gap-2 text-ob-bright">
            <span>📢 个人签名</span>
          </h3>
          <p class="text-sm text-ob-dim leading-relaxed flex-1">
            {{ settingStore.siteSignature || '欢迎来到我的温馨空间！目前前端样式正在按照邻家天使官网的风格进行二次元化重构中...' }}
          </p>
        </div>
      </div>

      <!-- 右侧：精选文章 -->
      <div v-if="featuredArticles.length === 0" class="flex justify-center items-center h-full min-h-[200px] text-ob-dim">
        暂无专题文章...
      </div>
      <ul v-else class="grid lg:grid-cols-2 gap-8">
        <li v-for="article in featuredArticles" :key="article.id">
          <ArticleCard class="home-featured-article h-full" :data="article" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ArticleCard from './ArticleCard.vue'
import { activeSection } from '../store/navState'
import { useSettingStore } from '../store/setting'

const router = useRouter()
const settingStore = useSettingStore()

const gradientBackground = computed(() => {
  return { background: 'linear-gradient(130deg, #e94560, #ff8787)' }
})

const carouselArticles = ref([
  { id: 1, title: '探索二次元与前沿技术的边界', category: '前端技术', tags: ['Vue3', 'CSS'], summary: '在这个光怪陆离的数字世界里，我们不仅是代码的编织者，更是梦境的创造者...', cover: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80' },
  { id: 2, title: '从零开始构建个人主页', category: '生活随笔', tags: ['日常', '分享'], summary: '记录自己一步步搭建这个二次元温馨博客的心路历程...', cover: 'https://images.unsplash.com/photo-1580130601254-05fa235abeab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80' },
  { id: 3, title: '如何优雅地使用 TailwindCSS', category: '技术分享', tags: ['Tailwind', '设计'], summary: 'Tailwind 让你用极简的方式创造极繁的美...', cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80' }
])

const featuredArticles = ref<any[]>([])

const viewArticle = (id: number) => {
  router.push({ path: `/article/${id}`, state: { sourceAnchor: activeSection.value } })
}

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:8080/api/articles/list')
    const json = await res.json()
    if (json.code === 200 && json.data && json.data.records) {
      // 后端升级为了分页查询，所以真正的数据列表在 json.data.records 里
      featuredArticles.value = json.data.records.map((item: any) => ({
        id: item.id,
        title: item.title,
        date: item.createTime ? item.createTime.split('T')[0] : '刚刚',
        categoryName: item.categoryName || '默认分类',
        tags: item.tags && item.tags.length > 0 ? item.tags : [{id: 1, name: '默认标签'}],
        summary: item.summary || '无摘要',
        coverUrl: item.coverUrl || 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      }))
    }
  } catch (error) {
    console.error('获取文章列表失败:', error)
  }
})
</script>

<style lang="scss" scoped>
.home-carousel {
  :deep(.feature-article) {
    border-radius: 0;
    transition: none;
    height: 100% !important;
    &:hover {
      transform: none;
    }
    .feature-thumbnail {
      height: 100% !important;
      img {
        height: 100% !important;
      }
      span.thumbnail-screen {
        height: 100% !important;
      }
    }
    .feature-content {
      height: 100% !important;
    }
  }
}
.home-featured-article {
  :deep(p) {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }
}

.title-gradient {
  @apply text-4xl font-semibold mb-3 tracking-wide;
  background: linear-gradient(62deg, #188bfd 0%, #a03bff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
