import { storeToRefs } from 'pinia'
import { message } from 'antdv-next'
import router from '@/router'
import { useUserStore } from '@/stores/user-store'
import { ACCESS_ENUM } from '@/constants/access'
import { checkAccess } from '@/utils/auth'

const AUTH_WHITE_LIST = ['/auth/unauthorized', '/auth/forgot']

/**
 * @description 全局路由守卫
 * 1. 检查用户是否登录
 * 2. 检查用户是否有访问该页面的权限
 * @param to 要跳转的路由
 * @param from 从哪个路由跳转过来
 * @param next 路由跳转函数 deprecated - 在 Vue Router 4.x 及更高版本中，导航守卫的 next() 回调已被弃用，推荐使用返回值 return 的方式
 */
router.beforeEach(async (to) => {
  const userStore = useUserStore()
  const { loginUser } = storeToRefs(userStore)

  // ==================== 1. 第一层：白名单直接放行 ====================
  if (AUTH_WHITE_LIST.includes(to.path)) {
    return true
  }

  // ==================== 2. 第二层：如果之前没登录过是首次登录，自动登录并等待获取用户信息（不阻断主流程） ====================
  if (!loginUser.value || !loginUser.value.userRole) {
    await userStore.fetchLoginUser()
  }

  // ==================== 3. 第三层：已登录 or 未登录 ====================
  // 记录要跳转的页面所需的权限（默认无需登录）
  const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN

  if (loginUser.value.id || loginUser.value.userRole) {
    // 拦截已登录用户访问认证页（排除白名单内的以 'auth' 开头的页面）
    if (to.path.startsWith('/auth') && !AUTH_WHITE_LIST.includes(to.path)) {
      return '/'
    }

    // 无需登录的页面直接放行
    if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
      return true
    }

    // 权限校验
    if (!checkAccess(loginUser.value, needAccess)) {
      message.error('您没有权限访问该页面')
      return '/auth/unauthorized'
    }
  } else {
    // 无需登录的页面直接放行
    if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
      return true
    }

    // 需要权限，但当前处于 /auth 下的公开页面（如登录、注册页本身），放行
    if (to.path.startsWith('/auth')) {
      return true
    }

    // 需要权限且不在公开页面，重定向到登录页
    message.error('用户未登录，请先登录')
    return `/auth/login?redirect=${encodeURIComponent(to.fullPath)}`
  }
})
