<template>
  <div class="message-board card-base p-6 md:p-8" v-scroll-reveal>
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-(--line-divider) pb-4">
      <div>
        <h3 class="text-xl font-bold text-(--text-bright) flex items-center gap-2">
          <span>💬</span>
          <span>留言交流区</span>
        </h3>
        <p class="text-xs text-(--text-dim) mt-1">留下一句问候，或是分享你此刻的心情与想法吧～</p>
      </div>

      <button 
        @click="showDialog = true" 
        class="px-4 py-2 rounded-xl bg-(--primary) hover:bg-(--primary-hover) text-white font-medium text-xs flex items-center gap-2 shadow-md shadow-(--primary)/20 transition-all hover:scale-105 active:scale-95 self-start md:self-auto"
      >
        <span>✍️</span>
        <span>发表留言</span>
      </button>
    </div>

    <!-- 加载中 -->
    <div v-if="loading" class="text-center py-12 text-sm text-(--text-dim)">
      加载留言中...
    </div>

    <!-- 留言为空 -->
    <div v-else-if="messages.length === 0" class="text-center py-12 text-sm text-(--text-dim)">
      暂无留言，快来留下第一条足迹吧！
    </div>

    <!-- 留言列表 (Firefly 气泡卡片瀑布流) -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-1">
      <div 
        v-for="msg in messages" 
        :key="msg.id" 
        class="message-card p-4 rounded-2xl bg-(--card-bg) border border-(--line-divider) shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
      >
        <div class="flex items-center gap-2.5 mb-2.5">
          <div class="w-8 h-8 rounded-full bg-(--primary)/15 text-(--primary) font-bold flex items-center justify-center text-xs flex-shrink-0">
            {{ (msg.nickname || '友')[0].toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-xs font-bold text-(--text-bright) truncate">{{ msg.nickname || '匿名访客' }}</div>
            <div class="text-[10px] text-(--text-dim)">{{ formatDate(msg.createTime) }}</div>
          </div>
        </div>

        <p class="text-xs text-(--text-normal) leading-relaxed line-clamp-4 my-1 flex-1">
          {{ msg.content }}
        </p>

        <div class="mt-3 pt-2 border-t border-(--line-divider) flex justify-end text-[11px] text-(--text-dim)">
          <span>✨ 来自星海的留言</span>
        </div>
      </div>
    </div>

    <!-- 留言弹窗 -->
    <el-dialog 
      v-model="showDialog" 
      title="✍️ 发表留言" 
      width="90%" 
      class="max-w-md rounded-2xl"
      :close-on-click-modal="false"
    >
      <el-form :model="form" @submit.prevent>
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" placeholder="您的昵称 (留空默认为 匿名访客)" maxlength="20" />
        </el-form-item>
        <el-form-item label="留言内容">
          <el-input 
            v-model="form.content" 
            type="textarea" 
            :rows="4" 
            placeholder="想对博主或大家说点什么？" 
            maxlength="200" 
            show-word-limit 
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="submitMessage" :loading="submitting">发送留言</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '../utils/request'

const messages = ref<any[]>([])
const loading = ref(true)
const showDialog = ref(false)
const submitting = ref(false)

const form = reactive({
  nickname: '',
  content: ''
})

const fetchMessages = async () => {
  loading.value = true
  try {
    const res: any = await request.get('/api/messages/list')
    if (res.code === 200) {
      messages.value = res.data
    }
  } catch (error) {
    console.error('获取留言失败', error)
  } finally {
    loading.value = false
  }
}

const submitMessage = async () => {
  if (!form.content.trim()) {
    ElMessage.warning('留言内容不能为空哦！')
    return
  }
  submitting.value = true
  try {
    const res: any = await request.post('/api/messages', {
      nickname: form.nickname.trim() || '匿名访客',
      content: form.content.trim()
    })
    if (res.code === 200) {
      ElMessage.success('留言成功！')
      showDialog.value = false
      form.nickname = ''
      form.content = ''
      await fetchMessages()
    } else {
      ElMessage.error(res.msg || '留言失败')
    }
  } catch (error) {
    ElMessage.error('网络开小差了，稍后再试吧')
  } finally {
    submitting.value = false
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '刚刚'
  const date = new Date(dateStr)
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

onMounted(() => {
  fetchMessages()
})
</script>
