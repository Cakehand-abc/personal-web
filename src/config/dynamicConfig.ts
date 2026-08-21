/**
 * ==============================================================================
 * 🍃 日常随笔与瞬间动态配置 (DynamicConfig)
 * ==============================================================================
 * 控制主页 #essays 区域的随笔与右侧侧边栏【最新动态】小组件。
 */

export interface MomentItem {
  id: number
  date: string
  content: string
  tag?: string
  likes?: number
  pinned?: boolean
}

export const dynamicConfig: MomentItem[] = [
  {
    id: 1,
    date: '2026-07-15 02:11:27',
    content: '又是美好的一天!',
    tag: '日常',
    likes: 18,
    pinned: true
  },
  {
    id: 2,
    date: '2026-07-15 16:15:29',
    content: '飞萤之火自无梦的长夜亮起，绽放在终竞的明天。',
    tag: '生活感悟',
    likes: 24,
    pinned: false
  },
  {
    id: 3,
    date: '2026-06-28 20:30:00',
    content: '在星空下听着轻音乐敲代码，沉浸式体会到了属于极客的浪漫与专注。💻',
    tag: '灵感瞬间',
    likes: 32,
    pinned: false
  },
  {
    id: 4,
    date: '2026-06-01 10:00:00',
    content: '愿你历尽千帆，归来仍是少年。',
    tag: '随笔',
    likes: 45,
    pinned: false
  }
]
