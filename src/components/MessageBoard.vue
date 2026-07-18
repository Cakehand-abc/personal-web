<template>
  <div class="message-board relative w-full h-[500px] rounded-2xl overflow-hidden shadow-lg border-8 border-[#8B5A2B]">
    <!-- 黑板背景 (黑里透绿) -->
    <div class="absolute inset-0 bg-[#243B2E]" style="background-image: url('https://www.transparenttextures.com/patterns/black-paper.png'); opacity: 0.95;"></div>
    
    <!-- 加载中 -->
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center z-10 text-white/50 text-xl font-bold tracking-widest">
      Loading Messages...
    </div>
    
    <!-- 留言便利贴列表 -->
    <div v-else class="relative w-full h-full p-6 flex flex-wrap gap-6 items-start content-start overflow-y-auto custom-scrollbar z-10">
      <div 
        v-for="msg in messages" 
        :key="msg.id" 
        class="sticky-note p-4 shadow-md relative w-48 min-h-[140px] flex flex-col hover:scale-105 hover:z-20 transition-transform duration-300 cursor-pointer"
        :style="{ backgroundColor: msg.color, transform: `rotate(${msg.rotation}deg)` }"
      >
        <!-- 图钉 -->
        <div class="push-pin absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full shadow-[0_3px_5px_rgba(0,0,0,0.3)] z-10 bg-gradient-to-br from-red-400 to-red-600">
          <div class="absolute top-[2px] left-[3px] w-1.5 h-1.5 bg-white/40 rounded-full"></div>
        </div>
        
        <!-- 留言内容 -->
        <div class="message-content text-gray-800 text-sm font-medium leading-relaxed flex-1 mt-2 line-clamp-4 overflow-hidden" style="font-family: 'Comic Sans MS', 'Ma Shan Zheng', cursive;">
          {{ msg.content }}
        </div>
        
        <!-- 底部署名与时间 -->
        <div class="mt-3 flex justify-between items-end border-t border-black/10 pt-2">
          <span class="text-xs font-bold text-gray-600 truncate max-w-[80px]" :title="msg.nickname">- {{ msg.nickname }}</span>
          <span class="text-[10px] text-gray-500 scale-90 origin-right">{{ formatDate(msg.createTime) }}</span>
        </div>
      </div>
    </div>

    <!-- 贴一张按钮 -->
    <button @click="showDialog = true" class="absolute bottom-6 right-6 z-30 w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-500 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 hover:shadow-2xl transition-all duration-300">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
    </button>

    <!-- 留言弹窗 -->
    <el-dialog v-model="showDialog" title="📝 贴一张新的便利贴" width="400px" custom-class="message-dialog" :close-on-click-modal="false">
      <el-form :model="form" @submit.prevent>
        <el-form-item>
          <el-input v-model="form.nickname" placeholder="您的昵称 (留空默认为 匿名游客)" maxlength="20" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.content" type="textarea" :rows="4" placeholder="想对这个世界说点什么？" maxlength="200" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitMessage" :loading="submitting">贴 上 去</el-button>
        </span>
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
      nickname: form.nickname,
      content: form.content
    })
    if (res.code === 200) {
      ElMessage.success('留言成功！')
      showDialog.value = false
      form.nickname = ''
      form.content = ''
      await fetchMessages() // 重新拉取
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
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

onMounted(() => {
  fetchMessages()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap');

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.sticky-note {
  /* 便利贴的一角微卷效果 */
  border-bottom-right-radius: 15px 5px;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.15);
}

.sticky-note::after {
  content: "";
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  background: rgba(0,0,0,0.05);
  border-top-left-radius: 20px;
  border-bottom-right-radius: 15px 5px;
}
</style>
