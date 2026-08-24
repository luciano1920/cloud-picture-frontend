<template>
  <div id="user-login-page">
    <h2 class="title">用户登录</h2>
    <div class="desc">欢迎回到智能云图库空间</div>

    <a-form :model="formData" :rules="rules" auto-complete="off" @finish="handleSubmit">
      <a-form-item name="userAccount">
        <a-input v-model:value="formData.userAccount" placeholder="请输入用户账号">
          <template #prefix>
            <UserOutlined />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item name="userPassword">
        <a-input-password v-model:value="formData.userPassword" placeholder="请输入密码">
          <template #prefix>
            <LockOutlined />
          </template>
        </a-input-password>
      </a-form-item>

      <div class="tips">
        <div>
          没有账号？
          <RouterLink to="/auth/register">立即注册</RouterLink>
        </div>

        <div>
          <RouterLink to="/auth/forgot">忘记密码</RouterLink>
        </div>
      </div>

      <a-form-item>
        <a-button type="primary" html-type="submit" class="action">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'antdv-next'
import { UserOutlined, LockOutlined } from '@antdv-next/icons'

import { userLoginUsingPost } from '@/api/user-controller'
import { useUserStore } from '@/stores/user-store'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 登录表单数据
const formData = reactive<USER_API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
})

const rules = {
  userAccount: [{ required: true, message: '请输入用户账号', trigger: ['change', 'blur'] }],
  userPassword: [{ required: true, message: '请输入密码', trigger: ['change', 'blur'] }],
}

/**
 * 提交表单
 * @param values 表单提交的值
 */
const handleSubmit = async (values: any) => {
  const res = await userLoginUsingPost(values)
  if (res.data.code === 0 && res.data.data) {
    // 登录成功后，将登录信息保存到全局状态
    await userStore.fetchLoginUser()
    // 也可以用setLoginUser方法设置
    userStore.setLoginUser(res.data.data)
    message.success('登录成功')
    // 判断是否有重定向地址，如果有则跳转到该地址，否则跳转到首页
    router.push({
      path: (route.query.redirect as string) ?? '/',
      replace: true,
    })
  } else {
    message.error(res.data.message || '登录失败')
  }
}
</script>

<style scoped lang="scss">
#user-login-page {
  max-width: 360px;
  margin: 0 auto;

  .title {
    text-align: center;
    margin-bottom: 18px;
    font-size: 26px;
    font-weight: bold;
  }

  .desc {
    text-align: center;
    color: #7d7d7d;
    font-size: 16px;
    margin-bottom: 28px;
  }

  .tips {
    display: flex;
    justify-content: space-between;
    color: #7d7d7d;
    font-size: 15px;
    margin-bottom: 20px;
    padding: 0 8px;
  }

  .action {
    width: 100%;
    height: 100%;
    padding: 10px;
    border-radius: 100px;
    font-size: 18px;
    font-weight: 600;
  }
}

#user-login-page .ant-input-affix-wrapper {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 100px;
  background: var(--auth-input-bg);
}

#user-login-page :deep(.ant-input-prefix) {
  margin: 0 12px 0 8px;
  font-size: 17px;
}

#user-login-page :deep(.ant-input-suffix) {
  margin: 0 5px;
  font-size: 17px;
}

#user-login-page :deep(.ant-input) {
  background: transparent;
  font-size: 16px;
  font-weight: 500;
}

#user-login-page :deep(.ant-input)::placeholder {
  font-size: 16px;
  font-weight: 500;
}
</style>
