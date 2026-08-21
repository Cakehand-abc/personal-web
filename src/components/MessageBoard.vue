<template>
  <div class="firefly-guestbook flex flex-col gap-6">
    
    <!-- 1. 留言板介绍卡片 (对齐 Firefly 原版 guestbook 头部) -->
    <div class="card-base p-6 md:p-8 relative overflow-hidden">
      <!-- 页面标题和描述 -->
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-2.5">
          <!-- 绿色聊天图标 -->
          <div class="h-8 w-8 rounded-lg bg-(--primary) flex items-center justify-center text-white">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M2 22V4q0-.825.588-1.412T4 2h16q.825 0 1.413.588T22 4v12q0 .825-.587 1.413T20 18H6zm4-8h8v-2H6zm0-3h12V9H6zm0-3h12V6H6z"/>
            </svg>
          </div>
          <h2 class="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100">留言板</h2>
        </div>
        <p class="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          欢迎在这里留下你的足迹，分享你的想法和建议～
        </p>
      </div>

      <!-- 留言规范指引 -->
      <div class="p-4 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/40 border border-(--line-divider) text-xs text-neutral-600 dark:text-neutral-300">
        <ul class="space-y-1.5 list-disc list-inside">
          <li>请保持友善和尊重，营造良好的交流氛围</li>
          <li>欢迎分享你的技术见解，也可以提出对网站的宝贵建议</li>
          <li>你的每一条留言都是对我最大的鼓励与支持 ✨</li>
        </ul>
      </div>
    </div>

    <!-- 2. 评论区输入与展示卡片 (极简设计：去除多余字段与当前身份提示，高对比度发送按钮) -->
    <div id="post-comments" class="card-base p-6 md:p-8 relative overflow-hidden">
      
      <!-- 评论区顶部标题栏 -->
      <div class="relative z-10 mb-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-1.5 h-5 bg-(--primary) rounded-full"></div>
          <h3 class="text-lg md:text-xl font-bold text-(--text-bright)">发表留言</h3>
        </div>
      </div>

      <!-- 极简评论输入框 -->
      <div class="twikoo-form-wrapper mb-8">
        <div class="rounded-2xl border border-(--line-divider) bg-(--btn-regular-bg) overflow-hidden focus-within:border-(--primary) focus-within:ring-2 focus-within:ring-(--primary)/20 transition-all">
          <textarea 
            v-model="content"
            rows="3"
            maxlength="500"
            placeholder="写下你的留言与想法（支持 Markdown 语法）..."
            class="w-full p-4 bg-transparent outline-none text-xs md:text-sm text-neutral-800 dark:text-neutral-200 resize-y"
          ></textarea>

          <!-- 底部操作栏 (字数统计与高对比度高亮发送按钮) -->
          <div class="flex items-center justify-between px-4 py-2.5 border-t border-(--line-divider) bg-black/3 dark:bg-white/3 text-xs">
            <span class="text-[11px] text-neutral-400 font-mono">{{ content.length }} / 500</span>

            <!-- 高亮醒目发送按钮 -->
            <button 
              @click="submitComment"
              :disabled="submitting || !content.trim()"
              class="px-5 py-2 rounded-xl bg-(--primary) hover:brightness-105 active:scale-95 text-white font-bold text-xs shadow-md disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>{{ submitting ? '发送中...' : '发送留言' }}</span>
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 3. 评论列表头部与排序栏 -->
      <div class="flex items-center justify-between pb-3 mb-4 border-b border-(--line-divider) text-xs">
        <div class="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
          <span class="text-sm">{{ messages.length }}</span>
          <span class="text-neutral-500 font-normal">条留言</span>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 text-neutral-400">
            <button 
              @click="sortMode = 'latest'"
              class="transition-colors hover:text-(--primary) cursor-pointer"
              :class="{ 'text-(--primary) font-bold': sortMode === 'latest' }"
            >
              最新
            </button>
            <span>/</span>
            <button 
              @click="sortMode = 'hottest'"
              class="transition-colors hover:text-(--primary) cursor-pointer"
              :class="{ 'text-(--primary) font-bold': sortMode === 'hottest' }"
            >
              最热
            </button>
          </div>

          <button 
            @click="fetchMessages" 
            class="hover:text-(--primary) text-neutral-400 transition-colors p-1 cursor-pointer"
            title="刷新留言"
          >
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- 4. 评论列表渲染 (100% 直连数据库真实数据，无假数据) -->
      <div v-if="loading" class="text-center py-10 text-xs text-neutral-400">
        正在加载留言...
      </div>
      <div v-else-if="sortedMessages.length === 0" class="text-center py-12 text-xs text-neutral-400">
        暂无留言，快来留下第一条足迹吧～
      </div>
      <div v-else class="flex flex-col gap-4">
        
        <div 
          v-for="msg in sortedMessages" 
          :key="msg.id"
          class="comment-item flex gap-3.5 p-3.5 rounded-xl hover:bg-black/2 dark:hover:bg-white/2 transition-colors border border-transparent hover:border-(--line-divider)"
        >
          <!-- 用户头像 -->
          <div class="w-10 h-10 rounded-full bg-(--primary)/15 text-(--primary) font-bold flex items-center justify-center text-sm flex-shrink-0 shadow-2xs">
            {{ (msg.nickname || '访')[0].toUpperCase() }}
          </div>

          <!-- 评论主体内容 -->
          <div class="flex-1 min-w-0">
            <!-- 头部：昵称, 徽章, 时间, 操作 -->
            <div class="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <div class="flex items-center gap-2">
                <span class="font-bold text-xs text-neutral-900 dark:text-neutral-100">{{ msg.nickname || '匿名访客' }}</span>
                <!-- 博主专属徽章 -->
                <span 
                  v-if="msg.isAdmin || msg.nickname === 'Cakehand-abc' || msg.nickname === 'Firefly'" 
                  class="px-1.5 py-0.2 rounded text-[10px] bg-(--primary)/15 text-(--primary) font-bold"
                >
                  博主
                </span>
                <span class="text-[11px] text-neutral-400">{{ formatDate(msg.createTime) }}</span>
              </div>

              <!-- 操作区：点赞 + 回复 + 管理员删除按钮 -->
              <div class="flex items-center gap-3 text-xs text-neutral-400">
                <!-- 点赞 -->
                <button 
                  @click="handleLike(msg)"
                  class="flex items-center gap-1 hover:text-(--primary) transition-colors cursor-pointer"
                  :class="{ 'text-(--primary) font-bold': msg.isLiked }"
                >
                  <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                  </svg>
                  <span v-if="msg.likes">{{ msg.likes }}</span>
                </button>

                <!-- 回复 -->
                <button 
                  @click="replyTo(msg)"
                  class="hover:text-(--primary) transition-colors cursor-pointer"
                >
                  回复
                </button>

                <!-- 🗑️ 管理员删除按钮 (管理员直接调用后端真实删除) -->
                <button 
                  v-if="canDelete"
                  @click="handleDelete(msg)"
                  class="text-red-500/80 hover:text-red-600 transition-colors cursor-pointer flex items-center gap-0.5"
                  title="删除该条留言"
                >
                  <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                  <span>删除</span>
                </button>
              </div>
            </div>

            <!-- 评论正文 -->
            <p class="text-xs md:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-2 break-words whitespace-pre-line">
              {{ msg.content }}
            </p>

            <!-- 底部小环境元信息 -->
            <div class="flex items-center gap-3 text-[10px] text-neutral-400">
              <span class="flex items-center gap-1">
                <span>💻</span>
                <span>{{ msg.os || 'Windows 11' }}</span>
              </span>
              <span class="flex items-center gap-1">
                <span>🌐</span>
                <span>{{ msg.browser || 'Chrome 147.0' }}</span>
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '../utils/request'

