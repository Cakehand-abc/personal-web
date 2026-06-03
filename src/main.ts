import { createApp } from 'vue'
import './assets/styles/index.scss'
import App from './App.vue'
import router from './router'
import pinia from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import scrollRevealDirective from './directives/scroll-reveal'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 注册全局指令
app.directive('scroll-reveal', scrollRevealDirective)

app.mount('#app')
