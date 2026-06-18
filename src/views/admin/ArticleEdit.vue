<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center gap-4">
        <el-button @click="router.back()" circle><el-icon><ArrowLeft /></el-icon></el-button>
        <h2 class="text-2xl font-bold text-gray-800">{{ isEdit ? '编辑文章' : '写新文章' }}</h2>
      </div>
      <div class="flex gap-4">
        <el-button @click="drawerVisible = true" size="large" class="border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-medium shadow-sm">
          文章设置
        </el-button>
        <el-button size="large" @click="saveArticle" :loading="saving" class="bg-blue-600 text-white border-none hover:bg-blue-700 font-bold shadow-md px-6">
          发布文章
        </el-button>
      </div>
    </div>

    <!-- 标题输入 -->
    <div class="mb-4">
      <el-input 
        v-model="form.title" 
        placeholder="输入文章标题..." 
        size="large"
        class="text-2xl font-bold"
        input-style="border-radius: 8px;"
      />
    </div>

    <!-- Markdown 编辑器 -->
    <div class="flex-1 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
      <MdEditor 
        v-model="form.content" 
        theme="light" 
        class="h-full w-full"
        @onUploadImg="onUploadImg"
        :footers="[]"
        placeholder="在此开始您的创作..."
      />
    </div>

    <!-- 右侧设置抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      title="文章设置"
      size="400px"
    >
      <el-form label-position="top" :model="form">
        <el-form-item label="文章摘要">
          <el-input v-model="form.summary" type="textarea" rows="3" placeholder="简短的一段话介绍这篇文章" />
        </el-form-item>

        <el-form-item label="文章封面">
          <div v-if="form.coverUrl" class="relative w-full h-40 rounded-xl overflow-hidden group">
            <img :src="form.coverUrl" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <el-button type="danger" @click="form.coverUrl = ''" plain>移除封面</el-button>
            </div>
          </div>
          <el-upload
            v-else
            class="w-full"
            drag
            action="/api/admin/upload"
            :headers="{ Authorization: 'Bearer ' + token }"
            :show-file-list="false"
            :on-success="(res: any) => { if(res.code===200) form.coverUrl = res.data }"
            accept="image/*"
          >
            <el-icon class="el-icon--upload text-gray-400"><UploadFilled /></el-icon>
            <div class="el-upload__text text-gray-500">拖拽图片到这里，或 <em>点击上传</em></div>
          </el-upload>
        </el-form-item>

        <el-form-item label="分类">
          <el-select v-model="form.categoryId" placeholder="选择或搜索分类" filterable>
            <el-option v-for="cat in categoryList" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="标签 (支持自定义)">
          <el-select
            v-model="form.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="选择标签或直接输入回车创建"
          >
            <el-option v-for="tag in tagList" :key="tag.id" :label="tag.name" :value="tag.name" />
          </el-select>
        </el-form-item>

        <el-form-item label="其他设置">
          <div class="flex flex-col gap-4 w-full">
            <el-switch v-model="form.isFeatured" active-text="推荐置顶" inactive-text="普通文章" active-color="#e94560" />
            
            <!-- 伪造发布时间 -->
            <div class="flex items-center gap-2 w-full mt-2">
              <span class="text-gray-600 text-sm w-20">发布时间</span>
              <el-date-picker
                v-model="form.createTime"
                type="datetime"
                placeholder="选择时间 (留空为当前)"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DDTHH:mm:ss"
                class="flex-1"
              />
            </div>
          </div>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import request from '../../utils/request'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const router = useRouter()
const route = useRoute()

const isEdit = ref(false)
const drawerVisible = ref(false)
const saving = ref(false)
const token = localStorage.getItem('token') || ''

const form = reactive({
  id: undefined as number | undefined,
  title: '',
  summary: '',
  content: '',
  coverUrl: '',
  categoryId: undefined as number | undefined,
  tags: [] as string[],
  isFeatured: false,
  createTime: ''
})

const categoryList = ref<any[]>([])
const tagList = ref<any[]>([])

// 获取分类和标签字典
const fetchDicts = async () => {
  try {
    const [catRes, tagRes]: any = await Promise.all([
      request.get('/api/categories/list'),
      request.get('/api/tags/list')
    ])
    if (catRes.code === 200) categoryList.value = catRes.data
    if (tagRes.code === 200) tagList.value = tagRes.data
  } catch (error) {
    ElMessage.error('获取分类或标签失败')
  }
}

// Markdown 内部拖拽/粘贴图片自动上传
const onUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
  const res = await Promise.all(
    files.map((file) => {
      const formData = new FormData()
      formData.append('file', file)
      return request.post('/api/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    })
  )
  // res 是一个数组，每个元素是 request 的返回值
  const urls = res.map((item: any) => item.data)
  callback(urls)
}



// 保存文章
const saveArticle = async () => {
  if (!form.title.trim()) {
    ElMessage.warning('文章标题不能为空！')
    return
  }
  if (!form.content.trim()) {
    ElMessage.warning('文章内容不能为空！')
    return
  }

  // 如果没有摘要，自动从正文中截取前 120 个字
  if (!form.summary || !form.summary.trim()) {
    // 粗略移除一些常见的 Markdown 符号以获取纯文本
    const plainText = form.content
      .replace(/[#*`>\[\]\n]/g, ' ')
      .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片语法
      .replace(/\[.*?\]\(.*?\)/g, '')  // 移除链接语法
      .replace(/\s+/g, ' ')
      .trim()
    form.summary = plainText.substring(0, 120) + (plainText.length > 120 ? '...' : '')
  }

  saving.value = true
  try {
    const url = isEdit.value ? '/api/articles/admin/update' : '/api/articles/admin/save'
    const method = isEdit.value ? 'put' : 'post'
    const res: any = await request[method](url, form)
    
    if (res.code === 200) {
      ElMessage.success(isEdit.value ? '文章修改成功！' : '文章发布成功！')
      router.push('/admin/articles')
    } else {
      ElMessage.error(res.msg || '保存失败')
    }
  } catch (error) {
    ElMessage.error('保存失败，请检查网络')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  fetchDicts()
  const id = route.query.id
  if (id) {
    isEdit.value = true
    form.id = Number(id)
    try {
      const res: any = await request.get(`/api/articles/admin/${id}`)
      if (res.code === 200 && res.data) {
        form.title = res.data.title
        form.summary = res.data.summary
        form.content = res.data.content
        form.coverUrl = res.data.coverUrl
        form.categoryId = res.data.categoryId
        form.isFeatured = res.data.isFeatured
        form.createTime = res.data.createTime || ''
        form.tags = res.data.tags ? res.data.tags.map((t: any) => t.name) : []
      }
    } catch (error) {
      ElMessage.error('无法获取文章详情')
    }
  }
})
</script>

<style scoped>
:deep(.el-select) {
  width: 100%;
}
</style>
