<script setup lang="ts">
import ArticleCard from '../components/ArticleCard.vue'
import FeatureSection from '../components/FeatureSection.vue'

const dummyArticles = Array.from({ length: 12 }).map((_, index) => ({
  id: index,
  title: `探索二次元与前沿技术的边界 - 篇章 ${index + 1}`,
  date: `2026-06-0${index % 9 + 1}`,
  summary: '在这个光怪陆离的数字世界里，我们不仅是代码的编织者，更是梦境的创造者。本文将带你深入了解如何使用 Vue 3 和现代 CSS 构建极具视觉冲击力的应用界面。',
  coverUrl: `https://picsum.photos/seed/${index + 100}/800/600`,
  categoryName: '前端技术',
  tags: [{ id: 1, tagName: 'Vue3' }, { id: 2, tagName: 'CSS' }]
}))
</script>

<template>
  <div class="block">
    <FeatureSection />
    <div class="main-grid mt-8">
      <div class="flex flex-col relative">
        <ul class="tab">
          <li class="active">
            <span class="first-tab">全部</span>
          </li>
          <li>
            <span>前端技术</span><b>12</b>
          </li>
          <li>
            <span>二次元随笔</span><b>8</b>
          </li>
          <li>
            <span>日常</span><b>5</b>
          </li>
        </ul>
        
        <ul class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <li v-for="article in dummyArticles" :key="article.id">
            <ArticleCard :data="article" />
          </li>
        </ul>
      </div>
      
      <div>
        <div class="sidebar flex flex-col gap-8">
          <div class="bg-ob-deep-800 p-6 rounded-2xl shadow-md text-center sidebar-widget" v-scroll-reveal>
            <img src="https://picsum.photos/seed/avatar/150/150" alt="Avatar" class="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg" />
            <h3 class="text-xl font-bold text-ob-bright">您的名字</h3>
            <p class="text-ob-dim mt-2 text-sm">在这里记录技术与生活的点滴。</p>
            <div class="mt-6 flex justify-center gap-4">
              <div class="text-center"><div class="font-bold text-ob-bright">文章</div><div class="text-sm text-ob-dim">42</div></div>
              <div class="text-center"><div class="font-bold text-ob-bright">分类</div><div class="text-sm text-ob-dim">8</div></div>
              <div class="text-center"><div class="font-bold text-ob-bright">标签</div><div class="text-sm text-ob-dim">24</div></div>
            </div>
          </div>

          <div class="bg-ob-deep-800 p-6 rounded-2xl shadow-md sidebar-widget" v-scroll-reveal>
            <h3 class="text-lg font-bold mb-4 flex items-center gap-2 text-ob-bright">
              <span>📢 公告</span>
            </h3>
            <p class="text-sm text-ob-dim leading-relaxed">
              欢迎来到我的温馨空间！目前前端样式正在按照邻家天使官网的风格进行二次元化重构中...
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.block {
  margin: 0 auto;
  max-width: var(--max-width);
  padding: 0 1rem;
}

.main-grid {
  display: flex;
  flex-direction: column;
}

@media (min-width: 1024px) {
  .main-grid {
    display: grid;
    gap: var(--gap);
    grid-template-columns: minmax(0, 1fr) 320px;
  }
}

.tab {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background: var(--background-secondary);
  padding-left: 1.5rem;
  padding-right: 3rem;
  margin-bottom: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  height: auto;

  li {
    cursor: pointer;
    margin: 1rem 0.75rem 1rem 0;
    transition: opacity 0.3s;
    display: flex;

    &:hover {
      opacity: 0.5;
    }

    &.active {
      color: white;
      span {
        background: var(--text-accent);
      }
      b {
        background: var(--text-accent);
        opacity: 0.8;
      }
    }

    span {
      white-space: nowrap;
      background: var(--background-primary);
      color: var(--text-normal);
      text-align: center;
      padding: 0.5rem 1rem;
      border-top-left-radius: 0.375rem;
      border-bottom-left-radius: 0.375rem;
      font-size: 0.875rem;

      &.first-tab {
        border-radius: 0.375rem;
        padding-left: 1.5rem;
        padding-right: 1.5rem;
      }
    }

    b {
      white-space: nowrap;
      background: var(--background-primary);
      color: var(--text-normal);
      opacity: 0.7;
      text-align: center;
      padding: 0.5rem 1rem;
      border-top-right-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
      font-size: 0.875rem;
    }
  }
}

.bg-ob-deep-800 {
  background: var(--background-secondary);
}
.text-ob-bright {
  color: var(--text-bright);
}
.text-ob-dim {
  color: var(--text-dim);
}
</style>
