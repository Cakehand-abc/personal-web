<template>
  <div class="gallery-page min-h-screen bg-(--page-bg)">
    <!-- 顶部全景壁纸 Banner + 落樱与水波纹 -->
    <FireflyBanner />
    <SakuraEffect />

    <!-- 主体栅格容器 (单侧栏大宽屏沉浸式布局 - 100% 对齐图 4 整体版式) -->
    <div class="max-w-[1440px] mx-auto px-4 md:px-8 py-8 relative z-20">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-8 items-start">
        
        <!-- 左侧主内容流 (相册列表 / 相册详情瀑布流) -->
        <div class="main-stream-column flex flex-col gap-6 min-w-0">

          <!-- ================= 视图 1：相册列表 (对齐图 4，无多余标签，智能模糊搜索) ================= -->
          <div v-if="!currentAlbum" class="flex flex-col gap-6">
            
            <!-- 1. 相册头部卡片 -->
            <div class="card-base p-6 md:p-8 relative overflow-hidden">
              <div class="flex items-center gap-3 mb-2">
                <div class="h-9 w-9 rounded-xl bg-(--primary) flex items-center justify-center text-white text-lg shadow-sm">
                  🖼️
                </div>
                <h2 class="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100">相册</h2>
              </div>
              <p class="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                记录生活中的美好瞬间，定格沿途的风景与心绪
              </p>

              <!-- 搜索框 (纯净无占位文字) -->
              <div class="relative w-full">
                <input 
                  v-model="searchQuery"
                  type="text" 
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-(--line-divider) bg-(--btn-regular-bg) text-xs md:text-sm text-(--text-bright) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20 transition-all"
                />
                <svg class="w-4 h-4 text-neutral-400 absolute left-3.5 top-3 fill-current" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </div>
            </div>

            <!-- 2. 相册卡片列表 (堆叠效果卡片，无需密码全部直接查看) -->
            <div v-if="filteredAlbums.length === 0" class="card-base p-12 text-center text-sm text-(--text-dim)">
              未找到匹配的相册～
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                v-for="album in filteredAlbums" 
                :key="album.id"
                @click="openAlbum(album)"
                class="album-card-stack group relative cursor-pointer"
              >
                <!-- 底层堆叠装饰卡片 2 -->
                <div class="absolute inset-0 rounded-2xl bg-neutral-200/80 dark:bg-neutral-800/80 transform rotate-2 translate-y-2 scale-[0.96] opacity-70 transition-transform duration-500 group-hover:rotate-3 group-hover:scale-[0.98]"></div>
                <!-- 底层堆叠装饰卡片 1 -->
                <div class="absolute inset-0 rounded-2xl bg-neutral-300/80 dark:bg-neutral-700/80 transform -rotate-1 translate-y-1 scale-[0.98] opacity-85 transition-transform duration-500 group-hover:-rotate-2 group-hover:scale-[0.99]"></div>

                <!-- 主相册封面卡片 -->
                <div class="relative z-10 rounded-2xl overflow-hidden aspect-[16/10] border border-(--line-divider) shadow-md bg-neutral-900">
                  <!-- 封面图 -->
                  <img 
                    :src="album.cover || album.photos[0]?.url" 
                    :alt="album.name" 
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <!-- 右上角照片数量徽标 -->
                  <div class="absolute top-3.5 right-3.5 z-20 flex items-center gap-1 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 shadow-sm">
                    <span>{{ album.photos.length }} 张照片</span>
                  </div>

                  <!-- 底部信息渐变遮罩 -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 text-white z-20">
                    <h3 class="text-lg md:text-xl font-bold tracking-tight mb-1 group-hover:text-(--primary) transition-colors">
                      {{ album.name }}
                    </h3>
                    <p class="text-xs text-white/80 line-clamp-2 mb-3 leading-relaxed">
                      {{ album.description }}
                    </p>

                    <div class="flex items-center justify-between text-[11px] text-white/70 pt-2 border-t border-white/15">
                      <div class="flex items-center gap-3">
                        <span v-if="album.date">📅 {{ album.date }}</span>
                        <span v-if="album.location">📍 {{ album.location }}</span>
                      </div>
                      
                      <!-- 标签 -->
                      <div class="flex items-center gap-1">
                        <span 
                          v-for="t in album.tags.slice(0, 2)" 
                          :key="t" 
                          class="px-2 py-0.5 rounded bg-white/20 text-[10px] text-white font-medium"
                        >
                          {{ t }}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>

          <!-- ================= 视图 2：相册内页瀑布流 (点击相册进入) ================= -->
          <div v-else class="flex flex-col gap-6">
            
            <!-- 相册内页顶部 Banner 卡片 -->
            <div class="card-base p-6 md:p-8 relative overflow-hidden">
              <div class="flex items-center justify-between mb-4">
                <button 
                  @click="currentAlbum = null" 
                  class="px-3.5 py-1.5 rounded-xl bg-(--btn-regular-bg) hover:bg-(--primary) hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>← 返回相册列表</span>
                </button>

                <span class="text-xs text-(--text-dim)">
                  📷 共 {{ currentAlbum.photos.length }} 张照片
                </span>
              </div>

              <div class="flex items-center gap-2 mb-2">
                <span class="w-1.5 h-5 rounded-full bg-(--primary)"></span>
                <h2 class="text-2xl md:text-3xl font-bold text-(--text-bright)">{{ currentAlbum.name }}</h2>
              </div>
              <p class="text-xs md:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                {{ currentAlbum.description }}
              </p>

              <div class="flex flex-wrap items-center gap-4 text-xs text-(--text-dim) pt-3 border-t border-(--line-divider)">
                <span v-if="currentAlbum.date">📅 日期：{{ currentAlbum.date }}</span>
                <span v-if="currentAlbum.location">📍 地点：{{ currentAlbum.location }}</span>
              </div>
            </div>

            <!-- 照片瀑布流多列网格 (Masonry Layout) -->
            <div class="columns-1 sm:columns-2 md:columns-3 gap-5 space-y-5">
              <div 
                v-for="(photo, idx) in currentAlbum.photos" 
                :key="photo.id"
                @click="openLightbox(idx)"
                class="break-inside-avoid relative rounded-2xl overflow-hidden shadow-xs hover:shadow-xl border border-(--line-divider) bg-neutral-100 dark:bg-neutral-800 group cursor-pointer transition-all duration-300 hover:-translate-y-1"
              >
                <img 
                  :src="photo.url" 
                  :alt="photo.title || currentAlbum.name" 
                  loading="lazy"
                  class="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <!-- 悬浮说明暗色遮罩 -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                  <span class="text-sm font-bold">{{ photo.title || currentAlbum.name }}</span>
                  <span v-if="photo.desc" class="text-xs text-white/80 line-clamp-1 mt-0.5">{{ photo.desc }}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        <!-- 右侧完整小组件栏 (分段式：上部 3 卡片自然滚动，最后 3 卡片吸顶保留) -->
        <aside class="sidebar-widgets-column flex flex-col gap-6 w-full">
          <div class="flex flex-col gap-6">
            <ProfileWidget />
            <AnnouncementWidget />
            <MusicWidget />
          </div>

          <div class="flex flex-col gap-6 lg:sticky lg:top-6">
            <DynamicWidget />
            <SiteStatsWidget 
              :article-count="2" 
              :category-count="2"
              :tag-count="3"
              :total-words="16293" 
            />
            <SiteInfoWidget />
          </div>
        </aside>

      </div>
    </div>

    <!-- ================= 视图 3：沉浸式全屏灯箱 Lightbox (支持右键复制/下载/选中照片显著放大) ================= -->
    <div 
      v-if="lightboxVisible && currentAlbum" 
      class="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between select-none animate-fade-in"
      @keydown.esc="closeLightbox"
      @keydown.left="prevPhoto"
      @keydown.right="nextPhoto"
      tabindex="0"
    >
      <!-- 灯箱顶部控制工具栏 -->
      <div class="relative z-50 flex items-center justify-between px-6 py-4 text-white bg-gradient-to-b from-black/80 to-transparent">
        <!-- 左侧序号指示 -->
        <div class="flex items-center gap-3">
          <span class="text-sm font-mono font-bold bg-white/15 px-3 py-1 rounded-full border border-white/20">
            {{ activeIndex + 1 }} / {{ currentAlbum.photos.length }}
          </span>
          <span class="text-xs text-white/75 font-medium hidden sm:inline">
            {{ activePhoto?.title || currentAlbum.name }}
          </span>
        </div>

        <!-- 右侧操作工具按钮 (专业矢量 SVG 质感图标：放大/缩小/旋转/下载/关闭) -->
        <div class="flex items-center gap-2">
          <!-- 放大 -->
          <button 
            @click="zoomIn" 
            class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md text-white/90 hover:text-white flex items-center justify-center transition-all border border-white/15 shadow-sm active:scale-95 cursor-pointer" 
            title="放大 (+)"
          >
            <svg class="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7"/>
              <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" stroke-linecap="round"/>
            </svg>
          </button>

          <!-- 缩小 -->
          <button 
            @click="zoomOut" 
            class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md text-white/90 hover:text-white flex items-center justify-center transition-all border border-white/15 shadow-sm active:scale-95 cursor-pointer" 
            title="缩小 (-)"
          >
            <svg class="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7"/>
              <path d="M21 21l-4.35-4.35M8 11h6" stroke-linecap="round"/>
            </svg>
          </button>

          <!-- 顺时针旋转 -->
          <button 
            @click="rotate" 
            class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md text-white/90 hover:text-white flex items-center justify-center transition-all border border-white/15 shadow-sm active:scale-95 cursor-pointer" 
            title="旋转 (90°)"
          >
            <svg class="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.8 1.04 6.44 2.73L21 8" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 3v5h-5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <!-- 下载照片 -->
          <a 
            :href="activePhoto?.url" 
            :download="activePhoto?.title || 'photo'" 
            target="_blank"
            class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md text-white/90 hover:text-white flex items-center justify-center transition-all border border-white/15 shadow-sm active:scale-95 cursor-pointer"
            title="下载照片 (支持直接右键图片复制)"
          >
            <svg class="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>

          <!-- 关闭灯箱 -->
          <button 
            @click="closeLightbox" 
            class="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500/80 backdrop-blur-md text-white/90 hover:text-white flex items-center justify-center transition-all border border-white/15 shadow-sm active:scale-95 cursor-pointer" 
            title="关闭 (Esc)"
          >
            <svg class="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- 灯箱居中主体大图区 (允许鼠标右键自由复制或保存) -->
      <div 
        class="relative flex-1 flex items-center justify-center overflow-hidden p-4"
        @click.self="closeLightbox"
      >
        <!-- 左切换箭头 -->
        <button 
          @click.stop="prevPhoto" 
          class="absolute left-6 z-40 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center border border-white/15 transition-all hover:scale-110 shadow-lg cursor-pointer active:scale-95"
          title="上一张 (←)"
        >
          <svg class="w-6 h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <!-- 图像主体 (支持缩放与旋转，允许右键复制) -->
        <div class="max-w-[90vw] max-h-[72vh] flex items-center justify-center">
          <img 
            :src="activePhoto?.url" 
            :alt="activePhoto?.title || 'Photo'" 
            class="max-w-full max-h-[72vh] object-contain rounded-lg shadow-2xl transition-transform duration-300"
            :style="{ transform: `scale(${zoomLevel}) rotate(${rotationDeg}deg)` }"
            @contextmenu.stop
          />
        </div>

        <!-- 右切换箭头 -->
        <button 
          @click.stop="nextPhoto" 
          class="absolute right-6 z-40 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center border border-white/15 transition-all hover:scale-110 shadow-lg cursor-pointer active:scale-95"
          title="下一张 (→)"
        >
          <svg class="w-6 h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- 灯箱底部缩略图导航栏 (当前选中的照片视图更大更醒目 - 100% 对齐图 2 与要求) -->
      <div class="relative z-50 px-6 py-5 bg-gradient-to-t from-black/95 to-transparent flex items-center justify-center gap-3.5 overflow-x-auto">
        <div 
          v-for="(photo, idx) in currentAlbum.photos" 
          :key="photo.id"
          @click="activeIndex = idx; resetTransform()"
          class="flex-shrink-0 cursor-pointer transition-all duration-300 overflow-hidden"
          :class="activeIndex === idx 
            ? 'w-20 h-16 md:w-24 md:h-18 scale-120 z-20 border-3 border-(--primary) shadow-2xl rounded-xl ring-2 ring-white/60 -translate-y-1' 
            : 'w-14 h-11 md:w-16 md:h-12 border-2 border-white/25 opacity-60 hover:opacity-100 rounded-lg hover:scale-105'"
        >
          <img :src="photo.url" class="w-full h-full object-cover" />
        </div>
      </div>

    </div>

    <!-- 底部悬浮控制组件 -->
    <FloatingControls />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import FireflyBanner from '../components/FireflyBanner.vue'
