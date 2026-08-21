<template>
  <div class="card-base p-5 relative overflow-hidden">
    <!-- 标题 (带左侧绿色竖条指示器) -->
    <div class="flex items-center gap-2 mb-3.5">
      <span class="w-1.5 h-4.5 rounded-full bg-(--primary)"></span>
      <h4 class="font-bold text-base text-(--text-bright)">音乐</h4>
    </div>

    <!-- 音乐播放器主体 -->
    <div class="flex items-center gap-3.5">
      <!-- 旋转黑胶唱片封面 -->
      <div 
        class="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/60 dark:border-white/20 shadow-md relative group cursor-pointer"
        :class="{ 'animate-spin-slow': isPlaying }"
        @click="togglePlay"
      >
        <img 
          :src="currentTrack.cover" 
          :alt="currentTrack.title" 
          class="w-full h-full object-cover"
        />
        <!-- 唱片中心圆孔 -->
        <div class="absolute inset-0 m-auto w-3 h-3 rounded-full bg-white dark:bg-zinc-800 border border-black/20"></div>
      </div>

      <!-- 歌曲信息与播放进度 -->
      <div class="flex-1 min-w-0">
        <h5 class="text-sm font-bold text-(--text-bright) truncate">{{ currentTrack.title }}</h5>
        <p class="text-[11px] text-(--text-dim) truncate mt-0.5">{{ currentTrack.artist }}</p>
        
        <!-- 简易进度条 -->
        <div class="w-full bg-(--btn-regular-bg) h-1.5 rounded-full mt-2 overflow-hidden cursor-pointer" @click="handleProgressClick">
          <div class="bg-(--primary) h-full rounded-full transition-all duration-300" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- 控制按钮排 (采用原版 Material Symbols 图标) -->
    <div class="flex items-center justify-between mt-4 pt-2 border-t border-(--line-divider) text-(--text-dim)">
      <!-- 循环模式 -->
      <button @click="toggleLoop" class="hover:text-(--primary) transition-colors p-1" title="循环播放">
        <svg class="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
          <path d="M7 7h10v3l4-4l-4-4v3H5v6h2V7zm10 10H7v-3l-4 4l4 4v-3h12v-6h-2v4z"/>
        </svg>
      </button>

      <!-- 核心播放控制 (上一首, 播放/暂停, 下一首) -->
      <div class="flex items-center gap-3">
        <button @click="prevTrack" class="hover:text-(--primary) transition-colors p-1" title="上一首">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </button>

        <button 
          @click="togglePlay" 
          class="w-8 h-8 rounded-full bg-(--primary) text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
          :title="isPlaying ? '暂停' : '播放'"
        >
          <svg v-if="!isPlaying" class="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <svg v-else class="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        </button>

        <button @click="nextTrack" class="hover:text-(--primary) transition-colors p-1" title="下一首">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>
      </div>

      <!-- 音量/静音 -->
      <button @click="toggleMute" class="hover:text-(--primary) transition-colors p-1" :title="isMuted ? '取消静音' : '静音'">
        <svg v-if="!isMuted" class="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
        <svg v-else class="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27l4.73 4.73H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
        </svg>
      </button>
    </div>

    <!-- 隐藏的 HTML5 Audio 元素 -->
    <audio 
      ref="audioRef" 
      :src="currentTrack.url" 
      @timeupdate="onTimeUpdate"
      @ended="onTrackEnded"
    ></audio>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tracks = [
  {
    title: '使一颗心免于哀伤',
    artist: '知更鸟 / HOYO-Mix / Chevy',
    cover: '/assets/images/DesktopWallpaper/d1.avif',
    url: 'https://music.163.com/song/media/outer/url?id=2156020524.mp3'
  },
  {
    title: '在银河中孤独摇摆',
    artist: '知更鸟 / HOYO-Mix',
    cover: '/assets/images/DesktopWallpaper/d5.avif',
    url: 'https://music.163.com/song/media/outer/url?id=2156020525.mp3'
  }
]

const currentTrackIndex = ref(0)
const currentTrack = ref(tracks[0])
const isPlaying = ref(false)
const isMuted = ref(false)
const progressPercent = ref(25)
const audioRef = ref<HTMLAudioElement | null>(null)

const togglePlay = () => {
  if (!audioRef.value) return
  if (isPlaying.value) {
    audioRef.value.pause()
    isPlaying.value = false
  } else {
    audioRef.value.play().then(() => {
      isPlaying.value = true
    }).catch(() => {
      isPlaying.value = !isPlaying.value
    })
  }
}

const toggleMute = () => {
  if (!audioRef.value) return
  isMuted.value = !isMuted.value
  audioRef.value.muted = isMuted.value
}

const toggleLoop = () => {
  if (!audioRef.value) return
  audioRef.value.loop = !audioRef.value.loop
}

const prevTrack = () => {
  currentTrackIndex.value = (currentTrackIndex.value - 1 + tracks.length) % tracks.length
  currentTrack.value = tracks[currentTrackIndex.value]
  if (isPlaying.value) {
    setTimeout(() => audioRef.value?.play(), 100)
  }
}

const nextTrack = () => {
  currentTrackIndex.value = (currentTrackIndex.value + 1) % tracks.length
  currentTrack.value = tracks[currentTrackIndex.value]
  if (isPlaying.value) {
    setTimeout(() => audioRef.value?.play(), 100)
  }
}

const onTimeUpdate = () => {
  if (!audioRef.value || !audioRef.value.duration) return
  progressPercent.value = (audioRef.value.currentTime / audioRef.value.duration) * 100
}

const handleProgressClick = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const width = rect.width
  const percent = Math.min(Math.max(clickX / width, 0), 1)
  progressPercent.value = percent * 100
  if (audioRef.value && audioRef.value.duration) {
    audioRef.value.currentTime = percent * audioRef.value.duration
  }
}

const onTrackEnded = () => {
  nextTrack()
}
</script>

<style scoped>
@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spinSlow 12s linear infinite;
}
</style>
