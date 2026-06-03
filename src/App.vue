<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'

const showIntro = ref(true)
const showLogo = ref(false)
const fadeOut = ref(false)

onMounted(() => {
  // 禁止整个页面的滚动，强制看完动画
  document.body.style.overflow = 'hidden'
  document.body.classList.add('theme-light') // 确保应用浅色主题

  setTimeout(() => {
    showLogo.value = true
  }, 500)

  setTimeout(() => {
    fadeOut.value = true
    
    // 淡出完成后，彻底移除遮罩并恢复滚动
    setTimeout(() => {
      document.body.style.overflow = ''
      showIntro.value = false
    }, 1500)
  }, 3000)
})
</script>

<template>
  <!-- 独立的开场动画遮罩层，覆盖在整个应用之上，不可被滑动绕过 -->
  <div v-if="showIntro" class="intro-overlay" :class="{ 'fade-out': fadeOut }" @wheel.prevent @touchmove.prevent>
    <div class="logo-wrapper" :class="{ 'fade-in': showLogo }">
      <h1 class="anime-logo-text text-4xl md:text-6xl font-bold tracking-wider">Welcome To My Blog</h1>
    </div>
  </div>

  <NavBar />
  <main class="main-content">
    <RouterView />
  </main>
</template>

<style scoped lang="scss">
.main-content {
  flex: 1;
  padding-top: 80px;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

.intro-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #ffffff; /* 纯白背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999;
  transition: opacity 1.5s ease-in-out;
}

.fade-out {
  opacity: 0;
  pointer-events: none;
}

.logo-wrapper {
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 2s ease, transform 3s ease-out;
}

.logo-wrapper.fade-in {
  opacity: 1;
  transform: scale(1);
}

.anime-logo-text {
  color: #e94560; /* 温馨的二次元主题粉红色 */
  font-family: 'Inter', sans-serif;
  text-shadow: 0 4px 12px rgba(233, 69, 96, 0.3);
  background: linear-gradient(130deg, #e94560, #ff8787);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
