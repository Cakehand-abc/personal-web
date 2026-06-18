import { useIntersectionObserver } from '@vueuse/core'
import type { DirectiveBinding, ObjectDirective } from 'vue'

const scrollRevealDirective: ObjectDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 默认添加初始类名，设置为透明并向下偏移
    el.classList.add('scroll-reveal-initial')

    // 如果想要自定义延迟或偏移量，可以通过 binding.value 传递
    if (binding.value && binding.value.delay) {
      el.style.transitionDelay = `${binding.value.delay}ms`
    }

    const { stop } = useIntersectionObserver(
      el,
      ([{ isIntersecting }]) => {
        if (isIntersecting) {
          // 元素进入视口下半区（或根据 rootMargin 设置的区域）
          el.classList.add('scroll-reveal-visible')
          // 触发后立即停止观察，保证一次性效果
          stop()
        }
      },
      {
        // rootMargin 设置: -25% 代表元素进入视口底部 25% 之上（即页面四分之一处）才会触发
        rootMargin: '0px 0px -20% 0px',
        threshold: 0.05
      }
    )
  }
}

export default scrollRevealDirective
