/**
 * ==============================================================================
 * 🖼️ 光影相册与画廊配置 (GalleryConfig)
 * ==============================================================================
 * 完美对齐 Firefly 原版相册系统：
 * 1. 相册列表层级（封面堆叠卡片、智能模糊搜索、照片统计）
 * 2. 相册详情瀑布流（Hero Banner、Masonry 瀑布流自适应布局）
 * 3. 沉浸式全屏灯箱（缩放、旋转、全屏、下载、右键允许复制、选中缩略图高亮放大）
 */

export interface GalleryPhoto {
  id: string | number
  url: string
  title?: string
  desc?: string
  width?: number
  height?: number
}

export interface AlbumItem {
  id: string
  name: string
  description: string
  location: string
  date: string
  cover?: string
  tags: string[]
  photos: GalleryPhoto[]
}

export const galleryAlbumConfig: AlbumItem[] = [
  {
    id: 'firefly-2026',
    name: '可爱流萤',
    description: '飞萤之火自无梦的长夜亮起，绽放在终竞的明天。',
    location: '崩坏：星穹铁道',
    date: '2026-01-01',
    cover: '/assets/images/DesktopWallpaper/d1.avif',
    tags: ['崩坏星穹铁道', '流萤', '崩铁'],
    photos: [
      { id: 1, url: '/assets/images/DesktopWallpaper/d1.avif', title: '星空流萤', desc: '漫天星辰下的轻声低语' },
      { id: 2, url: '/assets/images/DesktopWallpaper/d2.avif', title: '林间微光', desc: '阳光穿过树梢的宁静午后' },
      { id: 3, url: '/assets/images/DesktopWallpaper/d3.avif', title: '暮光之城', desc: '夕阳染红云层的梦幻时刻' },
      { id: 4, url: '/assets/images/DesktopWallpaper/d4.avif', title: '静谧湖畔', desc: '倒映着无垠星夜的清澈湖水' },
      { id: 5, url: '/assets/images/DesktopWallpaper/d5.avif', title: '飞萤之约', desc: '向着晨曦与光芒奔赴' },
      { id: 6, url: '/assets/images/DesktopWallpaper/d6.avif', title: '繁星璀璨', desc: '宇宙浩瀚，我们都是星尘' },
      { id: 7, url: '/assets/images/avatar.avif', title: '流萤肖像', desc: '清澈温暖的温柔微笑' },
      { id: 8, url: 'https://s41.ax1x.com/2026/05/13/peXsfit.webp', title: '夏夜流萤', desc: '草木繁茂的夏日微风' },
      { id: 9, url: 'https://s41.ax1x.com/2026/05/13/peXyh79.jpg', title: '晨光依稀', desc: '晨曦中的甜美回眸' }
    ]
  },
  {
    id: 'star-rail-wallpapers',
    name: '星穹铁道精选壁纸',
    description: '银河铁道漫游中的唯美光影与二次元摄影集锦。',
    location: '崩坏：星穹铁道',
    date: '2026-02-01',
    cover: '/assets/images/DesktopWallpaper/d3.avif',
    tags: ['崩坏星穹铁道', '壁纸', '崩铁'],
    photos: [
      { id: 101, url: '/assets/images/DesktopWallpaper/d3.avif', title: '暮色流年', desc: '私密珍藏的美好时刻' },
      { id: 102, url: '/assets/images/DesktopWallpaper/d4.avif', title: '星夜低语', desc: '星夜低语' },
      { id: 103, url: '/assets/images/DesktopWallpaper/d5.avif', title: '清风微拂', desc: '清风微拂' },
      { id: 104, url: '/assets/images/DesktopWallpaper/d6.avif', title: '璀璨星尘', desc: '璀璨星尘' }
    ]
  }
]

export const galleryConfig = galleryAlbumConfig[0].photos
