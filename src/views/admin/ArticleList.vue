<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-gray-800">文章管理</h2>
      <el-button type="primary" size="large" @click="router.push('/admin/article-edit')">
        <el-icon class="mr-2"><Plus /></el-icon> 发布新文章
      </el-button>
    </div>

    <!-- 列表卡片 -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden">
      <el-table 
        :data="articleList" 
        style="width: 100%;"
        v-loading="loading"
      >
        <el-table-column prop="id" label="ID" width="80" />
        
        <el-table-column label="封面" width="120">
          <template #default="{ row }">
            <el-image 
              :src="row.coverUrl" 
              class="w-16 h-10 rounded object-cover"
              :preview-src-list="row.coverUrl ? [row.coverUrl] : []"
              preview-teleported
            >
              <template #error>
                <div class="w-16 h-10 bg-white/10 rounded flex items-center justify-center text-xs text-gray-500">无封面</div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        
        <el-table-column prop="title" label="标题" min-width="200">
          <template #default="{ row }">
            <div class="font-bold text-gray-800">{{ row.title }}</div>
            <div class="text-xs text-gray-500 mt-1 truncate" style="max-width: 250px;">{{ row.summary || '暂无摘要' }}</div>
          </template>
        </el-table-column>

        <el-table-column label="分类" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.category" type="info" effect="dark" size="small">{{ row.category.name }}</el-tag>
            <span v-else class="text-xs text-gray-500">未分类</span>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.isFeatured" type="danger" effect="dark" size="small">置顶</el-tag>
            <el-tag v-else type="success" effect="dark" size="small">已发布</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="发布时间" width="180">
          <template #default="{ row }">
            <div class="text-sm">{{ formatDate(row.createTime) }}</div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="editArticle(row.id)">编辑</el-button>
            <el-popconfirm title="确定要永久删除这篇文章吗？" @confirm="deleteArticle(row.id)">
              <template #reference>
                <el-button type="danger" link>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="mt-6 flex justify-end">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchArticles"
          @current-change="fetchArticles"
          background
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import request from '../../utils/request'
import { ElMessage } from 'element-plus'

const router = useRouter()

const loading = ref(false)
const articleList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const fetchArticles = async () => {
  loading.value = true
  try {
    const res: any = await request.get('/api/articles/list', {
      params: {
        current: currentPage.value,
        size: pageSize.value
      }
    })
    if (res.code === 200) {
      articleList.value = res.data.records || []
      total.value = res.data.total || 0
    } else {
      ElMessage.error(res.msg || '获取文章列表失败')
    }
  } catch (error) {
    ElMessage.error('网络错误，无法获取文章列表')
  } finally {
    loading.value = false
  }
}

const editArticle = (id: number) => {
  router.push(`/admin/article-edit?id=${id}`)
}

const deleteArticle = async (id: number) => {
  try {
    const res: any = await request.delete(`/api/articles/admin/${id}`)
    if (res.code === 200) {
      ElMessage.success('文章已删除')
      fetchArticles()
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch (error) {
    ElMessage.error('网络错误，删除失败')
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

onMounted(() => {
  fetchArticles()
})
</script>

<style scoped>
/* 分页器样式保持默认即可 */
</style>
