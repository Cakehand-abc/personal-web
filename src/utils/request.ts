import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:8080', // 后端地址
  timeout: 10000 // 超时时间
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 每次发送请求之前，检查 localStorage 里有没有 Token
    const token = localStorage.getItem('token')
    if (token) {
      // 如果有，就加在请求头里
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response && error.response.status === 401) {
      // 如果后端返回 401，说明 Token 过期或者无效，踢回首页重新登录
      localStorage.removeItem('token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default request
