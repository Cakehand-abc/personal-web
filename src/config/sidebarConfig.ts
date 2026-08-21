/**
 * ==============================================================================
 * 📑 侧边栏小组件布局配置 (SidebarConfig)
 * ==============================================================================
 * 控制右侧侧边栏各个小组件的显隐开关。
 * 将对应项改为 false 即可在前端一键关闭该小组件！
 */

export interface SidebarConfig {
  widgets: {
    /** 个人资料名片卡片 (ProfileWidget) */
    profile: boolean

    /** 站点公告栏卡片 (AnnouncementWidget) */
    announcement: boolean

    /** 文章分类胶囊卡片 (CategoriesWidget) */
    categories: boolean

    /** 热门标签云卡片 (TagsWidget) */
    tags: boolean

    /** 站点数据统计与建站运行天数卡片 (SiteStatsWidget) */
    siteStats: boolean
  }
}

export const sidebarConfig: SidebarConfig = {
  widgets: {
    profile: true,      // 设为 true 显示个人资料卡；false 则隐藏
    announcement: true, // 设为 true 显示公告栏；false 则隐藏
    categories: true,   // 设为 true 显示文章分类列表；false 则隐藏
    tags: true,         // 设为 true 显示热门标签云；false 则隐藏
    siteStats: true     // 设为 true 显示建站运行天数与字数统计；false 则隐藏
  }
}
