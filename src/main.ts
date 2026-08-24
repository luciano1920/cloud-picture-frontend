import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'antdv-next/dist/reset.css' // 引入 antdv-next 的样式重置文件

import 'virtual:svg-icons-register' // 引入svg图标注册插件

import VueCropper from 'vue-cropper'
import 'vue-cropper/dist/index.css'

import '@/styles/global.css' // 引入全局样式
import '@/styles/fonts.css' // 引入全局字体样式
import '@/styles/nprogress.css' // 引入 NProgress 进度条样式

import './permission' // 引入全局权限控制

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(VueCropper)

app.mount('#app')
