<template>
  <aside class="w-[190px] h-screen fixed left-0 top-0 bg-[#FDFBF7] flex flex-col items-center py-10 z-50 overflow-y-auto custom-scrollbar border-r border-[#EFEBE0]">
    
    <!-- 顶部 Logo 区域 (引入 public 下的 SVG) -->
    <div class="mb-12 w-full flex justify-center cursor-pointer" @click="goHome">
      <!-- 放大了 Logo，将其宽度从 120px 增加到 160px -->
      <img src="/gemini-svg.svg?v=15" alt="Blog Logo" class="w-[160px] object-contain" />
    </div>

    <!-- 导航菜单 -->
    <nav class="flex-1 w-full px-6">
      <ul class="flex flex-col space-y-6">
        <li 
          v-for="nav in navList" 
          :key="nav.path" 
          class="l-nav__item"
          :class="{ 'is-active': route.path === nav.path }"
        >
          <router-link :to="nav.path" class="l-nav__link">
            <span class="l-nav__active">
              <span class="nav-text font-serif tracking-widest text-[16px] font-bold">{{ nav.name }}</span>
            </span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 暂时写死几个导航，后续可以从后端拉取分类来填充
const navList = [
  { name: 'Home', path: '/' },
  { name: 'Articles', path: '/articles' },
  { name: 'About', path: '/about' }
]

// 返回首页逻辑，如果在首页则回到顶部
const goHome = () => {
  if (route.path === '/') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
/* 侧边栏基础样式 */
aside {
  font-family: 'Shippori Mincho', 'Noto Serif SC', serif; /* 动漫常用的古典衬线字体 */
}

/* 导航基础布局 */
.l-nav__item {
  position: relative;
  list-style: none;
  cursor: pointer;
}

.l-nav__link {
  text-decoration: none;
  color: #181818 !important; /* 未悬浮时，字体默认是纯黑色的 */
  display: inline-block;
  opacity: 1 !important;
  filter: none !important;
}

.l-nav__active {
  position: relative;
  display: inline-block;
  padding-left: 28px; /* 为左侧的翅膀图标留出固定占位 */
}

.nav-text {
  position: relative;
  display: inline-block;
  padding-bottom: 6px; /* 为下方的虚线留出空间 */
  transition: color 0.3s ease, background 0.3s ease;
  opacity: 1 !important;
}

/* 激活状态：文字固定为金色，悬浮时不会有任何变化 */
.l-nav__item.is-active .nav-text {
  background: linear-gradient(90deg, #DDB95B, #B89030) !important;
  -webkit-background-clip: text !important;
  color: transparent !important;
}

/* 非激活状态，且悬浮时：仅文字变为金色 */
.l-nav__item:not(.is-active):hover .nav-text {
  background: linear-gradient(90deg, #DDB95B, #B89030) !important;
  -webkit-background-clip: text !important;
  color: transparent !important;
}

/* 核心动画实现：小翅膀淡入淡出 (挂在父级 span 上) */
.l-nav__active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 18px;
  height: 18px;
  background: url('/icon-wing.svg') no-repeat center / contain;
  
  /* 初始状态机（非激活时）：透明且向左偏。立刻执行，不等待 */
  opacity: 0 !important;
  transform: translateY(-50%) translateX(-10px);
  transition: opacity 0.2s ease, transform 0.2s ease;
  pointer-events: none; /* 防止鼠标事件干扰 */
}

/* 触发状态（仅激活时显现小翅膀） */
.l-nav__item.is-active .l-nav__active::before {
  opacity: 1 !important;
  transform: translateY(-50%) translateX(0) !important;
  /* 激活时，延迟 0.15s 执行淡入，等待上一个标签的翅膀消失 */
  transition: opacity 0.4s ease 0.15s, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s !important;
}

/* 确保非激活状态下悬浮时，翅膀绝对透明 */
.l-nav__item:not(.is-active):hover .l-nav__active::before {
  opacity: 0 !important;
}

/* 激活状态：文字下方出现与文字等宽的连续虚线点点 */
.nav-text::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  /* 使用 base64 SVG 绘制 100% 完美的无锯齿纯圆点 */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='4'%3E%3Ccircle cx='4' cy='2' r='1.8' fill='%23B89030'/%3E%3C/svg%3E");
  background-size: 8px 4px; /* 每个波点的间距 */
  background-position: center bottom;
  background-repeat: repeat-x;
  
  opacity: 0;
  transform: translateY(5px);
  transition: all 0.3s ease;
}

.l-nav__item.is-active .nav-text::after {
  opacity: 1;
  transform: translateY(0);
}

/* 自定义滚动条 */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(140, 125, 92, 0.2);
  border-radius: 4px;
}
</style>
