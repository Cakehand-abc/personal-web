<template>
  <div class="h-full flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 p-8">
    <el-empty description="画廊功能开发中...">
      <template #image>
        <el-icon :size="80" color="#c0c4cc"><Picture /></el-icon>
      </template>
      <div class="text-gray-400 mt-4 text-center max-w-md">
        <p>这里未来将用于管理您的所有画廊图片和壁纸，</p>
        <p>您可以进行上传、分类和展示排序等操作。</p>
      </div>
      <el-button type="primary" class="mt-6" @click="goBack" plain>返回文章管理</el-button>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
import { Picture } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => router.push('/admin/articles')
</script>
