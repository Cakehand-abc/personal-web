<template>
  <div class="admin-gallery-management">
    <!-- 头部栏 -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-800">相册与画廊管理</h2>
        <p class="text-xs text-gray-500 mt-1">管理前台光影长廊的相册分类、封面与精美照片集</p>
      </div>

      <el-button type="primary" size="large" class="!rounded-xl shadow-sm" @click="openCreateAlbumDialog">
        + 新增相册
      </el-button>
    </div>

    <!-- 相册卡片网格列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="album in albums" 
        :key="album.id"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow"
      >
        <!-- 封面图与照片数 -->
        <div class="relative aspect-[16/10] bg-gray-100 overflow-hidden">
          <img 
            :src="album.cover || album.photos[0]?.url" 
            :alt="album.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          <div class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold">
            📷 {{ album.photos.length }} 张照片
          </div>
        </div>

        <!-- 相册信息 -->
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <h3 class="font-bold text-lg text-gray-800">{{ album.name }}</h3>
              <span class="text-xs text-gray-400 font-mono">{{ album.date }}</span>
            </div>
            <p class="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
              {{ album.description }}
            </p>
            <div class="flex flex-wrap gap-1.5 mb-4">
              <span 
                v-for="t in album.tags" 
                :key="t" 
                class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[11px] font-medium"
              >
                {{ t }}
              </span>
            </div>
          </div>

          <!-- 操作栏按钮 -->
          <div class="pt-3 border-t border-gray-100 flex items-center justify-between">
            <el-button size="small" type="primary" link @click="openManagePhotos(album)">
              📸 查看与管理照片 ({{ album.photos.length }})
            </el-button>

            <div class="flex items-center gap-2">
              <el-button size="small" link @click="openEditAlbumDialog(album)">编辑</el-button>
              <el-popconfirm title="确定要删除此相册吗？" @confirm="handleDeleteAlbum(album.id)">
                <template #reference>
                  <el-button size="small" type="danger" link>删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增 / 编辑相册弹窗 -->
    <el-dialog 
      v-model="albumDialogVisible" 
      :title="isEditAlbum ? '编辑相册' : '新增相册'" 
      width="540px"
      class="!rounded-2xl"
    >
      <el-form :model="albumForm" label-position="top">
        <el-form-item label="相册唯一标识 (ID)" required>
          <el-input v-model="albumForm.id" :disabled="isEditAlbum" placeholder="如 firefly-2026" />
        </el-form-item>
        <el-form-item label="相册名称" required>
          <el-input v-model="albumForm.name" placeholder="如 可爱流萤" />
        </el-form-item>
        <el-form-item label="相册描述">
          <el-input v-model="albumForm.description" type="textarea" rows="2" placeholder="一两句话描述相册主题..." />
        </el-form-item>
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="拍摄地点">
            <el-input v-model="albumForm.location" placeholder="如 崩坏：星穹铁道" />
          </el-form-item>
          <el-form-item label="相册日期">
            <el-date-picker v-model="albumForm.date" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" class="!w-full" />
          </el-form-item>
        </div>
        <el-form-item label="封面图片 URL">
          <el-input v-model="albumForm.cover" placeholder="如 /assets/images/DesktopWallpaper/d1.avif 或网络图片直链" />
        </el-form-item>
        <el-form-item label="相册标签 (逗号分隔)">
          <el-input v-model="albumForm.tagsInput" placeholder="如 崩坏星穹铁道, 流萤, 崩铁" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button @click="albumDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveAlbum">保存相册</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 照片管理弹窗 -->
    <el-dialog 
      v-model="photosDialogVisible" 
      :title="`【${selectedAlbum?.name}】的照片管理`" 
      width="780px"
      class="!rounded-2xl"
    >
      <div v-if="selectedAlbum">
        <!-- 快速添加照片栏 -->
        <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
          <h4 class="font-bold text-xs text-gray-700 mb-3">➕ 快速添加照片到相册</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <el-input v-model="newPhoto.url" placeholder="图片 URL 直链 (必填)" size="small" />
            <el-input v-model="newPhoto.title" placeholder="图片标题 (选填)" size="small" />
            <div class="flex gap-2">
              <el-input v-model="newPhoto.desc" placeholder="图片描述 (选填)" size="small" class="flex-1" />
              <el-button type="primary" size="small" @click="addPhotoToAlbum">添加</el-button>
            </div>
          </div>
        </div>

        <!-- 照片网格 -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[420px] overflow-y-auto pr-1">
          <div 
            v-for="(photo, idx) in selectedAlbum.photos" 
            :key="photo.id"
            class="relative rounded-xl overflow-hidden border border-gray-200 group bg-gray-100 aspect-square"
          >
            <img :src="photo.url" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5 text-white">
              <span class="text-xs font-bold line-clamp-1">{{ photo.title || `照片 #${idx + 1}` }}</span>
              <div class="flex justify-end">
                <el-button type="danger" size="small" circle @click="removePhotoFromAlbum(idx)">
                  🗑️
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { galleryAlbumConfig, type AlbumItem, type GalleryPhoto } from '../../config/galleryConfig'

