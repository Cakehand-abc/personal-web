<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav :class="['navbar', { 'navbar-scrolled': isScrolled }]">
    <div class="nav-container">
      <div class="logo">
        <span class="logo-text">Aurora Space</span>
      </div>
      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/articles" class="nav-link">Article</router-link>
        <router-link to="/anime" class="nav-link">Anime</router-link>
        <router-link to="/project" class="nav-link">Project</router-link>
        <router-link to="/about" class="nav-link">About</router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  z-index: 1000;
  transition: all 0.4s ease;
  background: transparent;
}

.navbar-scrolled {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--glass-border);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  height: 60px;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(45deg, #fff, var(--aurora-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
}

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-link {
  color: var(--text-primary);
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  position: relative;
  padding: 8px 0;
  transition: color 0.3s ease;

  &:hover {
    color: var(--aurora-accent);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--aurora-accent);
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
}
</style>
