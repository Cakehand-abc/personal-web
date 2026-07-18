<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-gray-800">作品集管理</h2>
      <el-button type="primary" @click="openDialog()">添加项目</el-button>
    </div>

    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="项目名称" width="180" />
        <el-table-column prop="description" label="项目描述" min-width="250" show-overflow-tooltip />
        <el-table-column prop="githubUrl" label="Github" min-width="150" show-overflow-tooltip>
          <template #default="{ row }">
            <a :href="row.githubUrl" target="_blank" class="text-blue-500 hover:underline" v-if="row.githubUrl">链接</a>
          </template>
        </el-table-column>
        <el-table-column prop="downloadUrl" label="源码下载" min-width="150" show-overflow-tooltip>
          <template #default="{ row }">
            <a :href="row.downloadUrl" target="_blank" class="text-blue-500 hover:underline" v-if="row.downloadUrl">链接</a>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="openDialog(row)">编辑</el-button>
            <el-popconfirm title="确定要删除该项目吗？" @confirm="handleDelete(row.id)">
              <template #reference>
                <el-button type="danger" size="small" link>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑项目' : '添加项目'" width="500px">
      <el-form :model="form" label-width="100px" @submit.prevent>
        <el-form-item label="项目名称">
          <el-input v-model="form.name" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="项目描述">
          <el-input v-model="form.description" type="textarea" placeholder="简短的一句话描述"></el-input>
        </el-form-item>
        <el-form-item label="Github 链接">
          <el-input v-model="form.githubUrl" placeholder="https://github.com/..."></el-input>
        </el-form-item>
        <el-form-item label="源码下载">
          <el-input v-model="form.downloadUrl" placeholder="Zip 下载链接或其他网盘链接"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitting">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '../../utils/request'

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const submitting = ref(false)

const form = reactive({
  id: undefined,
  name: '',
  description: '',
  githubUrl: '',
  downloadUrl: ''
})

const fetchData = async () => {
  loading.value = true
  try {
    const res: any = await request.get('/api/projects/list')
    if (res.code === 200) {
      tableData.value = res.data
    } else {
      ElMessage.error(res.msg || '获取数据失败')
    }
  } catch (error) {
    ElMessage.error('网络错误')
  } finally {
    loading.value = false
  }
}

const openDialog = (row?: any) => {
  if (row) {
    form.id = row.id
    form.name = row.name
    form.description = row.description
    form.githubUrl = row.githubUrl
    form.downloadUrl = row.downloadUrl
  } else {
    form.id = undefined
    form.name = ''
    form.description = ''
    form.githubUrl = ''
    form.downloadUrl = ''
  }
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!form.name) {
    ElMessage.warning('项目名称不能为空')
    return
  }
  submitting.value = true
  try {
    const isEdit = !!form.id
    const url = isEdit ? '/api/projects/admin/update' : '/api/projects/admin/save'
    const method = isEdit ? 'put' : 'post'
    
    const res: any = await request[method](url, form)
    if (res.code === 200) {
      ElMessage.success(isEdit ? '修改成功' : '新增成功')
      dialogVisible.value = false
      fetchData()
    } else {
      ElMessage.error(res.msg || '操作失败')
    }
  } catch (error) {
    ElMessage.error('网络错误')
  } finally {
    submitting.value = false
  }
}

const handleDelete = async (id: number) => {
  try {
    const res: any = await request.delete(`/api/projects/admin/${id}`)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      fetchData()
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch (error) {
    ElMessage.error('网络错误')
  }
}

onMounted(() => {
  fetchData()
})
</script>
