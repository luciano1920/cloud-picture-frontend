import request from '@/libs/axios/request'

/** 添加成员到空间 POST /space-user/add */
export async function addSpaceUserUsingPost(
  body: SPACE_USER_API.SpaceUserAddRequest,
  options?: { [key: string]: any },
) {
  return request<SPACE_USER_API.BaseResponseLong_>('/space-user/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 从空间移除成员 POST /space-user/delete */
export async function deleteSpaceUserUsingPost(
  body: SPACE_USER_API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<SPACE_USER_API.BaseResponseBoolean_>('/space-user/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 编辑空间成员信息 POST /space-user/edit */
export async function editSpaceUserUsingPost(
  body: SPACE_USER_API.SpaceUserEditRequest,
  options?: { [key: string]: any },
) {
  return request<SPACE_USER_API.BaseResponseBoolean_>('/space-user/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 查询某个成员在某个空间的信息 POST /space-user/get */
export async function getSpaceUserUsingPost(
  body: SPACE_USER_API.SpaceUserQueryRequest,
  options?: { [key: string]: any },
) {
  return request<SPACE_USER_API.BaseResponseSpaceUser_>('/space-user/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 查询成员信息列表 POST /space-user/list */
export async function listSpaceUserUsingPost(
  body: SPACE_USER_API.SpaceUserQueryRequest,
  options?: { [key: string]: any },
) {
  return request<SPACE_USER_API.BaseResponseListSpaceUserVO_>('/space-user/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 查询我加入的团队空间列表 POST /space-user/list/my */
export async function listMyTeamSpaceUsingPost(options?: { [key: string]: any }) {
  return request<SPACE_USER_API.BaseResponseListSpaceUserVO_>('/space-user/list/my', {
    method: 'POST',
    ...options,
  })
}
