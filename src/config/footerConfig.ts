/**
 * ==============================================================================
 * 📜 页面底部页脚配置 (FooterConfig)
 * ==============================================================================
 * 控制网页底部 Footer 的寄语、运行天数与开源致谢声明。
 */

export interface FooterConfig {
  /** 是否启用页脚展示 */
  enable: boolean

  /** 建站起始日期（YYYY-MM-DD），用于计算已运行天数，留空则继承 siteConfig.siteStartDate */
  siteStartDate: string

  /** 页脚底部的经典动漫寄语 / 诗意文案 */
  quote: string

  /** 开源致谢与动力支持展示开关 */
  poweredBy: {
    vue: boolean
    firefly: boolean
    fuwari: boolean
  }
}

export const footerConfig: FooterConfig = {
  enable: true,

  // 建站日期（计算已运行天数）
  siteStartDate: '2026-01-01',

  // 底部日系寄语
  quote: '“大切な人といつかまた巡り会えますように” (愿与重要之人有朝一日能再次相遇)',

  // 开源项目致谢开关
  poweredBy: {
    vue: true,      // 显示 Powered by Vue 3
    firefly: true,  // 显示 Firefly Theme 致谢
    fuwari: true    // 显示 fuwari 灵感致谢
  }
}
