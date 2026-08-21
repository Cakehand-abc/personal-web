/**
 * ==============================================================================
 * 🍃 日常随笔与瞬间动态配置 (DynamicConfig)
 * ==============================================================================
 * 控制主页 #essays 区域的随笔与生活切片列表。
 */

export interface MomentItem {
  id: number
  date: string
  content: string
  tag: string
  likes: number
}

export const dynamicConfig: MomentItem[] = [
  {
    id: 1,
    date: '2026-08-21',
    content: '今天完成了 Firefly 风格视觉与色彩系统的深度重构，OKLCH 的 360° 色相变幻与动态水波纹在屏幕上流动的时候真的太让人心动了！✨',
    tag: '前端工程化',
    likes: 18
  },
  {
    id: 2,
    date: '2026-08-15',
    content: '“飞萤扑火，向死而生。” 写代码和探索世界一样，即便前方是未知，也要怀揣希望奔赴下一场山海。🌸',
    tag: '生活感悟',
    likes: 12
  },
  {
    id: 3,
    date: '2026-07-28',
    content: '在星空下听着轻音乐敲代码，沉浸式体会到了属于极客的浪漫与专注。💻 记录生活中的微小感动。',
    tag: '灵感瞬间',
    likes: 24
  }
]
