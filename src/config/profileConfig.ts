/**
 * ==============================================================================
 * 👤 博主个人资料卡配置 (ProfileConfig)
 * ==============================================================================
 * 控制右侧侧边栏第一张卡片（ProfileWidget）的头像、博主昵称、个性签名与社交链接。
 */

export interface ProfileConfig {
  /** 博主昵称（显示在头像下方大字） */
  name: string

  /** 
   * 博主头像图片地址
   * 📍 图片支持两种方式：
   * 1. 本地图片：放在 `public/assets/images/avatar.avif`，以 `'/assets/images/avatar.avif'` 引用。
   * 2. 网络直链：例如 `'https://q1.qlogo.cn/g?b=qq&nk=123456&s=640'` 或其他图床直链。
   */
  avatar: string

  /** 博主个性签名（展示在名片中间的一段文字） */
  bio: string

  /** 社交媒体外链按钮列表 */
  links: Array<{
    /** 社交平台名称（鼠标悬停 tooltip 提示） */
    name: string
    /** 图标类型：'github' | 'bilibili' | 'email' | 'other' */
    icon: string
    /** 跳转链接 */
    url: string
  }>
}

export const profileConfig: ProfileConfig = {
  // 1. 【博主名字】
  name: 'Firefly',

  // 2. 【博主头像】
  // 本地示例：'/assets/images/avatar.avif'
  // 网络直链示例：'https://picsum.photos/seed/avatar/200/200'
  avatar: '/assets/images/avatar.avif',

  // 3. 【个性签名】支持多行或单行，建议 20~60 字视觉效果最佳
  bio: '生如夏花之绚烂，死如秋叶之静美。在这漫长旅途中，记录属于我们的每一刻。',

  // 4. 【社交按钮】
  links: [
    {
      name: 'GitHub 仓库',
      icon: 'github',
      url: 'https://github.com'
    },
    {
      name: 'Bilibili 个人空间',
      icon: 'bilibili',
      url: 'https://bilibili.com'
    },
    {
      name: '联系站长邮箱',
      icon: 'email',
      url: 'mailto:yimohu189@gmail.com'
    }
  ]
}