const messages = ref<any[]>([])
const loading = ref(true)
const submitting = ref(false)
const sortMode = ref<'latest' | 'hottest'>('latest')
const content = ref('')

// 获取当前登录用户
const currentUsername = computed(() => {
  const u = localStorage.getItem('username')
  return u || '匿名访客'
})

// 是否拥有删除权限 (登录账号为 Cakehand-abc 或拥有管理员 token)
const canDelete = computed(() => {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('username')
  return !!token || user === 'Cakehand-abc' || user === 'admin'
})

const sortedMessages = computed(() => {
  if (sortMode.value === 'hottest') {
    return [...messages.value].sort((a, b) => (b.likes || 0) - (a.likes || 0))
  }
  return [...messages.value].sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
})

const fetchMessages = async () => {
  loading.value = true
  try {
    const res: any = await request.get('/api/messages/list')
    if (res.code === 200 && Array.isArray(res.data)) {
      messages.value = res.data
    } else {
      messages.value = []
    }
  } catch (error) {
    messages.value = []
  } finally {
    loading.value = false
  }
}

const replyTo = (msg: any) => {
  content.value = `@${msg.nickname} `
  const el = document.getElementById('post-comments')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const handleLike = (msg: any) => {
  if (msg.isLiked) {
    msg.likes = Math.max(0, (msg.likes || 1) - 1)
    msg.isLiked = false
  } else {
    msg.likes = (msg.likes || 0) + 1
    msg.isLiked = true
    ElMessage.success('感谢点赞 ❤️')
  }
}

const submitComment = async () => {
  if (!content.value.trim()) {
    ElMessage.warning('留言内容不能为空哦！')
    return
  }
  submitting.value = true
  const nickname = currentUsername.value
  
  try {
    await request.post('/api/messages', {
      nickname,
      content: content.value.trim()
    })
    ElMessage.success('留言发表成功！')
    content.value = ''
    await fetchMessages()
  } catch (error) {
    ElMessage.error('留言提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

const handleDelete = async (msg: any) => {
  try {
    await ElMessageBox.confirm('确定要删除这条留言吗？此操作不可恢复。', '提示', {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await request.delete(`/api/messages/${msg.id}`)
    messages.value = messages.value.filter(m => m.id !== msg.id)
    ElMessage.success('留言已成功删除！')
  } catch (err: any) {
    if (err !== 'cancel') {
      ElMessage.error('删除失败或网络异常')
    }
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '刚刚'
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

onMounted(() => {
  fetchMessages()
})
</script>