const albums = ref<AlbumItem[]>(galleryAlbumConfig)

const albumDialogVisible = ref(false)
const isEditAlbum = ref(false)
const photosDialogVisible = ref(false)
const selectedAlbum = ref<AlbumItem | null>(null)

const albumForm = reactive({
  id: '',
  name: '',
  description: '',
  location: '',
  date: '',
  cover: '',
  tagsInput: ''
})

const newPhoto = reactive({
  url: '',
  title: '',
  desc: ''
})

const openCreateAlbumDialog = () => {
  isEditAlbum.value = false
  albumForm.id = 'album-' + Date.now().toString().slice(-4)
  albumForm.name = ''
  albumForm.description = ''
  albumForm.location = '崩坏：星穹铁道'
  albumForm.date = new Date().toISOString().slice(0, 10)
  albumForm.cover = ''
  albumForm.tagsInput = '崩坏星穹铁道, 摄影'
  albumDialogVisible.value = true
}

const openEditAlbumDialog = (album: AlbumItem) => {
  isEditAlbum.value = true
  albumForm.id = album.id
  albumForm.name = album.name
  albumForm.description = album.description
  albumForm.location = album.location
  albumForm.date = album.date
  albumForm.cover = album.cover || ''
  albumForm.tagsInput = (album.tags || []).join(', ')
  albumDialogVisible.value = true
}

const saveAlbum = () => {
  if (!albumForm.name.trim()) {
    ElMessage.warning('相册名称不能为空')
    return
  }

  const tags = albumForm.tagsInput.split(/[,，]/).map(t => t.trim()).filter(Boolean)

  if (isEditAlbum.value) {
    const target = albums.value.find(a => a.id === albumForm.id)
    if (target) {
      target.name = albumForm.name
      target.description = albumForm.description
      target.location = albumForm.location
      target.date = albumForm.date
      target.cover = albumForm.cover
      target.tags = tags
    }
  } else {
    const newAlbumItem: AlbumItem = {
      id: albumForm.id,
      name: albumForm.name,
      description: albumForm.description,
      location: albumForm.location,
      date: albumForm.date,
      cover: albumForm.cover || '/assets/images/DesktopWallpaper/d1.avif',
      tags,
      photos: [
        { id: Date.now(), url: albumForm.cover || '/assets/images/DesktopWallpaper/d1.avif', title: albumForm.name }
      ]
    }
    albums.value.unshift(newAlbumItem)
  }

  ElMessage.success('相册已成功保存！')
  albumDialogVisible.value = false
}

const handleDeleteAlbum = (id: string) => {
  albums.value = albums.value.filter(a => a.id !== id)
  ElMessage.success('相册已成功删除')
}

const openManagePhotos = (album: AlbumItem) => {
  selectedAlbum.value = album
  newPhoto.url = ''
  newPhoto.title = ''
  newPhoto.desc = ''
  photosDialogVisible.value = true
}

const addPhotoToAlbum = () => {
  if (!newPhoto.url.trim()) {
    ElMessage.warning('图片 URL 不能为空')
    return
  }
  if (!selectedAlbum.value) return

  const item: GalleryPhoto = {
    id: Date.now(),
    url: newPhoto.url.trim(),
    title: newPhoto.title.trim() || selectedAlbum.value.name,
    desc: newPhoto.desc.trim()
  }

  selectedAlbum.value.photos.unshift(item)
  ElMessage.success('已成功添加照片！')
  newPhoto.url = ''
  newPhoto.title = ''
  newPhoto.desc = ''
}

const removePhotoFromAlbum = (idx: number) => {
  if (!selectedAlbum.value) return
  selectedAlbum.value.photos.splice(idx, 1)
  ElMessage.success('已删除该照片')
}
</script>
