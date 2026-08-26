import { h } from 'vue'
import { type RouteRecordRaw } from 'vue-router'
import {
  CloudOutlined,
  FolderOutlined,
  HomeOutlined,
  PictureOutlined,
  TagOutlined,
  UserOutlined,
} from '@antdv-next/icons'

import AdminLayout from '@/layouts/AdminLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { ACCESS_ENUM } from '@/constants/access'
import BasicLayout from '@/layouts/BasicLayout.vue'

export const routes: Array<RouteRecordRaw> = [
  // 无权限页面
  {
    path: '/auth/unauthorized',
    name: '无权限跳转到的页面',
    component: () => import('@/pages/auth/UnauthorizedPage.vue'),
    meta: {
      title: '无权限',
      show: false,
      access: ACCESS_ENUM.NOT_LOGIN,
    },
  },

  // 登录和注册页面使用 AuthLayout
  {
    path: '/auth',
    name: 'AuthLayout',
    component: AuthLayout,
    meta: {
      show: false,
    },
    children: [
      // 登录页面
      {
        path: 'login',
        name: '用户登录',
        component: () => import('@/pages/auth/UserLoginPage.vue'),
        meta: {
          title: '用户登录',
          show: false,
        },
      },
      // 注册页面
      {
        path: 'register',
        name: '用户注册',
        component: () => import('@/pages/auth/UserRegisterPage.vue'),
        meta: {
          title: '用户注册',
          show: false,
        },
      },
      // 用户忘记密码重置页
      // {
      //   path: 'forgot',
      //   name: '用户重置密码页',
      //   component: () => import('@/pages/auth/UserForgotPage.vue'),
      //   meta: {
      //     title: '忘记密码',
      //   },
      // },
    ],
  },

  // 其他页面使用 AdminLayout
  {
    path: '/admin',
    name: 'AdminLayout',
    component: AdminLayout,
    redirect: '/admin/user-manage',
    children: [
      {
        path: 'user-manage',
        name: '用户管理',
        component: () => import('@/pages/admin/UserManagePage.vue'),
        meta: {
          title: '用户管理',
          icon: () => h(UserOutlined),
          access: ACCESS_ENUM.ADMIN,
        },
      },
      {
        path: 'picture-manage',
        name: '图片管理',
        component: () => import('@/pages/admin/PictureManagePage.vue'),
        meta: {
          title: '图片管理',
          icon: () => h(PictureOutlined),
          access: ACCESS_ENUM.ADMIN,
        },
      },
      {
        path: 'space-manage',
        name: '空间管理',
        component: () => import('@/pages/admin/SpaceManagePage.vue'),
        meta: {
          title: '空间管理',
          icon: () => h(CloudOutlined),
          access: ACCESS_ENUM.ADMIN,
        },
      },
      {
        path: 'tag-manage',
        name: '标签管理',
        component: () => import('@/pages/admin/tag/TagManagePage.vue'),
        meta: {
          title: '标签管理',
          icon: () => h(TagOutlined),
          access: ACCESS_ENUM.ADMIN,
        },
      },
      {
        path: 'category-manage',
        name: '分类管理',
        component: () => import('@/pages/admin/category/CategoryManagePage.vue'),
        meta: {
          title: '分类管理',
          icon: () => h(FolderOutlined),
          access: ACCESS_ENUM.ADMIN,
        },
      },
      {
        path: 'space-user-manage/:id',
        name: '空间成员管理',
        component: () => import('@/pages/admin/SpaceUserManagePage.vue'),
        props: true,
        meta: {
          title: '空间成员管理',
          show: false,
          access: ACCESS_ENUM.USER,
        },
      },

      // // 主页
      // {
      //   path: '',
      //   name: '主页',
      //   component: () => import('@/pages/HomePage.vue'),
      //   meta: {
      //     icon: () => h(HomeOutlined),
      //     // access: ACCESS_ENUM.USER,
      //   },
      // },
      // // 用户空间跳转中间页
      // {
      //   path: 'my-space',
      //   name: '用户空间跳转中间页',
      //   component: () => import('@/pages/MySpacePage.vue'),
      //   meta: {
      //     show: false,
      //   },
      // },
      // // 兑换会员
      // {
      //   path: 'user/exchange-vip',
      //   name: '兑换会员',
      //   component: () => import('@/pages/user/UserExchangeVipPage.vue'),
      //   meta: {
      //     title: '兑换会员',
      //     access: ACCESS_ENUM.USER,
      //   },
      // },

      // // 图片管理部分
      // {
      //   path: 'add-picture',
      //   name: '创建图片',
      //   component: () => import('@/pages/AddPicturePage.vue'),
      //   meta: {
      //     title: '创建图片',
      //     access: ACCESS_ENUM.USER,
      //   },
      // },
      // {
      //   path: 'add-picture/batch',
      //   name: '批量创建图片',
      //   component: () => import('@/pages/AddPictureBatchPage.vue'),
      //   meta: {
      //     title: '批量创建图片',
      //     show: false,
      //     access: ACCESS_ENUM.ADMIN,
      //   },
      // },

      // // 图片详情
      // {
      //   path: 'picture/:id',
      //   name: '图片详情',
      //   component: () => import('@/pages/PictureDetailPage.vue'),
      //   props: true,
      //   meta: {
      //     title: '图片详情',
      //     show: false,
      //     access: ACCESS_ENUM.USER,
      //   },
      // },
      // // 搜索图片
      // {
      //   path: 'search-picture',
      //   name: '搜索图片',
      //   component: () => import('@/pages/SearchPicturePage.vue'),
      //   meta: {
      //     title: '搜索图片',
      //     show: false,
      //     access: ACCESS_ENUM.USER,
      //   },
      // },
      // // 空间管理部分
      // {
      //   path: 'add-space',
      //   name: '创建空间',
      //   component: () => import('@/pages/AddSpacePage.vue'),
      //   meta: {
      //     title: '创建空间',
      //     access: ACCESS_ENUM.USER,
      //   },
      // },

      // {
      //   path: 'space/:id',
      //   name: '空间详情',
      //   component: () => import('@/pages/SpaceDetailPage.vue'),
      //   props: true,
      //   meta: {
      //     title: '空间详情',
      //     show: false,
      //     access: ACCESS_ENUM.USER,
      //   },
      // },
      // {
      //   path: 'space-analyze',
      //   name: '空间分析',
      //   component: () => import('@/pages/SpaceAnalyzePage.vue'),
      //   props: true,
      //   meta: {
      //     title: '空间分析',
      //     show: false,
      //     access: ACCESS_ENUM.ADMIN,
      //   },
      // },
      // // 空间成员管理
    ],
  },

  // 其他页面使用 AdminLayout
  {
    path: '/',
    name: 'BasicLayout',
    component: BasicLayout,
    children: [
      // 主页
      {
        path: '',
        name: '主页',
        component: () => import('@/pages/home/HomePage.vue'),
        meta: {
          icon: () => h(HomeOutlined),
          // access: ACCESS_ENUM.USER,
        },
      },
    ],
  },
]
