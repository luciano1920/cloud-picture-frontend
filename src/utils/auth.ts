import { ACCESS_ENUM } from '@/constants/access'

/**
 * 全局鉴权方法（判断当前登录用户是否具有某个权限）
 * @param loginUser 当前登录用户信息
 * @param needAccess 需要有的权限
 * @returns boolean 有无权限
 */
export const checkAccess = (loginUser: any, needAccess = ACCESS_ENUM.NOT_LOGIN) => {
  // 获取当前登录用户具有的权限（如果没有loginUser，则表示未登录）
  const loginUserAccess = loginUser.userRole ?? ACCESS_ENUM.NOT_LOGIN

  // 如果不需要登录就能访问的页面（即notLogin角色）
  if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
    return true
  }

  // 如果需要登录才能访问的页面（即user角色）
  if (needAccess === ACCESS_ENUM.USER) {
    // 如果用户没有登录，则无权限
    if (loginUserAccess === ACCESS_ENUM.NOT_LOGIN) {
      return false
    }
  }

  // 如果需要管理员权限才能访问的页面（即admin角色）
  if (needAccess === ACCESS_ENUM.ADMIN) {
    // 如果用户不为管理员，则无权限
    if (loginUserAccess !== ACCESS_ENUM.ADMIN) {
      return false
    }
  }

  return true
}
