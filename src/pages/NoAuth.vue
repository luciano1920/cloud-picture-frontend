<template>
  <div id="no-auth-page">
    <a-result
      status="403"
      title="无权限，禁止访问"
      sub-title="抱歉，你没有权限访问该页面，可向管理员请求开通相关权限."
    >
      <template #extra>
        <a-button type="primary" ghost @click="$router.back()">返回上一页</a-button>
        <a-button type="primary" @click="$router.replace('/')">返回首页</a-button>
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
#no-auth-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
