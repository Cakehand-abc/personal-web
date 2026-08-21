/**
 * ==============================================================================
 * ✨ 特效与粒子动画系统配置 (EffectsConfig)
 * ==============================================================================
 * 控制全站樱花飘落动效（SakuraEffect）与横幅底部动态水波纹（WavesEffect）。
 */

export interface SakuraConfig {
  /** 默认是否开启落樱飘落动效 (用户在右下角悬浮坞也可以随时开关) */
  enable: boolean

  /** 屏幕上同时飘落的花瓣数量（推荐 18 ~ 36，数字越大花瓣越密） */
  sakuraNum: number

  /** Canvas 所在图层层级（z-index） */
  zIndex: number

  /** 花瓣尺寸缩放范围（0.1 ~ 2.0 之间） */
  size: {
    min: number
    max: number
  }

  /** 花瓣透明度范围（0.1 ~ 1.0 之间） */
  opacity: {
    min: number
    max: number
  }

  /** 花瓣运动物理参数 */
  speed: {
    /** 水平漂移速度（负数向左，正数向右） */
    horizontal: { min: number; max: number }
    /** 下落垂直速度（数字越大落得越快） */
    vertical: { min: number; max: number }
    /** 旋转角速度 */
    rotation: number
    /** 渐隐速度 */
    fadeSpeed: number
  }
}

export interface WavesConfig {
  /** 是否启用横幅底部的 Canvas 2D 动态水波纹流体过渡 */
  enable: boolean
}

export interface EffectsConfig {
  sakura: SakuraConfig
  waves: WavesConfig
}

export const effectsConfig: EffectsConfig = {
  // 1. 【落樱飘落动效】
  sakura: {
    enable: true,     // 默认开启
    sakuraNum: 24,    // 24片花瓣，轻盈优雅
    zIndex: 10,       // 位于背景之上、内容之下
    size: {
      min: 0.4,       // 最小花瓣尺寸倍数
      max: 1.0        // 最大花瓣尺寸倍数
    },
    opacity: {
      min: 0.3,       // 最低透明度
      max: 0.85       // 最高透明度
    },
    speed: {
      horizontal: { min: -0.5, max: 1.5 }, // 微风向右轻吹
      vertical: { min: 1.0, max: 2.0 },     // 轻柔下落
      rotation: 0.015,                      // 自转速度
      fadeSpeed: 0.02
    }
  },

  // 2. 【横幅水波纹流体动效】
  waves: {
    enable: true
  }
}
