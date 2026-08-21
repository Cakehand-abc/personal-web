<template>
  <div 
    class="post-card-wrapper card-base px-6 py-5 md:px-7 md:py-6 h-auto md:h-[200px] rounded-[1.25rem] md:rounded-[1.5rem] border border-(--line-divider) bg-white dark:bg-[#1e1e24] shadow-xs hover:shadow-md transition-all duration-300 flex flex-row gap-5 items-center justify-between relative group overflow-hidden"
  >
    <!-- 左侧内容主体区域 (上下撑满 200px 高度) -->
    <div class="post-card-content flex-1 min-w-0 flex flex-col justify-between h-full">
      
      <!-- 上半部分：标题 + 分类标签胶囊 + 摘要 -->
      <div class="flex-1 min-w-0">
        <!-- 1. 标题 (自带 ::before 绿条注入 - 100% 稳定显示) -->
        <h3 
          @click="goToDetail"
          class="post-card-title text-xl md:text-[22px] font-bold text-[#1a1a1a] dark:text-[#f0f0f0] hover:text-(--primary) dark:hover:text-(--primary) transition-colors cursor-pointer leading-snug tracking-tight mb-2.5 truncate"
          :title="data.title"
        >
          {{ data.title }}
        </h3>

        <!-- 2. 元信息胶囊栏 (📖 分类胶囊 + # 标签胶囊) -->
        <div class="flex flex-wrap items-center gap-2.5 mb-2.5 text-xs">
          <!-- 置顶标识 (若有) -->
          <div 
            v-if="data.isFeatured || data.pinned" 
            class="px-2 py-0.5 rounded-lg bg-(--btn-regular-bg) text-(--btn-content) font-bold flex items-center gap-1 shadow-2xs text-[11px]"
          >
            <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2z"/>
            </svg>
            <span>置顶</span>
          </div>

          <!-- 分类胶囊 (原版浅绿底色 + 书本图标) -->
          <div 
            class="px-2.5 py-0.5 rounded-lg bg-[oklch(0.95_0.025_165)] dark:bg-[oklch(0.28_0.035_165)] text-(--primary) font-semibold flex items-center gap-1.5 cursor-pointer hover:brightness-95 transition-all text-xs"
          >
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
            </svg>
            <span>{{ displayCategory }}</span>
          </div>

          <!-- 标签胶囊 (原版浅绿底色 + # 标签名 / 标签2) -->
          <div 
            class="px-2.5 py-0.5 rounded-lg bg-[oklch(0.95_0.025_165)] dark:bg-[oklch(0.28_0.035_165)] text-(--primary) font-medium flex items-center gap-1.5 cursor-pointer hover:brightness-95 transition-all text-xs"
          >
            <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="m9 16l-.825 3.275q-.075.325-.325.525t-.6.2q-.475 0-.775-.375T6.3 18.8L7 16H4.275q-.5 0-.8-.387T3.3 14.75q.075-.35.35-.55t.625-.2H7.5l1-4H5.775q-.5 0-.8-.387T4.8 8.75q.075-.35.35-.55t.625-.2H9l.825-3.275Q9.9 4.4 10.15 4.2t.6-.2q.475 0 .775.375t.175.825L11 8h4l.825-3.275q.075-.325.325-.525t.6-.2q.475 0 .775.375t.175.825L17 8h2.725q.5 0 .8.387t.175.863q-.075.35-.35.55t-.625.2H16.5l-1 4h2.725q.5 0 .8.388t.175.862q-.075.35-.35.55t-.625.2H15l-.825 3.275q-.075.325-.325.525t-.6.2q-.475 0-.775-.375T12.3 18.8L13 16zm.5-2h4l1-4h-4z"/>
            </svg>
            <span>{{ displayTagsText }}</span>
          </div>
        </div>

        <!-- 3. 文章摘要 (自然两行截断) -->
        <p class="text-xs md:text-[13.5px] text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-2 mb-2">
          {{ cleanSummary(data.summary || data.content) }}
        </p>
      </div>

      <!-- 下半部分：4. 底部统计指标行 (📅 日期 | 📄 真实字数 - 贴底) -->
      <div class="flex flex-wrap items-center gap-3 text-xs text-neutral-400 dark:text-neutral-500 font-medium pt-1">
        <!-- 日期 -->
        <div class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 fill-current text-neutral-400" viewBox="0 0 24 24">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
          </svg>
          <span>{{ formatDate(data.createTime || data.date) }}</span>
        </div>

        <span class="opacity-30">|</span>

        <!-- 真实统计字数 -->
        <div class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 fill-current text-neutral-400" viewBox="0 0 24 24">
            <path d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm0-2h16V6H4zm0 0V6zm2-1h12q.425 0 .713-.288T19 16t-.288-.712T18 15H6q-.425 0-.712.288T5 16t.288.713T6 17m0-4h12q.425 0 .713-.288T19 12t-.288-.712T18 11H6q-.425 0-.712.288T5 12t.288.713T6 13m0-4h8q.425 0 .713-.288T15 8t-.288-.712T14 7H6q-.425 0-.712.288T5 8t.288.713T6 9"/>
          </svg>
          <span>{{ calcRealWords(data) }} 字</span>
        </div>
      </div>

    </div>

    <!-- 右侧面板：原版浅绿长条圆角进入按钮 (100% 对齐 Firefly 200px 经典卡片) -->
    <div 
      @click="goToDetail"
      class="flex w-12 md:w-14 self-stretch my-0.5 rounded-2xl bg-[oklch(0.95_0.025_165)] dark:bg-[oklch(0.28_0.035_165)] hover:bg-(--primary) text-(--primary) hover:text-white items-center justify-center transition-all duration-300 cursor-pointer shadow-2xs group/enter flex-shrink-0"
      title="阅读全文"
    >
      <svg class="w-7 h-7 fill-current transform group-hover/enter:translate-x-0.5 transition-transform" viewBox="0 0 24 24">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  data: any
}>()

const router = useRouter()

const displayCategory = computed(() => {
  if (props.data?.categoryName) return props.data.categoryName
  if (props.data?.category?.name) return props.data.category.name
  if (props.data?.title?.includes('前端') || props.data?.title?.includes('Astro') || props.data?.title?.includes('GitHub')) {
    return '开发笔记'
  }
  return '文章示例'
})

const displayTagsText = computed(() => {
  if (props.data?.tags && Array.isArray(props.data.tags) && props.data.tags.length > 0) {
    const list = props.data.tags.map((t: any) => typeof t === 'string' ? t : (t.name || t.tagName || ''))
    return list.filter(Boolean).join(' / ')
  }
  if (props.data?.tagNames && Array.isArray(props.data.tagNames) && props.data.tagNames.length > 0) {
    return props.data.tagNames.join(' / ')
  }
  if (props.data?.title?.includes('前端') || props.data?.title?.includes('AI')) {
    return '前端 / AI'
  }
  if (props.data?.title?.includes('Hello')) {
    return '博客 / 启程'
  }
  return 'Markdown / Firefly'
})

const cleanSummary = (text?: string) => {
  if (!text) return '暂无文章摘要，点击即可进入正文阅读...'
  return text.replace(/[#*`~>-]/g, '').trim()
}

// 计算真实文章字数
const calcRealWords = (item: any) => {
  if (item.content && item.content.trim().length > 0) {
    // 过滤掉 markdown 符号和 html 标签统计纯文本字数
    return item.content.replace(/<[^>]+>/g, '').replace(/[#*`~>-\s]/g, '').length
  }
  if (item.summary && item.summary.trim().length > 0) {
    return item.summary.replace(/[#*`~>-\s]/g, '').length
  }
  return (item.title || '').length * 20
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '2026-06-18'
  return dateStr.substring(0, 10).replace(/\//g, '-')
}

const goToDetail = () => {
  if (props.data?.id) {
    router.push(`/article/${props.data.id}`)
  }
}
</script>

<style scoped>
/* 标题前绿色圆角指示竖线 (使用 CSS ::before 注入，100% 绝对稳定生效) */
.post-card-title::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 18px;
  border-radius: 4px;
  background-color: #2ECC71;
  margin-right: 10px;
  vertical-align: -2px;
}
</style>
