import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '../utils/request'

export const useSettingStore = defineStore('setting', () => {
  const siteName = ref('加载中...')
  const siteSignature = ref('')
  const avatarUrl = ref('')
  const introMediaType = ref('image')
  const introMediaUrl = ref('')
  const recordNumber = ref('')
  const useOldIntro = ref(false)
  const defaultCoverUrl = ref('')

  const fetchSettings = async () => {
    try {
      const res: any = await request.get('/api/settings')
      if (res.code === 200 && res.data) {
        siteName.value = res.data.siteName || 'MyBlog ciallo～(∠・ω< )⌒☆'
        siteSignature.value = res.data.siteSignature || 'Hello World'
        avatarUrl.value = res.data.avatarUrl || ''
        introMediaType.value = res.data.introMediaType || 'image'
        introMediaUrl.value = res.data.introMediaUrl || ''
        recordNumber.value = res.data.recordNumber || ''
        useOldIntro.value = res.data.useOldIntro || false
        defaultCoverUrl.value = res.data.defaultCoverUrl || ''
        
        // 更新网站标题
        document.title = siteName.value
      }
    } catch (error) {
      console.error('获取网站配置失败:', error)
    }
  }

  return { 
    siteName, siteSignature, avatarUrl, introMediaType, introMediaUrl, recordNumber, useOldIntro, defaultCoverUrl,
    fetchSettings 
  }
})
