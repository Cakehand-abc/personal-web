<template>
  <span class="typewriter-container font-mono tracking-wide text-white/90">
    <span>{{ displayedText }}</span>
    <span class="cursor-blinker inline-block ml-1 font-bold text-(--primary)">|</span>
  </span>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    texts?: string[]
    speed?: number
    deleteSpeed?: number
    pauseTime?: number
  }>(),
  {
    texts: () => [
      '愿你历尽千帆，归来仍是少年。',
      '大切な人といつかまた巡り会えますように。',
      '无论何时何地，请记得仰望璀璨的星空。',
      'Life is a journey, not a destination.'
    ],
    speed: 120,
    deleteSpeed: 60,
    pauseTime: 2200
  }
)

const displayedText = ref('')
let currentTextIndex = 0
let charIndex = 0
let isDeleting = false
let timer: any = null

const typeStep = () => {
  const currentFullText = props.texts[currentTextIndex] || ''
  
  if (isDeleting) {
    charIndex--
    displayedText.value = currentFullText.substring(0, charIndex)
    if (charIndex <= 0) {
      isDeleting = false
      currentTextIndex = (currentTextIndex + 1) % props.texts.length
      timer = setTimeout(typeStep, props.speed)
    } else {
      timer = setTimeout(typeStep, props.deleteSpeed)
    }
  } else {
    charIndex++
    displayedText.value = currentFullText.substring(0, charIndex)
    if (charIndex >= currentFullText.length) {
      isDeleting = true
      timer = setTimeout(typeStep, props.pauseTime)
    } else {
      timer = setTimeout(typeStep, props.speed)
    }
  }
}

onMounted(() => {
  typeStep()
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<style scoped>
.cursor-blinker {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
