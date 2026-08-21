<template>
  <div class="about-page min-h-screen bg-(--page-bg)">
    <!-- 顶部全景壁纸 Banner + 落樱与水波纹 -->
    <FireflyBanner />
    <SakuraEffect />

    <!-- 主体栅格容器 (标准双栏大宽屏沉浸式布局，保留右侧各栏目) -->
    <div class="max-w-[1440px] mx-auto px-4 md:px-8 py-8 relative z-20">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-8 items-start">
        
        <!-- 左侧主内容流 (GitHub Profile README 风格展示) -->
        <div class="main-stream-column flex flex-col gap-6 min-w-0">

          <!-- 1. 博主关于我卡片 (GitHub README 风格) -->
          <div class="card-base p-6 md:p-10 shadow-sm border border-(--line-divider) bg-white dark:bg-[#1e1e24]">
            
            <!-- GitHub 顶部 README 标题栏 -->
            <div class="flex items-center justify-between pb-4 mb-6 border-b border-(--line-divider)">
              <div class="flex items-center gap-2.5">
                <svg class="w-5 h-5 fill-current text-neutral-700 dark:text-neutral-300" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span class="font-mono text-sm font-bold text-neutral-800 dark:text-neutral-200">{{ displayName }} / README.md</span>
              </div>
              
              <div class="flex items-center gap-2 text-xs text-(--text-dim)">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>Public Profile</span>
              </div>
            </div>

            <!-- Markdown 预览渲染区 -->
            <div class="firefly-markdown-render prose dark:prose-invert max-w-none">
              <MdPreview 
                :modelValue="readmeMarkdown" 
                :theme="themeStore.isDark ? 'dark' : 'light'" 
                previewTheme="default" 
              />
            </div>

            <!-- 底部社交按钮栏 -->
            <div class="mt-8 pt-6 border-t border-(--line-divider) flex flex-wrap items-center justify-between gap-4">
              <span class="text-xs text-(--text-dim)">
                愿每一段代码都能如夏夜流萤般照亮前行的路 ✨
              </span>

              <a 
                href="https://github.com/Cakehand-abc" 
                target="_blank" 
                class="px-4 py-2 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>⭐ Follow on GitHub</span>
              </a>
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

    <!-- 底部悬浮控制组件 -->
    <FloatingControls />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import FireflyBanner from '../components/FireflyBanner.vue'
import SakuraEffect from '../components/features/SakuraEffect.vue'
import FloatingControls from '../components/controls/FloatingControls.vue'
import ProfileWidget from '../components/widgets/ProfileWidget.vue'
import AnnouncementWidget from '../components/widgets/AnnouncementWidget.vue'
import MusicWidget from '../components/widgets/MusicWidget.vue'
import DynamicWidget from '../components/widgets/DynamicWidget.vue'
import SiteStatsWidget from '../components/widgets/SiteStatsWidget.vue'
import SiteInfoWidget from '../components/widgets/SiteInfoWidget.vue'
import { useThemeStore } from '../store/theme'
import { useSettingStore } from '../store/setting'
import { profileConfig, siteConfig } from '../config'

const themeStore = useThemeStore()
const settingStore = useSettingStore()

const displayName = computed(() => {
  return settingStore.siteName || profileConfig.name || siteConfig.title || 'Cakehand-abc'
})

// GitHub Profile README 风格的 Markdown 模板
const readmeMarkdown = ref(`
# Hi there, I'm Cakehand-abc 👋

> 🚀 全栈开发爱好者 / 开源项目创作者 / Firefly 流萤美学追寻者
> 
> *“飞萤之火自无梦的长夜亮起，绽放在终竞的明天。”*

---

### 🌟 About Me

- 💻 热衷于构建现代化、高性能且充满灵动画面的 Web 应用。
- 🌱 核心技术栈聚焦于 **Vue 3**、**TypeScript**、**Spring Boot** 与 **云原生工程化**。
- 🎯 目前正在持续迭代个人知识库与开源项目生态。
- 💬 欢迎在留言板或 GitHub 与我交流任何技术点滴与创意！

---

### 🛠️ Tech Stack & Skills

#### Languages & Frameworks
\`\`\`
Frontend : Vue 3 / TypeScript / Tailwind CSS / Vite / Pinia / Astro
Backend  : Java 17+ / Spring Boot 3 / MyBatis-Plus / Spring Security / JWT
Database : MySQL 8.0 / Redis
DevOps   : Nginx / Docker / Git / Linux
\`\`\`

---

### 🚀 Featured Projects

- 📚 **Firefly Personal Blog** — 基于 Vue 3 + Spring Boot 的沉浸式流萤主题博客与知识空间。
- 📍 **XuexitongSign (学习通位置签到)** — 支持学习通位置签到与自动化验证的实用开源工具。
- 🎨 **Light & Shadow Gallery** — 瀑布流自适应光影画廊与沉浸式全屏灯箱系统。

---

### 📬 Connect with Me

- 🐱 **GitHub**: [@Cakehand-abc](https://github.com/Cakehand-abc)
- 📺 **Bilibili**: [哔哩哔哩个人空间](https://space.bilibili.com)
- ✉️ **Email**: [发送邮件交流](mailto:your-email@example.com)

---
*⭐️ Thanks for visiting my profile!*
`)

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>
