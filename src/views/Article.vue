<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import { Calendar, User, View } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const article = ref<any>(null)
const loading = ref(true)

const fetchArticle = async () => {
  const id = route.params.id
  if (!id) return
  
  try {
    const res = await axios.get(`/api/articles/${id}`)
    if (res.data.code === 200) {
      article.value = res.data.data
    } else {
      console.error(res.data.msg)
    }
  } catch (err) {
    console.error('Failed to fetch article', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchArticle()
})

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="article-page min-h-screen pb-20">
    <div v-if="loading" class="flex justify-center items-center h-screen text-ob-dim">
      加载中...
    </div>
    
    <template v-else-if="article">
      <!-- 头部 Banner -->
      <div class="article-banner relative h-96 flex items-center justify-center overflow-hidden">
        <div class="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
        <img v-if="article.coverUrl" :src="article.coverUrl" class="absolute inset-0 w-full h-full object-cover z-0" />
        <div v-else class="absolute inset-0 bg-ob-deep-800 z-0"></div>
        
        <div class="z-20 text-center px-4 max-w-4xl mt-12">
          <h1 class="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">{{ article.title }}</h1>
          <div class="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-300">
            <span class="flex items-center gap-1 bg-white bg-opacity-20 px-3 py-1 rounded-full backdrop-blur-sm">
              <el-icon><Calendar /></el-icon> {{ article.createdAt || '未知时间' }}
            </span>
            <span class="flex items-center gap-1 bg-white bg-opacity-20 px-3 py-1 rounded-full backdrop-blur-sm">
              <el-icon><User /></el-icon> 您
            </span>
          </div>
          <div class="mt-4 flex flex-wrap justify-center gap-2">
            <span v-if="article.categoryName" class="bg-ob-deep-900 text-ob-bright px-3 py-1 rounded-md text-xs border border-ob-dim">
              {{ article.categoryName }}
            </span>
            <span v-for="tag in article.tags" :key="tag.id" class="text-ob-secondary text-sm italic">
              #{{ tag.tagName }}
            </span>
          </div>
        </div>
      </div>

      <!-- 主体内宽 -->
      <div class="max-w-4xl mx-auto px-4 -mt-16 relative z-30">
        <div class="bg-ob-deep-800 rounded-2xl shadow-xl p-6 md:p-12 article-content">
          <MdPreview :modelValue="article.content || '*本文没有内容*'" theme="dark" previewTheme="cyanosis" />
        </div>
        
        <div class="mt-8 text-center">
          <button @click="goBack" class="px-6 py-2 rounded-full border border-ob-dim text-ob-normal hover:text-ob-bright hover:border-ob-bright transition-colors">
            返回首页
          </button>
        </div>
      </div>
    </template>
    
    <div v-else class="flex flex-col justify-center items-center h-screen text-ob-dim">
      <h2 class="text-2xl mb-4">文章不存在或已被删除</h2>
      <button @click="goBack" class="text-ob-bright underline">返回首页</button>
    </div>
  </div>
</template>

<style scoped>
.article-page {
  background: var(--background-primary);
}
.bg-ob-deep-800 {
  background: var(--background-secondary);
}
.bg-ob-deep-900 {
  background: var(--background-primary);
}
.text-ob-bright {
  color: var(--text-bright);
}
.text-ob-normal {
  color: var(--text-normal);
}
.text-ob-dim {
  color: var(--text-dim);
}
.text-ob-secondary {
  color: var(--text-sub-accent);
}

/* 穿透修改 md-editor 的背景，使其与我们的二次元透明卡片融合 */
:deep(.md-editor-dark) {
  --md-bk-color: transparent !important;
  --md-color: var(--text-normal) !important;
}
</style>
