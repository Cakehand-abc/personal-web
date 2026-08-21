<template>
  <div id="header-waves" ref="wavesContainer" class="waves-wrapper relative w-full h-[60px] md:h-[85px] overflow-hidden -mb-[1px]">
    <canvas ref="wavesCanvas" class="absolute inset-0 w-full h-full pointer-events-none block"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { WavesRenderer } from '../../utils/waves-draw'
import { useThemeStore } from '../../store/theme'

const themeStore = useThemeStore()
const wavesContainer = ref<HTMLDivElement | null>(null)
const wavesCanvas = ref<HTMLCanvasElement | null>(null)

let renderer: WavesRenderer | null = null
let animationId: number | null = null
let startTime = 0
let resizeObserver: ResizeObserver | null = null

const readPageBg = (): string => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--page-bg')
    .trim() || (themeStore.isDark ? '#1a1a20' : '#f8f9fa')
}

const initWaves = () => {
  if (!wavesCanvas.value || !wavesContainer.value) return

  const canvas = wavesCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const rect = wavesContainer.value.getBoundingClientRect()
  const width = rect.width || window.innerWidth
  const height = rect.height || 70
  const dpr = window.devicePixelRatio || 1

  canvas.width = Math.max(1, Math.ceil(width * dpr))
  canvas.height = Math.max(1, Math.ceil(height * dpr))

  renderer = new WavesRenderer(ctx, width, height, dpr, readPageBg())
  startTime = performance.now()

  const animate = () => {
    if (!renderer) return
    renderer.draw(performance.now(), startTime)
    animationId = requestAnimationFrame(animate)
  }

  cancelAnimation()
  animationId = requestAnimationFrame(animate)
}

const cancelAnimation = () => {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

const handleResize = () => {
  if (!wavesCanvas.value || !wavesContainer.value || !renderer) return
  const rect = wavesContainer.value.getBoundingClientRect()
  const width = rect.width || window.innerWidth
  const height = rect.height || 70
  const dpr = window.devicePixelRatio || 1

  wavesCanvas.value.width = Math.max(1, Math.ceil(width * dpr))
  wavesCanvas.value.height = Math.max(1, Math.ceil(height * dpr))
  renderer.setSize(width, height, dpr)
}

// 监听主题色与暗色模式切换以同步水波纹底色
watch([() => themeStore.isDark, () => themeStore.hue], () => {
  setTimeout(() => {
    if (renderer) {
      renderer.setFillColor(readPageBg())
    }
  }, 50)
})

onMounted(() => {
  initWaves()

  if (wavesContainer.value) {
    resizeObserver = new ResizeObserver(() => {
      handleResize()
    })
    resizeObserver.observe(wavesContainer.value)
  }

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  cancelAnimation()
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  window.removeEventListener('resize', handleResize)
  renderer = null
})
</script>

<style scoped>
.waves-wrapper {
  isolation: isolate;
  contain: layout style;
  transform: translateZ(0);
}
</style>
