/**
 * ==============================================================================
 * 🌟 站点全局基础配置 (SiteConfig)
 * ==============================================================================
 * 这是博客最核心的全局配置文件。
 * 修改这里的每一项都会直接在前台对应位置生效！
 */

export interface SiteConfig {
  /** 站点标题（显示在浏览器标签页、首页大标题等位置） */
  title: string

  /** 站点副标题 / 博客标语 */
  subtitle: string

  /** 站点线上访问 URL（用于生成文章分享链接与版权链接） */
  site_url: string

  /** 站点描述（用于 SEO 搜索引擎抓取与社交分享） */
  description: string

  /** 站点关键词（用于 SEO 标签） */
  keywords: string[]

  /** 建站起始日期，格式：YYYY-MM-DD（用于页脚和站点统计自动计算已运行天数） */
  siteStartDate: string

  /** 站点作者名字（显示在版权声明、页脚作者署名等） */
  author: string

  /** 全局默认文章封面图（当文章未单独上传封面时使用此图） */
  defaultCoverUrl: string

  /** 主题色彩体系默认配置 */
  themeColor: {
    /** 
     * 默认色相 (0 ~ 360) 
     * 常用推荐色相：
     * - 250: 流萤青蓝 / 星空蓝（Firefly 标志色）
     * - 150: 翡翠葱绿 / 清新森系
     * - 290: 暮紫幽韵 / 梦幻紫
     * - 345: 樱粉浪漫 / 少女粉
     * - 45:  暖阳落日 / 琥珀橙
     * - 0:   赤焰绯红
     */
    hue: number

    /** 默认色彩模式：'light' (浅色模式) | 'dark' (深色模式) | 'system' (跟随系统) */
    defaultMode: 'light' | 'dark' | 'system'
  }

  /** 文章列表默认展示布局 */
  postListLayout: {
    /** 默认列表模式：'list' (单列优雅大卡片) | 'grid' (双列瀑布网格) */
    defaultLayout: 'list' | 'grid'
    /** 是否显示文章字数统计 */
    showWords: boolean
    /** 是否显示预估阅读时长 */
    showReadingTime: boolean
  }
}

export const siteConfig: SiteConfig = {
  // 1. 【站点主标题】你可以改成你自己的名字，例如："胡吉涵的个人小站" 或 "Firefly · 流萤"
  title: 'Firefly · 流萤',

  // 2. 【站点副标题】显示在标题下方的个性化寄语
  subtitle: '愿每一行代码都能如夏夜流萤般照亮前行的路',

  // 3. 【站点网址】部署上线后改成你自己的域名，例如："https://yourdomain.com"
  site_url: 'http://localhost:5173',

  // 4. 【站点描述】
  description: '基于 Vue 3 + TypeScript + Tailwind CSS 构建的 Firefly（流萤）二次元美学个人博客。',

  // 5. 【SEO 关键词】数组格式，可随意增删
  keywords: ['Firefly', 'Vue3', 'TypeScript', 'TailwindCSS', 'ACGN', '个人博客', '技术分享'],

  // 6. 【建站日期】格式必须为 YYYY-MM-DD，系统会自动根据今天计算建站天数
  siteStartDate: '2026-01-01',

  // 7. 【站长作者名】
  author: 'Firefly',

  // 8. 【全局默认文章封面图】支持 public 目录本地图片或网络直链
  // 示例1 (本地图): '/assets/images/DesktopWallpaper/d1.avif'
  // 示例2 (网络图): 'https://picsum.photos/800/450'
  defaultCoverUrl: '/assets/images/DesktopWallpaper/d1.avif',

  // 9. 【主题色彩配置】
  themeColor: {
    hue: 250,           // 默认青蓝色相，用户可在右下角滑块随意调节
    defaultMode: 'light'// 'light' 浅色，'dark' 暗色
  },

  // 10. 【文章列表布局】
  postListLayout: {
    defaultLayout: 'list', // 'list' 为单列，'grid' 为双列网格
    showWords: true,       // 显示字数
    showReadingTime: true  // 显示预计阅读分钟数
  }
}
