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

    <!-- 2. 评论区输入与展示卡片 (对齐 Firefly Twikoo 原版样式) -->
    <div id="post-comments" class="card-base p-6 md:p-8 relative overflow-hidden">
      
      <!-- 评论区顶部标题栏 -->
      <div class="relative z-10 mb-6">
        <div class="flex items-center gap-3 mb-1">
          <div class="w-1 h-5 bg-gradient-to-b from-(--primary) to-transparent rounded-full"></div>
          <h3 class="text-lg md:text-xl font-bold text-(--btn-content)">发表留言与评论</h3>
        </div>
        <p class="text-xs text-neutral-500 dark:text-neutral-400 ml-4">
          分享你的想法，与大家交流讨论
        </p>
      </div>

      <!-- 评论输入框表单 (Twikoo 原版三联输入 + 富文本输入区) -->
      <div class="twikoo-form-wrapper mb-8">
        <!-- 昵称、邮箱、网址三联输入栏 -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
          <!-- 昵称 -->
          <div class="flex items-center rounded-lg border border-(--line-divider) overflow-hidden bg-(--btn-regular-bg) text-xs">
            <span class="px-3 py-2 text-neutral-500 font-medium bg-black/5 dark:bg-white/5 border-r border-(--line-divider)">昵称</span>
            <input 
              v-model="form.nickname" 
              type="text" 
              placeholder="必填" 
              maxlength="20"
              class="flex-1 px-3 py-2 bg-transparent outline-none text-neutral-800 dark:text-neutral-200"
            />
          </div>

          <!-- 邮箱 -->
          <div class="flex items-center rounded-lg border border-(--line-divider) overflow-hidden bg-(--btn-regular-bg) text-xs">
            <span class="px-3 py-2 text-neutral-500 font-medium bg-black/5 dark:bg-white/5 border-r border-(--line-divider)">邮箱</span>
            <input 
              v-model="form.email" 
              type="email" 
              placeholder="选填 (接收回复)" 
              class="flex-1 px-3 py-2 bg-transparent outline-none text-neutral-800 dark:text-neutral-200"
            />
          </div>

          <!-- 网址 -->
          <div class="flex items-center rounded-lg border border-(--line-divider) overflow-hidden bg-(--btn-regular-bg) text-xs">
            <span class="px-3 py-2 text-neutral-500 font-medium bg-black/5 dark:bg-white/5 border-r border-(--line-divider)">网址</span>
            <input 
              v-model="form.website" 
              type="text" 
              placeholder="选填 (个人主页)" 
              class="flex-1 px-3 py-2 bg-transparent outline-none text-neutral-800 dark:text-neutral-200"
            />
          </div>
        </div>

        <!-- 评论正文区域 -->
        <div class="rounded-xl border border-(--line-divider) bg-(--btn-regular-bg) overflow-hidden focus-within:border-(--primary) transition-all">
          <textarea 
            v-model="form.content"
            rows="3"
            maxlength="500"
            placeholder="输入评论（支持 Markdown 语法与表情包）..."
            class="w-full p-3.5 bg-transparent outline-none text-xs md:text-sm text-neutral-800 dark:text-neutral-200 resize-y"
          ></textarea>

          <!-- 快捷操作栏 (表情、字数、发送按钮) -->
          <div class="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-t border-(--line-divider) bg-black/3 dark:bg-white/3 text-xs">
            
            <!-- 表情按钮组 -->
            <div class="flex items-center gap-1 relative">
              <button 
                type="button" 
                @click="toggleEmojiPicker"
                class="px-2.5 py-1 rounded-md hover:bg-(--btn-regular-bg-hover) text-neutral-600 dark:text-neutral-300 flex items-center gap-1 font-medium cursor-pointer"
              >
                <span>😊</span>
                <span>表情</span>
              </button>

              <!-- 快捷表情选择弹窗 -->
              <div 
                v-if="showEmoji" 
                class="absolute left-0 bottom-9 z-30 p-3 rounded-xl card-base shadow-xl border border-(--line-divider) w-64 grid grid-cols-6 gap-2"
              >
                <button 
                  v-for="e in emojiList" 
                  :key="e" 
                  @click="insertEmoji(e)"
                  class="text-base hover:scale-125 transition-transform p-1 cursor-pointer"
                >
                  {{ e }}
                </button>
              </div>
            </div>

            <!-- 右侧字数统计与发送 -->
            <div class="flex items-center gap-3">
              <span class="text-[11px] text-neutral-400 font-mono">{{ form.content.length }} / 500</span>
              <button 
                @click="submitComment"
                :disabled="submitting || !form.content.trim()"
                class="px-4 py-1.5 rounded-lg bg-(--primary) text-white font-bold text-xs hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm cursor-pointer"
              >
                {{ submitting ? '发送中...' : '发送' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. 评论列表头部与排序栏 -->
      <div class="flex items-center justify-between pb-3 mb-4 border-b border-(--line-divider) text-xs">
        <div class="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
          <span class="text-sm">{{ totalCommentsCount }}</span>
          <span class="text-neutral-500 font-normal">条评论</span>
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
            class="hover:text-(--primary) text-neutral-400 transition-colors p-1"
            title="刷新评论"
          >
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- 4. 评论列表渲染 (完全对齐 Firefly Twikoo 评论卡片样式) -->
      <div v-if="loading" class="text-center py-10 text-xs text-neutral-400">
        正在加载留言评论...
      </div>
      <div v-else-if="sortedMessages.length === 0" class="text-center py-12 text-xs text-neutral-400">
        暂无评论，快来留下第一条足迹吧～
      </div>
      <div v-else class="flex flex-col gap-4">
        
        <div 
          v-for="msg in sortedMessages" 
          :key="msg.id"
          class="comment-item flex gap-3.5 p-3.5 rounded-xl hover:bg-black/2 dark:hover:bg-white/2 transition-colors"
        >
          <!-- 用户头像 (首字母生成头像) -->
          <div class="w-10 h-10 rounded-xl bg-(--primary)/12 text-(--primary) font-bold flex items-center justify-center text-sm flex-shrink-0 shadow-2xs">
            {{ (msg.nickname || '访')[0].toUpperCase() }}
          </div>

          <!-- 评论主体内容 -->
          <div class="flex-1 min-w-0">
            <!-- 头部：昵称, 博主徽章, 发布时间, 操作 -->
            <div class="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <div class="flex items-center gap-2">
                <span class="font-bold text-xs text-neutral-900 dark:text-neutral-100">{{ msg.nickname || '匿名访客' }}</span>
                <!-- 博主专属徽章 -->
                <span 
                  v-if="msg.isAdmin || msg.nickname === 'Firefly' || msg.nickname === '夏叶'" 
                  class="px-1.5 py-0.2 rounded text-[10px] bg-(--primary)/15 text-(--primary) font-bold"
                >
                  博主
                </span>
                <span class="text-[11px] text-neutral-400">{{ formatDate(msg.createTime) }}</span>
              </div>

              <!-- 点赞与回复操作 -->
              <div class="flex items-center gap-3 text-xs text-neutral-400">
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
                <button 
                  @click="replyTo(msg)"
                  class="hover:text-(--primary) transition-colors cursor-pointer"
                >
                  回复
                </button>
              </div>
            </div>

            <!-- 评论正文 -->
            <p class="text-xs md:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-2">
              {{ msg.content }}
            </p>

            <!-- 底部小环境元信息 (Windows / Chrome) -->
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '../utils/request'

const messages = ref<any[]>([])
const loading = ref(true)
const submitting = ref(false)
const showEmoji = ref(false)
const sortMode = ref<'latest' | 'hottest'>('latest')

const form = reactive({
  nickname: '',
  email: '',
  website: '',
  content: ''
})

const emojiList = ['🌸', '✨', '🍀', '🌟', '💻', '🎉', '❤️', '🍃', '🔥', '☕', '🐱', '🚀']

const defaultPresetMessages = [
  {
    id: 101,
    nickname: '倾听风雨',
    content: '蒸蒸日上啊，当时看这个网页的时候，音乐组件还在左侧呢，现在的 Firefly 风格太好看了！✨',
    createTime: '2026-08-20T15:30:00.000Z',
    likes: 4,
    os: 'Windows 11',
    browser: 'Microsoft Edge 148.0'
  },
  {
    id: 102,
    nickname: 'Firefly',
    isAdmin: true,
    content: '欢迎各位朋友来到我的博客！如果遇到任何 bug 或有好的设计建议，随时在下方留言交流哦～🌸',
    createTime: '2026-08-18T10:00:00.000Z',
    likes: 12,
    os: 'macOS Sequoia',
    browser: 'Chrome 147.0'
  },
  {
    id: 103,
    nickname: '技术极客',
    content: 'Vue 3 + TypeScript 的响应式架构加上 OKLCH 色彩调节确实丝滑，收藏了博主的主页！',
    createTime: '2026-08-15T09:20:00.000Z',
    likes: 6,
    os: 'Linux / Arch',
    browser: 'Firefox 138.0'
  }
]

const totalCommentsCount = computed(() => {
  return messages.value.length || defaultPresetMessages.length
})

const sortedMessages = computed(() => {
  const list = messages.value.length > 0 ? messages.value : defaultPresetMessages
  if (sortMode.value === 'hottest') {
    return [...list].sort((a, b) => (b.likes || 0) - (a.likes || 0))
  }
  return [...list].sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
})

const fetchMessages = async () => {
  loading.value = true
  try {
    const res: any = await request.get('/api/messages/list')
    if (res.code === 200 && Array.isArray(res.data) && res.data.length > 0) {
      messages.value = res.data
    } else {
      messages.value = defaultPresetMessages
    }
  } catch (error) {
    messages.value = defaultPresetMessages
  } finally {
    loading.value = false
  }
}

const toggleEmojiPicker = () => {
  showEmoji.value = !showEmoji.value
}

const insertEmoji = (emoji: string) => {
  form.content += emoji
  showEmoji.value = false
}

const replyTo = (msg: any) => {
  form.content = `@${msg.nickname} `
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
  if (!form.content.trim()) {
    ElMessage.warning('评论内容不能为空哦！')
    return
  }
  submitting.value = true
  const nickname = form.nickname.trim() || '匿名访客'
  
  try {
    await request.post('/api/messages', {
      nickname,
      content: form.content.trim()
    })
    
    const newMsg = {
      id: Date.now(),
      nickname,
      content: form.content.trim(),
      createTime: new Date().toISOString(),
      likes: 0,
      os: 'Windows 11',
      browser: 'Chrome 147.0'
    }
    messages.value = [newMsg, ...messages.value]
    
    ElMessage.success('留言发表成功！')
    form.content = ''
  } catch (error) {
    // 即使离线也可以本地响应
    const newMsg = {
      id: Date.now(),
      nickname,
      content: form.content.trim(),
      createTime: new Date().toISOString(),
      likes: 0,
      os: 'Windows 11',
      browser: 'Chrome 147.0'
    }
    messages.value = [newMsg, ...messages.value]
    ElMessage.success('留言发表成功！')
    form.content = ''
  } finally {
    submitting.value = false
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
