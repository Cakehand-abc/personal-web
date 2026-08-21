<template>
  <canvas 
    v-if="themeStore.sakuraEnabled" 
    ref="sakuraCanvas" 
    class="fixed inset-0 pointer-events-none z-10 w-full h-full"
    style="transform: translateZ(0);"
  ></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useThemeStore } from '../../store/theme'

const themeStore = useThemeStore()
const sakuraCanvas = ref<HTMLCanvasElement | null>(null)

interface SakuraItem {
  x: number
  y: number
  s: number
  r: number
  fnx: number
  fny: number
  fnr: number
  a: number
}

let animationId: number | null = null
let sakuraList: SakuraItem[] = []
let sakuraImg: HTMLImageElement | null = null
const SAKURA_NUM = 24

const createSakura = (width: number, height: number): SakuraItem => {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    s: 0.4 + Math.random() * 0.6,
    r: Math.random() * 6,
    fnx: -0.5 + Math.random() * 1.5,
    fny: 1.0 + Math.random() * 1.8,
    fnr: 0.01 + Math.random() * 0.02,
    a: 0.3 + Math.random() * 0.6
  }
}

const initSakura = () => {
  if (!themeStore.sakuraEnabled) return
  
  const img = new Image()
  img.src = '/assets/images/effects/sakura.png'
  
  img.onload = () => {
    sakuraImg = img
    if (!sakuraCanvas.value) return
    const canvas = sakuraCanvas.value
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    sakuraList = []
    for (let i = 0; i < SAKURA_NUM; i++) {
      sakuraList.push(createSakura(canvas.width, canvas.height))
    }
    
    startAnimation()
  }
}

const startAnimation = () => {
  const canvas = sakuraCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const animate = () => {
    if (!canvas || !themeStore.sakuraEnabled || !sakuraImg) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const img = sakuraImg
    for (let i = 0; i < sakuraList.length; i++) {
      const item = sakuraList[i]
      item.x += item.fnx
      item.y += item.fny
      item.r += item.fnr

      if (item.x > canvas.width || item.x < -40 || item.y > canvas.height) {
        if (Math.random() > 0.4) {
          item.x = Math.random() * canvas.width
          item.y = -30
        } else {
          item.x = canvas.width + 20
          item.y = Math.random() * canvas.height
        }
      }

      ctx.save()
      ctx.translate(item.x, item.y)
      ctx.rotate(item.r)
      ctx.globalAlpha = item.a
      ctx.drawImage(img, 0, 0, 40 * item.s, 40 * item.s)
      ctx.restore()
    }

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
  if (!sakuraCanvas.value) return
  sakuraCanvas.value.width = window.innerWidth
  sakuraCanvas.value.height = window.innerHeight
}

watch(() => themeStore.sakuraEnabled, (enabled) => {
  if (enabled) {
    setTimeout(initSakura, 50)
  } else {
    cancelAnimation()
  }
})

onMounted(() => {
  initSakura()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  cancelAnimation()
  window.removeEventListener('resize', handleResize)
})
</script>
