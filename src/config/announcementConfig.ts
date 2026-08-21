/**
 * ==============================================================================
 * 📢 站点公告栏配置 (AnnouncementConfig)
 * ==============================================================================
 * 控制右侧侧边栏的公告小组件（AnnouncementWidget）。
 */

export interface AnnouncementConfig {
  /** 是否启用公告栏展示 (true: 显示, false: 完全隐藏该组件) */
  enable: boolean

  /** 公告栏标题 (例如："公告"、"站点公告") */
  title: string

  /** 公告正文内容 */
  content: string

  /** 是否允许访客点击右上角 ✕ 按钮手动关闭此卡片 */
  closable: boolean

  /** 底部操作按钮配置 */
  link?: {
    enable: boolean
    url: string
    text: string
  }
}

export const announcementConfig: AnnouncementConfig = {
  // 1. 【是否显示公告】设为 false 侧边栏将不再渲染公告卡片
  enable: true,

  // 2. 【公告标题】
  title: '公告',

  // 3. 【公告正文内容】
  content: '欢迎来到我的博客！这是一则示例公告。',

  // 4. 【允许关闭】
  closable: true,

  // 5. 【了解更多按钮】
  link: {
    enable: true,
    url: '#about',
    text: '了解更多'
  }
}
