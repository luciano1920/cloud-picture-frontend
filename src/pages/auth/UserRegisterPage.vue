<template>
  <div id="user-register-page">
    <h2 class="title">用户注册</h2>
    <div class="desc">注册社区账号，体验海量云图库</div>

    <a-form :model="formData" :rules="rules" auto-complete="off" @finish="handleSubmit">
      <a-form-item name="userAccount">
        <a-input v-model:value="formData.userAccount" placeholder="请输入用户账号">
          <template #prefix>
            <UserOutlined />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item name="userName">
        <a-input v-model:value="formData.userName" placeholder="请输入用户昵称">
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

      <a-form-item name="checkPassword">
        <a-input-password v-model:value="formData.checkPassword" placeholder="请输入确认密码">
          <template #prefix>
            <LockOutlined />
          </template>
        </a-input-password>
      </a-form-item>

      <div class="tips">
        已有账号？
        <RouterLink to="/auth/login">去登录</RouterLink>
      </div>

      <a-form-item>
        <a-button type="primary" html-type="submit" class="action">注册</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'antdv-next'
import { UserOutlined, LockOutlined } from '@antdv-next/icons'
import { userRegisterUsingPost } from '@/api/user-controller'

const router = useRouter()

// 注册表单数据
const formData = reactive<USER_API.UserRegisterRequest>({
  userAccount: '',
  userName: '',
  userPassword: '',
  checkPassword: '',
})

const rules = {
  userAccount: [{ required: true, message: '请输入用户账号', trigger: ['change', 'blur'] }],
  userName: [{ required: true, message: '请输入用户昵称', trigger: ['change', 'blur'] }],
  userPassword: [
    { required: true, message: '请输入密码', trigger: ['change', 'blur'] },
    { min: 8, message: '密码长度不能小于8位', trigger: 'change' },
  ],
  checkPassword: [
    { required: true, message: '请输入确认密码', trigger: ['change', 'blur'] },
    { min: 8, message: '确认密码长度不能小于8位', trigger: 'change' },
  ],
}

/**
 * 提交表单
 * @param values 表单提交的值
 */
const handleSubmit = async (values: any) => {
  // 校验密码是否一致
  if (formData.userPassword !== formData.checkPassword) {
    message.error('两次输入的密码不一致')
    return
  }
  const res = await userRegisterUsingPost(values)
  // 注册成功，跳转到登录页面
  if (res.data.code === 0 && res.data.data) {
    message.success('注册成功')
    router.push({
      path: '/auth/login',
      replace: true,
    })
  } else {
    message.error(res.data.message || '注册失败')
  }
}
</script>

<style scoped lang="scss">
#user-register-page {
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
    text-align: right;
    color: #7d7d7d;
    font-size: 15px;
    margin-bottom: 20px;
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

#user-register-page .ant-input-affix-wrapper {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 100px;
  background: var(--auth-input-bg);
}

#user-register-page :deep(.ant-input-prefix) {
  margin: 0 12px 0 8px;
  font-size: 17px;
}

#user-register-page :deep(.ant-input-suffix) {
  margin: 0 5px;
  font-size: 17px;
}

#user-register-page :deep(.ant-input) {
  background: transparent;
  font-size: 16px;
  font-weight: 500;
}

#user-register-page :deep(.ant-input)::placeholder {
  font-size: 16px;
  font-weight: 500;
}
</style>
