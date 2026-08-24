import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import qs from 'qs'
import { message } from 'antdv-next'
import router from '@/router'

const BASE_PATH = (import.meta.env.VITE_BASE_PATH || '').replace(/\/+$/, '')

// 创建 Axios 实例
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
  withCredentials: true,
  // 参数序列化配置
  paramsSerializer: (params) => {
    return qs.stringify(params, {
      arrayFormat: 'brackets', // 数组格式化方式：brackets, indices, repeat, comma
      allowDots: true, // 允许使用点号表示嵌套对象
      skipNulls: false, // 不跳过 null 值
      strictNullHandling: false, // 不严格处理 null 值
    })
  },
})

// 全局请求拦截器
axiosInstance.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

// 全局响应拦截器
axiosInstance.interceptors.response.use(
  async function (response: AxiosResponse) {
    const { data, config } = response

    // 401：登录过期/未认证
    if (data.code === 40100) {
      const currentPath = window.location.pathname + window.location.search
      // 不是获取用户信息的请求，并且用户目前不是已经在用户登录页面，则跳转到登录页面
      if (
        !config.url?.includes('user/get/user-info') &&
        !window.location.pathname.includes('/auth/login')
      ) {
        message.warning('请先登录')
        router.replace(`${BASE_PATH}/auth/login?redirect=${encodeURIComponent(currentPath)}`)
      }
    }

    // 403：无权限访问资源（跳转无权限页面）
    if (data.code === 40101 || data.code === 40300) {
      if (!window.location.pathname.includes('/auth/unauthorized')) {
        message.error('您没有权限执行此操作')
        router.replace(`${BASE_PATH}/auth/unauthorized`)
      }
      return Promise.reject(new Error('无权限'))
    }

    return response
  },

  // 任何超出 2xx 的状态码都会触发该函数
  function (error) {
    return Promise.reject(error)
  },
)

export default axiosInstance
