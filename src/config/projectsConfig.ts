/**
 * ==============================================================================
 * 🚀 开源作品集配置 (ProjectsConfig)
 * ==============================================================================
 * 控制主页 #projects 区域展示的开源项目与作品列表。
 */

export interface ProjectItem {
  id: number
  /** 项目名称 */
  name: string
  /** 项目简要介绍 */
  description: string
  /** GitHub 仓库源码直链 (例如: 'https://github.com/your-name/repo') */
  githubUrl?: string
  /** 源码安装包或 Release 下载链接 (留空则不显示下载按钮) */
  downloadUrl?: string
  /** 类别角标名称 */
  badge?: string
}

export const projectsConfig: ProjectItem[] = [
  {
    id: 1,
    name: '学习通位置签到系统',
    description: '支持学习通位置签到、普通签到。通过获取 Cookie，采用伪造 IP 及机器码的方式完成安全验证。',
    githubUrl: 'https://github.com/Cakehand-abc/XuexitongSign',
    downloadUrl: 'https://github.com/Cakehand-abc/XuexitongSign/archive/refs/heads/master.zip',
    badge: '自动化工具'
  },
  {
    id: 2,
    name: 'Firefly 个人博客主题',
    description: '基于 Vue 3 + TypeScript 构建的高颜值二次元清新博客系统，支持 OKLCH 色彩体系、动态水波纹与落樱粒子。',
    githubUrl: 'https://github.com/CuteLeaf/Firefly',
    downloadUrl: '',
    badge: 'Web 前端'
  }
]
