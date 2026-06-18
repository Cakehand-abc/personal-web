<template>
  <div>
    <h2 class="text-3xl font-bold mb-6 text-gray-800">网站全局设置</h2>
    
    <div class="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-4xl">
      <el-form label-position="top" :model="form" class="space-y-6 custom-light-form">
        
        <!-- 基本信息设置 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <el-form-item label="博客名称">
            <el-input v-model="form.siteName" placeholder="例如：Cakehand 的个人博客" size="large"></el-input>
          </el-form-item>
          
          <el-form-item label="站长签名 (Signature)">
            <el-input v-model="form.siteSignature" placeholder="例如：Hello World" size="large"></el-input>
          </el-form-item>
        </div>

        <el-form-item label="ICP 备案号 (如果有)">
          <el-input v-model="form.recordNumber" placeholder="例如：浙ICP备202xxxx号-1" size="large"></el-input>
        </el-form-item>

        <el-divider border-style="dashed">
          <span class="text-gray-400 font-normal">开场特效设置</span>
        </el-divider>

        <!-- 开场动画类型选择 -->
        <el-form-item label="首页开场展示形式">
          <el-radio-group v-model="form.introMediaType" size="large">
            <el-radio-button label="image">高清大图</el-radio-button>
            <el-radio-button label="video">震撼视频</el-radio-button>
          </el-radio-group>
          <div class="text-gray-400 text-sm mt-2">
            提示：如果您未上传任何素材，系统将自动降级使用纯 CSS 炫酷文字特效。
          </div>
        </el-form-item>

        <!-- 超级酷炫的拖拽上传器 -->
        <el-form-item label="上传您的媒体素材">
          <el-upload
            class="upload-demo w-full"
            drag
            action="http://localhost:8080/api/admin/upload"
            :headers="uploadHeaders"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :show-file-list="false"
            accept="image/*,video/*"
          >
            <el-icon class="el-icon--upload text-gray-400"><upload-filled /></el-icon>
            <div class="el-upload__text text-gray-500 mt-4">
              拖拽您的文件到这里，或者 <em class="text-blue-500">点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip text-gray-400">
                支持 JPG/PNG/MP4 文件，大小不超过 100MB。上传成功后会自动替换下方链接。
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <!-- 上传结果展示区 -->
        <el-form-item label="当前生效的媒体链接 (系统自动生成)">
          <div class="flex w-full gap-4">
            <el-input v-model="form.introMediaUrl" readonly placeholder="留空则系统自动降级为纯 CSS 文字特效" size="large" class="flex-1">
              <template #append>
                <el-button @click="previewMedia">预览</el-button>
              </template>
            </el-input>
            <el-button type="danger" size="large" @click="form.introMediaUrl = ''" plain>移除并恢复文字特效</el-button>
          </div>
        </el-form-item>

        <!-- 保存按钮 -->
        <div class="pt-6">
          <el-button type="primary" size="large" class="w-full md:w-auto px-12" @click="saveSettings">
            保存全局配置
          </el-button>
        </div>

      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import request from '../../utils/request'

// 配置表单数据
const form = reactive({
  id: 1,
  siteName: '',
  siteSignature: '',
  recordNumber: '',
  introMediaType: 'image',
  introMediaUrl: ''
})

// 为 el-upload 绑定带有 Token 的请求头
const uploadHeaders = {
  Authorization: 'Bearer ' + localStorage.getItem('token')
}

// 页面加载时拉取现有配置
const loadSettings = async () => {
  try {
    const res: any = await request.get('/api/settings')
    if (res.code === 200 && res.data) {
      Object.assign(form, res.data)
    }
  } catch (error) {
    ElMessage.error('获取网站配置失败')
  }
}

// 文件上传成功回调
const handleUploadSuccess = (response: any) => {
  if (response.code === 200) {
    ElMessage.success('媒体素材上传成功！')
    form.introMediaUrl = response.data // 把后端返回的网络直链填进输入框
  } else {
    ElMessage.error('上传失败：' + response.msg)
  }
}

// 文件上传失败回调
const handleUploadError = () => {
  ElMessage.error('网络错误或文件过大导致上传失败')
}

// 预览媒体
const previewMedia = () => {
  if (!form.introMediaUrl) {
    ElMessage.warning('暂无媒体文件可预览')
    return
  }
  window.open(form.introMediaUrl, '_blank')
}

const saveSettings = async () => {
  try {
    const res: any = await request.put('/api/settings/admin', form)
    if (res.code === 200) {
      ElMessage.success('全局设置保存成功！')
    } else {
      ElMessage.error('保存失败：' + res.msg)
    }
  } catch (error: any) {
    let errorDetail = error.message
    if (error.response) {
      errorDetail = `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`
    }
    ElMessage({
      message: '错误详情: ' + errorDetail,
      type: 'error',
      duration: 10000,
      showClose: true
    })
    console.error('保存失败详情:', error)
  }
}

onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
/* 浅色表单样式重写 */
:deep(.custom-light-form .el-form-item__label) {
  color: #374151; /* gray-700 */
  font-weight: 500;
}

:deep(.el-upload-dragger) {
  background-color: #f9fafb; /* gray-50 */
  border: 1px dashed #e5e7eb; /* gray-200 */
  transition: all 0.3s;
}

:deep(.el-upload-dragger:hover) {
  border-color: #3b82f6; /* blue-500 */
  background-color: rgba(59, 130, 246, 0.05);
}

:deep(.el-divider__text) {
  background-color: transparent;
  color: #9ca3af; /* gray-400 */
}
</style>
