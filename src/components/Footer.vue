<template>
  <footer class="w-full bg-[#FDFBF7] pt-12 pb-8 border-t border-[#EFEBE0] mt-16 text-[#5F5F5F] text-sm">
    <div class="max-w-6xl mx-auto px-6">
      
      <!-- Top Section -->
      <div class="flex flex-wrap items-center gap-6 mb-12">
        <span class="font-bold text-lg text-[#181818]">关注我们</span>
        <div class="flex gap-6 text-xl text-[#888]">
          <!-- 使用文字代替具体 Icon，因为需要纯净和快速构建 -->
          <span class="cursor-pointer hover:text-[#181818] transition-colors font-bold">WeChat</span>
          <span class="cursor-pointer hover:text-[#181818] transition-colors font-bold">Weibo</span>
          <span class="cursor-pointer hover:text-[#181818] transition-colors font-bold">X</span>
          <span class="cursor-pointer hover:text-[#181818] transition-colors font-bold">LinkedIn</span>
        </div>
      </div>

      <!-- Links Section -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        <div>
          <h3 class="font-bold text-[#181818] mb-4">加入我们</h3>
          <ul class="space-y-3">
            <li class="cursor-pointer hover:text-[#181818] transition-colors">社会招聘</li>
            <li class="cursor-pointer hover:text-[#181818] transition-colors">校园招聘</li>
            <li class="cursor-pointer hover:text-[#181818] transition-colors">国际招聘</li>
          </ul>
        </div>
        <div>
          <h3 class="font-bold text-[#181818] mb-4">联系我们</h3>
          <ul class="space-y-3">
            <li class="cursor-pointer hover:text-[#181818] transition-colors">客户服务</li>
            <li class="cursor-pointer hover:text-[#181818] transition-colors">合作洽谈</li>
            <li class="cursor-pointer hover:text-[#181818] transition-colors">博客采购</li>
            <li class="cursor-pointer hover:text-[#181818] transition-colors">媒体及投资者</li>
          </ul>
        </div>
        <div>
          <h3 class="font-bold text-[#181818] mb-4">法律信息</h3>
          <ul class="space-y-3">
            <li class="cursor-pointer hover:text-[#181818] transition-colors">服务协议</li>
            <li class="cursor-pointer hover:text-[#181818] transition-colors">隐私政策</li>
          </ul>
        </div>
        <div class="flex items-center justify-center md:justify-end">
          <span class="text-3xl font-bold tracking-wider text-[#181818] italic">MyBlog 博客</span>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="text-xs space-y-2 text-[#999999] flex flex-col items-start gap-4 border-t border-[#EFEBE0] pt-6">
        <div class="space-x-4 flex flex-wrap gap-y-2">
          <a href="#" class="hover:text-[#5F5F5F] transition-colors">法律声明</a>
          <a href="#" class="hover:text-[#5F5F5F] transition-colors">阳光准则</a>
          <a href="#" class="hover:text-[#5F5F5F] transition-colors">网站地图</a>
          <a href="#" class="hover:text-[#5F5F5F] transition-colors">粤网文[2026]2882-203号</a>
          <a href="#" class="hover:text-[#5F5F5F] transition-colors">粤B2-20090059-1</a>
        </div>
        <div>
          Copyright © 1998 - 2026 MyBlog. All Rights Reserved. 博客公司 版权所有
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
// 纯展示组件，无需逻辑
</script>

<style scoped>
/* 继承古典字体风格 */
footer {
  font-family: 'Shippori Mincho', 'Noto Serif SC', serif;
}
</style>
