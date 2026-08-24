import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getLoginUserInfoUsingGet } from '@/api/user-controller'
import { message } from 'antdv-next'

/**
 * 存储登录用户信息的状态
 */
export const useUserStore = defineStore('user', () => {
  const loginUser = ref<USER_API.LoginUserVO>({
    userName: '未登录',
  })

  /**
   * 远程获取登录用户信息
   */
  async function fetchLoginUser() {
    const res = await getLoginUserInfoUsingGet()
    if (res.data.code === 0 && res.data.data) {
      loginUser.value = res.data.data
    } else {
      message.error('获取当前用户信息失败，' + res.data.message)
    }
  }

  /**
   * 设置登录用户信息
   * @param newLoginUser
   */
  function setLoginUser(newLoginUser: USER_API.LoginUserVO) {
    loginUser.value = newLoginUser
  }

  // 返回状态和方法
  return { loginUser, fetchLoginUser, setLoginUser }
})
