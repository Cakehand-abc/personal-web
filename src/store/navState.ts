import { ref } from 'vue'

// 记录当前屏幕上处于核心可见区域的锚点ID（例如 '#home', '#featured' 等）
export const activeSection = ref('#home')

// 标记当前是否正在由点击导航触发平滑滚动（避免滚动监听与动画相互打架造成卡顿）
export const isNavScrolling = ref(false)
