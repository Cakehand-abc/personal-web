/**
 * ==============================================================================
 * 🖼️ 画廊相册相片配置 (GalleryConfig)
 * ==============================================================================
 * 控制主页 #gallery 锚点下的相册展示列表。
 * 你可以在此添加任意数量的摄影作品、二次元插画或壁纸！
 */

export interface GalleryItem {
  /** 相片地址（支持 public 本地路径如 '/assets/images/...' 或网络直链 'https://...'） */
  url: string
  /** 相片标题（鼠标悬浮时展示） */
  title: string
  /** 相片简短副标题 / 描述 */
  desc: string
}

export const galleryConfig: GalleryItem[] = [
  {
    url: '/assets/images/DesktopWallpaper/d1.avif',
    title: '星空流萤',
    desc: '漫天星辰下的轻声低语'
  },
  {
    url: '/assets/images/DesktopWallpaper/d2.avif',
    title: '林间微光',
    desc: '阳光穿过树梢的宁静午后'
  },
  {
    url: '/assets/images/DesktopWallpaper/d3.avif',
    title: '暮光之城',
    desc: '夕阳染红云层的梦幻时刻'
  },
  {
    url: '/assets/images/DesktopWallpaper/d4.avif',
    title: '静谧湖畔',
    desc: '倒映着无垠星夜的清澈湖水'
  },
  {
    url: '/assets/images/DesktopWallpaper/d5.avif',
    title: '飞萤之约',
    desc: '向着晨曦与光芒奔赴'
  },
  {
    url: '/assets/images/DesktopWallpaper/d6.avif',
    title: '繁星璀璨',
    desc: '宇宙浩瀚，我们都是星尘'
  }
]
