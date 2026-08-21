<template>
  <!-- 原版 Firefly 极简返回顶部悬浮按钮 (无冗余设置项与多余图标) -->
  <Transition name="fade-scale">
    <div 
      v-if="showBackToTop" 
      class="fixed bottom-6 right-6 z-40 flex flex-col items-center select-none"
    >
      <button 
        @click="scrollToTop"
        class="card-base w-11 h-11 rounded-2xl flex items-center justify-center text-(--primary) hover:text-(--primary-hover) shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border border-(--line-divider)"
        title="返回顶部"
        aria-label="Back to Top"
      >
        <!-- 经典原版向上箭头图标 -->
        <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const showBackToTop = ref(false)

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 200
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.6) translateY(10px);
}
</style>
