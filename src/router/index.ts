import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import { useProgress } from '@/composables/useProgress'
import { routes } from './routes'

const NProgress = useProgress({ show: import.meta.env.VITE_PROGRESS_SHOW === 'true' })

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_PATH),
  routes,
})

/**
 * @description 路由守卫：动态设置页面标题
 * @param to 路由跳转目标
 */
router.beforeEach((to: RouteLocationNormalized) => {
  NProgress.start()
  const title = to.meta.title as string
  const siteName = import.meta.env.VITE_APP_NAME_CN
  document.title = title ? `${title} - ${siteName}` : siteName
})

router.afterEach(() => {
  NProgress.done()
})

export default router
