/**
 * ==============================================================================
 * 📢 站点公告栏配置 (AnnouncementConfig)
 * ==============================================================================
 * 控制右侧侧边栏的公告小组件（AnnouncementWidget）。
 */

export interface AnnouncementConfig {
  /** 是否启用公告栏展示 (true: 显示, false: 完全隐藏该组件) */
  enable: boolean

  /** 公告栏标题 (例如："站点公告"、"最新动态"、"维护提醒") */
  title: string

  /** 公告正文内容 */
  content: string

  /** 是否允许访客点击右上角 ✕ 按钮手动关闭此卡片 */
  closable: boolean
}

export const announcementConfig: AnnouncementConfig = {
  // 1. 【是否显示公告】设为 false 侧边栏将不再渲染公告卡片
  enable: true,

  // 2. 【公告标题】
  title: '站点公告',

  // 3. 【公告正文内容】
  content: '欢迎来到我的全新 Firefly 风格个人博客！这里汇聚了前端技术、生活随笔、画廊与开源项目，愿你在此收获温暖与灵感。',

  // 4. 【允许关闭】
  closable: true
}
