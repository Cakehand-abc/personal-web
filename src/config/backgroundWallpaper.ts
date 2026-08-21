/**
 * ==============================================================================
 * 🖼️ 顶部横幅与背景壁纸配置 (BackgroundWallpaperConfig)
 * ==============================================================================
 * 控制首页顶部 FireflyBanner 的轮播壁纸、主标题、动态打字机副标题与社交按钮。
 */

export interface BackgroundWallpaperConfig {
  /** 
   * 壁纸展示模式：
   * - 'banner': 顶部巨幅海报横幅（底部带动态水波纹）
   * - 'fullscreen': 网页全屏背景壁纸
   * - 'none': 纯色背景无壁纸
   */
  mode: 'banner' | 'fullscreen' | 'none'

  /** 
   * 轮播壁纸列表（数组）
   * 
   * 📍 图片存放位置说明：
   * 1. 本地图片：放在 `personal-web/public/assets/images/DesktopWallpaper/` 目录下，以 `/assets/images/...` 引用。
   * 2. 外部直链：支持直接粘贴 HTTPS 图片直链，如 `'https://images.unsplash.com/...'`
   * 
   * 💡 系统会自动开启平滑淡入淡出（Crossfade）轮播！
   */
  wallpapers: string[]

  /** 轮播图参数控制 */
  carousel: {
    /** 是否开启自动轮播切换 (true: 自动轮播, false: 固定展示第一张) */
    enable: boolean
    /** 自动轮播切换间隔时间（毫秒，6000 = 6秒切换一次） */
    interval: number
  }

  /** 顶部横幅文案配置 */
  homeText: {
    /** 是否开启横幅文字展示 (true: 开启, false: 隐藏文字仅留纯壁纸) */
    enable: boolean

    /** 
     * 横幅主标题（大号粗体）
     */
    title: string

    /** 
     * 打字机副标题语录列表（数组）
     * 打字机效果开启时，会在这些语录之间自动循环打字、删除、切换下一句。
     */
    subtitle: string[]

    /** 打字机动效速度参数 */
    typewriter: {
      /** 是否启用打字机动画效果 (true: 动态打字切换, false: 静态固定显示第一句) */
      enable: boolean

      /** 打字速度（每个字符出现的毫秒数，越小越快，推荐 80 ~ 150） */
      speed: number

      /** 删除速度（每个字符回退删除的毫秒数，推荐 40 ~ 70） */
      deleteSpeed: number

      /** 一句话完全展示完毕后的停顿等待时间（毫秒，推荐 1500 ~ 3000） */
      pauseTime: number
    }
  }

  /** 
   * 横幅底部的快捷跳转社交胶囊按钮组
   * 仅保留 GitHub 与 哔哩哔哩，并使用专用高质量图标
   */
  links: Array<{
    /** 按钮名称 */
    name: string
    /** 跳转链接 */
    url: string
    /** 图标路径 (本地/网络图片) */
    icon: string
    /** 是否在新标签页打开 */
    external?: boolean
  }>
}

export const backgroundWallpaper: BackgroundWallpaperConfig = {
  // 1. 【壁纸模式】
  mode: 'banner',

  // 2. 【轮播壁纸库列表】
  // 系统会自动按顺序平滑淡入淡出轮播以下壁纸
  wallpapers: [
    '/assets/images/DesktopWallpaper/d1.avif', // 第 1 张：星空流萤
    '/assets/images/DesktopWallpaper/d2.avif', // 第 2 张：林间微光
    '/assets/images/DesktopWallpaper/d3.avif', // 第 3 张：暮光之城
    '/assets/images/DesktopWallpaper/d4.avif', // 第 4 张：静谧湖畔
    '/assets/images/DesktopWallpaper/d5.avif', // 第 5 张：飞萤之约
    '/assets/images/DesktopWallpaper/d6.avif'  // 第 6 张：繁星璀璨
  ],

  // 3. 【轮播图设置】
  carousel: {
    enable: true,   // 开启自动轮播
    interval: 6000  // 6000 毫秒 (6秒) 自动切换下一张
  },

  // 4. 【横幅核心文案与打字机配置】
  homeText: {
    enable: true,

    // 【横幅主标题】
    title: 'Firefly · 流萤',

    // 【打字机副标题】
    subtitle: [
      '愿你历尽千帆，归来仍是少年。',
      '大切な人といつかまた巡り会えますように。',
      '无论何时何地，请记得仰望璀璨的星空。',
      '飞萤扑火，向死而生。在这静谧的夜空里，寻找属于我们的光。',
      'Where code creates magic and dreams shine bright.'
    ],

    // 【打字机动效速度控制】
    typewriter: {
      enable: true,     // 开启打字动效
      speed: 100,       // 打字速度 (100毫秒/字)
      deleteSpeed: 50,  // 删除速度 (50毫秒/字)
      pauseTime: 2200   // 打完一句停留 2.2 秒
    }
  },

  // 5. 【横幅社交按钮】（仅保留 GitHub 与 哔哩哔哩，使用专用定制图标）
  links: [
    {
      name: 'GitHub',
      url: 'https://github.com/Cakehand-abc',
      icon: '/assets/icons/github.png',
      external: true
    },
    {
      name: 'bilibili',
      url: 'https://space.bilibili.com/3546759525566899?spm_id_from=333.1007.0.0',
      icon: '/assets/icons/bilibili.png',
      external: true
    }
  ]
}