import SakuraEffect from '../components/features/SakuraEffect.vue'
import FloatingControls from '../components/controls/FloatingControls.vue'
import ProfileWidget from '../components/widgets/ProfileWidget.vue'
import AnnouncementWidget from '../components/widgets/AnnouncementWidget.vue'
import MusicWidget from '../components/widgets/MusicWidget.vue'
import DynamicWidget from '../components/widgets/DynamicWidget.vue'
import SiteStatsWidget from '../components/widgets/SiteStatsWidget.vue'
import SiteInfoWidget from '../components/widgets/SiteInfoWidget.vue'
import { galleryAlbumConfig, type AlbumItem } from '../config/galleryConfig'

const albums = ref<AlbumItem[]>(galleryAlbumConfig)
const searchQuery = ref('')
const currentAlbum = ref<AlbumItem | null>(null)

// 灯箱状态
const lightboxVisible = ref(false)
const activeIndex = ref(0)
const zoomLevel = ref(1)
const rotationDeg = ref(0)

// 智能模糊搜索函数 (支持拼音、子串、字符跨越匹配，搜"崩"或"崩铁"均可命中"崩坏：星穹铁道")
const fuzzyMatch = (text: string, query: string): boolean => {
  if (!text || !query) return false
  const t = text.toLowerCase()
  const q = query.toLowerCase()
  
  // 1. 直接包含
  if (t.includes(q)) return true
  
  // 2. 字符跨越匹配 (如 "崩铁" 在 "崩坏：星穹铁道" 中按顺序出现)
  let qIdx = 0
  for (let i = 0; i < t.length && qIdx < q.length; i++) {
    if (t[i] === q[qIdx]) {
      qIdx++
    }
  }
  if (qIdx === q.length) return true
  
  // 3. 多关键词拆分匹配
  const chars = q.split('').filter(c => c.trim().length > 0)
  return chars.every(c => t.includes(c))
}

