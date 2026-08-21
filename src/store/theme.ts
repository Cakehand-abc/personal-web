import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 从 localStorage 读取或设置默认值
  const savedTheme = localStorage.getItem('firefly_theme') || 'light'
  const rawHue = localStorage.getItem('firefly_hue')
  const savedHue = (!rawHue || rawHue === '250') ? '165' : rawHue
  if (!rawHue || rawHue === '250') {
    localStorage.setItem('firefly_hue', '165')
  }
  const savedSakura = localStorage.getItem('firefly_sakura') !== 'false' // 默认开启
  const savedLayout = localStorage.getItem('firefly_layout') || 'list' // list or grid

  const isDark = ref(savedTheme === 'dark')
  const hue = ref(parseInt(savedHue, 10) || 165)
  const sakuraEnabled = ref(savedSakura)
  const postLayout = ref<'list' | 'grid'>(savedLayout as 'list' | 'grid')

  const applyTheme = () => {
    // 设置色相变量
    document.documentElement.style.setProperty('--hue', hue.value.toString())
    
    // 设置暗色/亮色类名
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      document.body.classList.remove('theme-light')
      document.body.classList.add('theme-dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('theme-dark')
      document.body.classList.add('theme-light')
    }
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('firefly_theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  const setHue = (newHue: number) => {
    hue.value = newHue
    localStorage.setItem('firefly_hue', newHue.toString())
    applyTheme()
  }

  const toggleSakura = () => {
    sakuraEnabled.value = !sakuraEnabled.value
    localStorage.setItem('firefly_sakura', sakuraEnabled.value.toString())
  }

  const setPostLayout = (layout: 'list' | 'grid') => {
    postLayout.value = layout
    localStorage.setItem('firefly_layout', layout)
  }

  // 初始化应用
  applyTheme()

  return {
    isDark,
    hue,
    sakuraEnabled,
    postLayout,
    applyTheme,
    toggleTheme,
    setHue,
    toggleSakura,
    setPostLayout
  }
})
