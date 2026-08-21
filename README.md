# 个人博客前端系统 (Personal Web - Firefly Style)

基于 Vue 3 + TypeScript + Tailwind CSS 构建的现代化二次元清新风格个人博客系统。

## 🌟 特色功能

- **Firefly（流萤）清新视觉系统**：采用 OKLCH 色彩空间与 360° 色相（Hue）无级动态调节系统，支持亮色/暗色双模式。
- **沉浸式顶部横幅与动态水波纹**：内置高清壁纸切换、动态打字机副标题、4 层差速 Canvas 2D 水波纹过渡动效与落樱粒子。
- **双栏响应式布局与小组件**：左侧文章流/精选/随笔/画廊/作品集/留言板，右侧博主个人资料卡、公告栏、分类、标签云、建站运行统计小组件。
- **文章详情阅读沉浸式排版**：大图封面、Markdown 渲染、自动提取目录（TOC）滚动高亮与平滑跳转、CC-BY-NC-SA 4.0 版权声明卡片。
- **保留定制元素**：完美保留古典日系侧边导航栏（SideNav）与开场动画（Intro Overlay）。

## 🍀 开源致谢与版权声明 / Open Source Attribution

本项目前端主题视觉设计、动效算法与组件灵感源自并适配自以下优秀开源项目：

- **[Firefly / 流萤](https://github.com/CuteLeaf/Firefly)** by [CuteLeaf](https://github.com/CuteLeaf) (遵循 MIT 开源许可协议)
- **[fuwari](https://github.com/saicaca/fuwari)** by [saicaca](https://github.com/saicaca) (遵循 MIT 开源许可协议)

> 特别致谢：
> - 非常感谢 [saicaca](https://github.com/saicaca) 开发的 fuwari 模板与 [CuteLeaf](https://github.com/CuteLeaf) 二次开发的 Firefly 主题，为本项目提供了优秀的视觉设计和动效参考。
> - 流萤部分相关素材版权归米哈游（miHoYo）《崩坏：星穹铁道》所有。

## 🚀 本地开发与构建

```bash
# 启动开发服务器 (默认端口 http://localhost:5173/)
npm run dev

# 执行 TypeScript 类型检查与生产打包
npm run build

# 预览生产构建产物
npm run preview
```
