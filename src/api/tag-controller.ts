import request from '@/libs/axios/request'

/** 新增图片标签 POST /tag/add */
export async function addTagUsingPost(
  body: TAG_API.TagAddRequest,
  options?: { [key: string]: any },
) {
  return request<TAG_API.BaseResponseLong_>('/tag/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 删除图片标签 POST /tag/delete */
export async function deleteTagUsingPost(
  body: TAG_API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<TAG_API.BaseResponseBoolean_>('/tag/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 获取图片标签详情 GET /tag/get */
export async function getTagByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: TAG_API.getTagByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<TAG_API.BaseResponseTagVO_>('/tag/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...options,
  })
}

/** 获取所有图片标签名称 GET /tag/list */
export async function listAllTagNamesUsingGet(options?: { [key: string]: any }) {
  return request<TAG_API.BaseResponseListString_>('/tag/list', {
    method: 'GET',
    ...options,
  })
}

/** 分页获取图片标签列表 POST /tag/list/page */
export async function listTagByPageUsingPost(
  body: TAG_API.TagQueryRequest,
  options?: { [key: string]: any },
) {
  return request<TAG_API.BaseResponsePageTagVO_>('/tag/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 更新图片标签 POST /tag/update */
export async function updateTagUsingPost(
  body: TAG_API.TagUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<TAG_API.BaseResponseBoolean_>('/tag/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}
