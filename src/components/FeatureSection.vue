<template>
  <div id="feature">
    <!-- 顶部锚点：供 Logo 和 Home 滚动使用 -->
    <div id="home" class="absolute -top-20"></div>

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
import { ref, onMounted } from 'vue'
import ArticleCard from './ArticleCard.vue'
import { useSettingStore } from '../store/setting'

const settingStore = useSettingStore()
const featuredArticles = ref<any[]>([])

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:8080/api/articles/list')
    const json = await res.json()
    if (json.code === 200 && json.data && json.data.records) {
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
.home-featured-article {
  :deep(p) {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }
}
</style>
