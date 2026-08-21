<template>
  <div class="card-base p-5">
    <!-- 标题 (带左侧绿色竖条指示器) -->
    <div class="flex items-center gap-2 mb-3.5">
      <span class="w-1.5 h-4.5 rounded-full bg-(--primary)"></span>
      <h4 class="font-bold text-base text-(--text-bright)">站点信息</h4>
    </div>

    <!-- 站点信息列表 (原版 Material Symbols SVG 图标) -->
    <div class="flex flex-col gap-2 text-xs">
      
      <!-- 构建平台 (material-symbols:cloud-outline) -->
      <div class="flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/50">
        <div class="flex items-center gap-2.5">
          <div class="text-(--primary) text-lg flex items-center">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M6.5 20q-2.275 0-3.887-1.575T1 14.575q0-1.95 1.175-3.475T5.25 9.15q.625-2.3 2.5-3.725T12 4q2.925 0 4.963 2.038T19 11q1.725.2 2.863 1.488T23 15.5q0 1.875-1.312 3.188T18.5 20zm0-2h12q1.05 0 1.775-.725T21 15.5t-.725-1.775T18.5 13H17v-2q0-2.075-1.463-3.538T12 6T8.463 7.463T7 11h-.5q-1.45 0-2.475 1.025T3 14.5t1.025 2.475T6.5 18m5.5-6"/>
            </svg>
          </div>
          <span class="font-medium text-neutral-700 dark:text-neutral-300">构建平台</span>
        </div>
        <span class="text-xs font-bold text-neutral-900 dark:text-neutral-100">EdgeOne Pages</span>
      </div>

      <!-- 博客版本 (mdi:clover 🍀) -->
      <div class="flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/50">
        <div class="flex items-center gap-2.5">
          <div class="text-(--primary) text-lg flex items-center">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 11.18c3.3-3 5-4.54 5-6.49C17 3.19 15.75 2 14.25 2c-.86 0-1.68.36-2.25 1c-.57-.64-1.39-1-2.31-1C8.19 2 7 3.25 7 4.75c0 1.89 1.7 3.43 5 6.43m-.82.82c-3-3.3-4.54-5-6.49-5C3.19 7 2 8.25 2 9.75c0 .86.36 1.68 1 2.25c-.64.57-1 1.39-1 2.31C2 15.81 3.25 17 4.75 17c1.89 0 3.43-1.7 6.43-5m1.65 0c2.99 3.3 4.53 5 6.48 5c1.5 0 2.69-1.25 2.69-2.75c0-.86-.36-1.68-1-2.25c.64-.57 1-1.39 1-2.31C22 8.19 20.75 7 19.25 7c-1.89 0-3.43 1.7-6.42 5m-.83.82c-3.3 3-5 4.54-5 6.49C7 20.81 8.25 22 9.75 22c.86 0 1.68-.36 2.25-1c.57.64 1.39 1 2.31 1c1.5 0 2.69-1.25 2.69-2.75c0-1.89-1.7-3.43-5-6.43"/>
            </svg>
          </div>
          <span class="font-medium text-neutral-700 dark:text-neutral-300">博客版本</span>
        </div>
        <a 
          href="https://github.com/CuteLeaf/Firefly" 
          target="_blank" 
          rel="noopener noreferrer"
          class="text-xs font-bold text-neutral-900 dark:text-neutral-100 hover:text-(--primary) transition-colors"
        >
          Firefly v6.16.2
        </a>
      </div>

      <!-- 文章许可 (material-symbols:copyright-outline) -->
      <div class="flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/50">
        <div class="flex items-center gap-2.5">
          <div class="text-(--primary) text-lg flex items-center">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M10 16h4q.425 0 .713-.288T15 15v-2h-2v1h-2v-4h2v1h2V9q0-.425-.288-.712T14 8h-4q-.425 0-.712.288T9 9v6q0 .425.288.713T10 16m2 6q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"/>
            </svg>
          </div>
          <span class="font-medium text-neutral-700 dark:text-neutral-300">文章许可</span>
        </div>
        <a 
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/" 
          target="_blank" 
          rel="noopener"
          class="font-bold text-(--primary) hover:underline text-xs"
        >
          CC BY-NC-SA 4.0
        </a>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
</script>