const filteredAlbums = computed(() => {
  const q = searchQuery.value.trim()
  if (!q) return albums.value

  return albums.value.filter(a => {
    const searchableText = `${a.name} ${a.description} ${a.location} ${(a.tags || []).join(' ')}`
    return fuzzyMatch(searchableText, q)
  })
})

const activePhoto = computed(() => {
  if (!currentAlbum.value || !currentAlbum.value.photos) return null
  return currentAlbum.value.photos[activeIndex.value]
})

const openAlbum = (album: AlbumItem) => {
  currentAlbum.value = album
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const openLightbox = (index: number) => {
  activeIndex.value = index
  resetTransform()
  lightboxVisible.value = true
}

const closeLightbox = () => {
  lightboxVisible.value = false
}

const prevPhoto = () => {
  if (!currentAlbum.value) return
  const total = currentAlbum.value.photos.length
  activeIndex.value = (activeIndex.value - 1 + total) % total
  resetTransform()
}

const nextPhoto = () => {
  if (!currentAlbum.value) return
  const total = currentAlbum.value.photos.length
  activeIndex.value = (activeIndex.value + 1) % total
  resetTransform()
}

const zoomIn = () => {
  zoomLevel.value = Math.min(3, zoomLevel.value + 0.25)
}

const zoomOut = () => {
  zoomLevel.value = Math.max(0.5, zoomLevel.value - 0.25)
}

const rotate = () => {
  rotationDeg.value = (rotationDeg.value + 90) % 360
}

const resetTransform = () => {
  zoomLevel.value = 1
  rotationDeg.value = 0
}

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<style scoped>
.album-card-stack {
  perspective: 1000px;
}
</style>
