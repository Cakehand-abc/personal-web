<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  data: any
}>()

const router = useRouter()

const goToArticle = () => {
  if (props.data && props.data.id !== undefined) {
    router.push('/article/' + props.data.id)
  }
}
</script>

<template>
  <div class="article-container" v-scroll-reveal>
    <div @click="goToArticle" class="article bg-ob-deep-800 rounded-2xl shadow-md overflow-hidden cursor-pointer group flex flex-col h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
      <div class="article-thumbnail relative h-48 overflow-hidden">
        <img :src="data.coverUrl" alt="cover" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      </div>
      
      <div class="article-content p-6 flex flex-col flex-1">
        <div class="text-sm text-ob-dim mb-3 flex items-center gap-2">
          <span class="font-bold text-ob-bright">{{ data.categoryName }}</span>
          <ul class="flex gap-2 text-ob-secondary italic">
            <li v-for="tag in data.tags" :key="tag.id">#{{ tag.tagName }}</li>
          </ul>
        </div>
        
        <h1 class="article-title text-xl font-bold text-ob-bright mb-3 line-clamp-2 leading-snug group-hover:text-ob transition-colors duration-300">
          {{ data.title }}
        </h1>
        
        <p class="article-content-main text-sm text-ob-normal leading-relaxed line-clamp-3 mb-6 flex-1">
          {{ data.summary }}
        </p>
        
        <div class="article-footer text-xs text-ob-dim mt-auto">
          <div class="flex items-center">
             <el-icon class="mr-1"><Calendar /></el-icon>
             <span>{{ data.date }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Calendar } from '@element-plus/icons-vue'
export default {
  components: {
    Calendar
  }
}
</script>

<style scoped lang="scss">
.article-container {
  height: 100%;
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
.text-ob-normal {
  color: var(--text-normal);
}
.text-ob {
  color: var(--text-accent);
}
.text-ob-secondary {
  color: var(--text-sub-accent);
}
</style>
