import request from '@/libs/axios/request'

/** 用户中心-修改密码 POST /user/change-password */
export async function changeUserPasswordUsingPost(
  body: USER_API.UserPasswordChangeRequest,
  options?: { [key: string]: any },
) {
  return request<USER_API.BaseResponseBoolean_>('/user/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 用户管理-删除用户 POST /user/delete */
export async function deleteUserUsingPost(
  body: USER_API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<USER_API.BaseResponseBoolean_>('/user/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 用户中心-注销账号 POST /user/delete/self */
export async function deleteUserSelfUsingPost(
  body: USER_API.UserDeleteRequest,
  options?: { [key: string]: any },
) {
  return request<USER_API.BaseResponseBoolean_>('/user/delete/self', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 用户中心-编辑个人信息 POST /user/edit */
export async function editUserUsingPost(
  body: USER_API.UserEditRequest,
  options?: { [key: string]: any },
) {
  return request<USER_API.BaseResponseLoginUserVO_>('/user/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 用户管理-获取用户详情 GET /user/get */
export async function getUserByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: USER_API.getUserByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<USER_API.BaseResponseUser_>('/user/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...options,
  })
}

/** 用户中心-获取当前登录用户信息 GET /user/get/user-info */
export async function getLoginUserInfoUsingGet(options?: { [key: string]: any }) {
  return request<USER_API.BaseResponseLoginUserVO_>('/user/get/user-info', {
    method: 'GET',
    ...options,
  })
}

/** 用户管理-获取用户视图对象详情 GET /user/get/vo */
export async function getUserVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: USER_API.getUserVOByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<USER_API.BaseResponseUserVO_>('/user/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...options,
  })
}

/** 用户管理-分页查询用户 POST /user/list/page/vo */
export async function listUserVoByPageUsingPost(
  body: USER_API.UserQueryRequest,
  options?: { [key: string]: any },
) {
  return request<USER_API.BaseResponsePageUserVO_>('/user/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 用户中心-用户登录 POST /user/login */
export async function userLoginUsingPost(
  body: USER_API.UserLoginRequest,
  options?: { [key: string]: any },
) {
  return request<USER_API.BaseResponseLoginUserVO_>('/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 用户中心-用户退出登录 POST /user/logout */
export async function userLogoutUsingPost(options?: { [key: string]: any }) {
  return request<USER_API.BaseResponseBoolean_>('/user/logout', {
    method: 'POST',
    ...options,
  })
}

/** 用户中心-用户注册 POST /user/register */
export async function userRegisterUsingPost(
  body: USER_API.UserRegisterRequest,
  options?: { [key: string]: any },
) {
  return request<USER_API.BaseResponseLong_>('/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 用户管理-更新用户 POST /user/update */
export async function updateUserUsingPost(
  body: USER_API.UserUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<USER_API.BaseResponseBoolean_>('/user/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}
