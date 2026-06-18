<template>
  <div id="feature">
    <!-- 轮播图部分：替代原有的 HorizontalArticle -->
    <el-carousel trigger="click" height="500px" class="home-carousel rounded-2xl shadow-lg mb-8" :interval="5000">
      <el-carousel-item v-for="item in carouselArticles" :key="item.id">
        <div class="feature-article h-full !transform-none">
          <div class="feature-thumbnail h-full">
            <img class="ob-hz-thumbnail" :src="item.cover" alt="" />
            <span class="thumbnail-screen" :style="gradientBackground" />
          </div>
          <div class="feature-content h-full">
            <span>
              <b>{{ item.category }}</b>
              <ul>
                <li v-for="tag in item.tags" :key="tag"><em># {{ tag }}</em></li>
              </ul>
            </span>
            <h1 class="article-title text-ob-bright text-2xl lg:text-4xl font-extrabold mb-6 lg:mt-4 lg:mb-8">
              <a><span data-dia="article-link">{{ item.title }}</span></a>
            </h1>
            <p class="article-content-main text-base lg:text-lg mb-2">{{ item.summary }}</p>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>

    <!-- 编辑精选块 -->
    <div class="inverted-main-grid py-8 gap-8 box-border">
      <div class="relative overflow-hidden h-56 lg:h-auto rounded-2xl bg-ob-deep-800 shadow-lg">
        <div class="ob-gradient-plate opacity-90 relative z-10 bg-ob-deep-900 rounded-2xl flex justify-start items-end px-8 pb-10 shadow-md h-full">
          <h2 class="text-3xl pb-8 lg:pb-16 flex flex-col text-white">
            <span class="title-gradient">
              编辑精选
            </span>
            <span class="relative text-2xl text-ob-bright font-semibold flex items-center">
              <svg class="svg-icon inline-block w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M12 22C9.28002 22 4.57002 19.33 4.05002 14.99C3.69002 11.95 5.51002 9.6 6.01002 8.99C6.42002 11.1 7.53002 12.7 8.95002 12.99C9.21002 13.04 9.54002 13.06 9.93002 12.99C9.82002 10.67 10 6.33 12.86 3C13.17 2.63 13.66 2.3 14 2C14.24 4.64 14.98 6.12 15.8 7C16.91 8.19 18.59 9 19.48 11.28C19.52 11.37 19.63 11.65 19.72 12C20.34 14.38 20.04 17.88 17.76 19.99C15.85 21.76 13.35 22 13 22C12.49 22 12.56 22 12 22Z"></path>
                <path fill="currentColor" d="M14 16C12.96 17.04 11.41 17.43 10 17C11.13 18.09 12.7 18.5 14 18C16.01 17.24 16.83 14.54 16 13C15.74 12.53 15.36 12.21 15 12C15.43 13.41 15.04 14.96 14 16Z"></path>
              </svg>
              专题文章
            </span>
          </h2>
        </div>
        <span class="absolute top-0 w-full h-full z-0" :style="gradientBackground" />
      </div>

      <ul class="grid lg:grid-cols-2 gap-8">
        <li v-for="article in featuredArticles" :key="article.id">
          <ArticleCard class="home-featured-article" :data="article" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ArticleCard from './ArticleCard.vue'

const gradientBackground = computed(() => {
  return { background: 'linear-gradient(130deg, #e94560, #ff8787)' }
})

const carouselArticles = ref([
  { id: 1, title: '探索二次元与前沿技术的边界', category: '前端技术', tags: ['Vue3', 'CSS'], summary: '在这个光怪陆离的数字世界里，我们不仅是代码的编织者，更是梦境的创造者...', cover: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80' },
  { id: 2, title: '从零开始构建个人主页', category: '生活随笔', tags: ['日常', '分享'], summary: '记录自己一步步搭建这个二次元温馨博客的心路历程...', cover: 'https://images.unsplash.com/photo-1580130601254-05fa235abeab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80' },
  { id: 3, title: '如何优雅地使用 TailwindCSS', category: '技术分享', tags: ['Tailwind', '设计'], summary: 'Tailwind 让你用极简的方式创造极繁的美...', cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80' }
])

const featuredArticles = ref<any[]>([])

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
