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
      <!-- 头部 Banner (按用户要求隐藏，采用沉浸式全屏纯文字排版) -->
      <!-- 
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
      -->

      <!-- 主体内容容器 (对应目标网站的 l-contents) -->
      <div class="w-full max-w-[1920px] mx-auto px-[8%] pt-10 pb-16 md:pt-[100px] md:pb-[100px] relative z-30 anim-fadeInFromBottom">
        
        <!-- 大号板块名称 (对应 news__heading) -->
        <div class="mb-10 text-left">
           <div class="inline-block relative pb-4 group">
             <!-- 如果有现成的 SVG 可以替换这里的文字，这里先保留高雅的文字版 -->
             <span class="text-4xl md:text-5xl font-serif tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-[#DDB95B] to-[#B89030]">{{ article.categoryName || 'Articles' }}</span>
             <!-- 底部波点线 -->
             <div class="absolute bottom-0 left-0 w-[120%] h-[3px] golden-dot-line"></div>
           </div>
        </div>

        <!-- 文章详情独立白盒 (对应 post news__post) -->
        <div class="bg-ob-deep-800 rounded-sm shadow-sm pt-12 pb-16 px-8 md:px-[8%] article-content min-h-[70vh]">
          
          <!-- 文章日期 -->
          <div class="text-[#e27c8e] text-[1.4rem] mb-6 font-serif tracking-[0.1em]">
            {{ (article.createdAt || '').substring(0, 10).replace(/-/g, '.') || '2026.07.16' }}
          </div>

          <!-- 文章标题 -->
          <div class="mb-12 text-left">
             <h1 class="text-3xl md:text-[2.8rem] font-serif font-bold text-[#222222] mb-8 leading-[1.6] tracking-wider">{{ article.title }}</h1>
             <!-- 贯穿内部的波点分割线 -->
             <div class="w-full h-[3px] golden-dot-line opacity-60"></div>
          </div>

          <!-- 正文渲染区 (文字大小根据目标站点调整为 1.4rem/1.6rem) -->
          <MdPreview :modelValue="article.content || '*本文没有内容*'" theme="light" previewTheme="default" class="custom-md-preview" />
        </div>
        
        <!-- 底部返回按钮 (对应 button-back) -->
        <div class="mt-16 text-center">
          <button @click="goBack" class="px-12 py-4 rounded-full border border-gray-300 text-gray-500 hover:text-[#B89030] hover:border-[#B89030] transition-colors font-serif tracking-widest text-lg md:text-xl">
            BACK
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
  background-color: #FDFCFD; /* 纯净的打底色 */
  background-image: 
    /* === 上半区：天蓝主导，随机夹杂少量浅紫与极白 === */
    radial-gradient(circle at 15% 10%, #D5FFFE 0%, transparent 40%),
    radial-gradient(circle at 85% 15%, #E4F8FC 0%, transparent 45%),
    radial-gradient(circle at 45% 5%, #FFF3FD 0%, transparent 25%),
    radial-gradient(circle at 30% 20%, #FBFFFE 0%, transparent 35%),
    
    /* === 中间区：梦幻交织过渡 === */
    radial-gradient(circle at 75% 45%, #D5FFFE 0%, transparent 30%),
    radial-gradient(circle at 20% 55%, #F7F4F9 0%, transparent 35%),
    radial-gradient(circle at 50% 50%, #FAFEFF 0%, transparent 50%),
    
    /* === 下半区：浅紫主导，随机夹杂少量天蓝与极白 === */
    radial-gradient(circle at 15% 85%, #F7F4F9 0%, transparent 45%),
    radial-gradient(circle at 85% 90%, #FFF3FD 0%, transparent 40%),
    radial-gradient(circle at 50% 95%, #F6F6FB 0%, transparent 45%),
    radial-gradient(circle at 65% 75%, #D5FFFE 0%, transparent 30%),
    radial-gradient(circle at 35% 80%, #FEFEFE 0%, transparent 35%);
    
  /* 固定背景视角，无论文章多长，屏幕始终保持这种光晕交织 */
  background-attachment: fixed;
  background-size: 100vw 100vh;
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
:deep(.md-editor) {
  --md-bk-color: transparent !important;
  --md-color: #222222 !important; /* 加深正文阅读文字的颜色 */
  --md-color-title: #222222 !important; /* 强制标题也使用该颜色 */
  font-family: 'Shippori Mincho', 'Noto Serif SC', serif;
  font-size: 1.4rem;
}
@media (min-width: 768px) {
  :deep(.md-editor) {
    font-size: 1.6rem;
    line-height: 2;
  }
}
:deep(.md-editor h1, .md-editor h2, .md-editor h3, .md-editor h4, .md-editor h5, .md-editor h6) {
  color: #222222 !important;
  margin-top: 2em;
  margin-bottom: 1em;
}
:deep(.md-editor-light) {
  --md-bk-color: transparent !important;
}

/* 连续波点修饰线 (借用 SideNav 的 SVG) */
.golden-dot-line {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='4'%3E%3Ccircle cx='4' cy='2' r='1.8' fill='%23B89030'/%3E%3C/svg%3E");
  background-size: 8px 4px;
  background-position: left bottom;
  background-repeat: repeat-x;
}

@keyframes fade-in-from-bottom {
  0% {
    transform: translateY(2rem);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
.anim-fadeInFromBottom {
  animation-name: fade-in-from-bottom;
  animation-duration: 1.3s;
  animation-fill-mode: both;
}
</style>
