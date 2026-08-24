import request from '@/libs/axios/request'

/** 创建空间 POST /space/add */
export async function addSpaceUsingPost(
  body: SPACE_API.SpaceAddRequest,
  options?: { [key: string]: any },
) {
  return request<SPACE_API.BaseResponseLong_>('/space/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 删除空间 POST /space/delete */
export async function deleteSpaceUsingPost(
  body: SPACE_API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<SPACE_API.BaseResponseBoolean_>('/space/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 编辑空间 POST /space/edit */
export async function editSpaceUsingPost(
  body: SPACE_API.SpaceEditRequest,
  options?: { [key: string]: any },
) {
  return request<SPACE_API.BaseResponseBoolean_>('/space/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 获取空间详情 GET /space/get */
export async function getSpaceByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: SPACE_API.getSpaceByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<SPACE_API.BaseResponseSpace_>('/space/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...options,
  })
}

/** 获取空间视图对象详情 GET /space/get/vo */
export async function getSpaceVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: SPACE_API.getSpaceVOByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<SPACE_API.BaseResponseSpaceVO_>('/space/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...options,
  })
}

/** 获取空间级别列表 GET /space/list/level */
export async function listSpaceLevelUsingGet(options?: { [key: string]: any }) {
  return request<SPACE_API.BaseResponseListSpaceLevel_>('/space/list/level', {
    method: 'GET',
    ...options,
  })
}

/** 分页获取空间列表 POST /space/list/page */
export async function listSpaceByPageUsingPost(
  body: SPACE_API.SpaceQueryRequest,
  options?: { [key: string]: any },
) {
  return request<SPACE_API.BaseResponsePageSpace_>('/space/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 分页获取空间信息响应对象列表 POST /space/list/page/vo */
export async function listSpaceVoByPageUsingPost(
  body: SPACE_API.SpaceQueryRequest,
  options?: { [key: string]: any },
) {
  return request<SPACE_API.BaseResponsePageSpaceVO_>('/space/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 更新空间 POST /space/update */
export async function updateSpaceUsingPost(
  body: SPACE_API.SpaceUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<SPACE_API.BaseResponseBoolean_>('/space/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}
