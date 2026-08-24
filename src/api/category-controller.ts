import request from '@/libs/axios/request'

/** 新增图片分类 POST /category/add */
export async function addCategoryUsingPost(
  body: CATEGORY_API.CategoryAddRequest,
  options?: { [key: string]: any },
) {
  return request<CATEGORY_API.BaseResponseLong_>('/category/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 删除图片分类 POST /category/delete */
export async function deleteCategoryUsingPost(
  body: CATEGORY_API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<CATEGORY_API.BaseResponseBoolean_>('/category/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 获取图片分类详情 GET /category/get */
export async function getCategoryByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: CATEGORY_API.getCategoryByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<CATEGORY_API.BaseResponseCategoryVO_>('/category/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...options,
  })
}

/** 获取所有图片分类名称 GET /category/list */
export async function listAllCategoryNamesUsingGet(options?: { [key: string]: any }) {
  return request<CATEGORY_API.BaseResponseListString_>('/category/list', {
    method: 'GET',
    ...options,
  })
}

/** 分页获取图片分类列表 POST /category/list/page */
export async function listCategoryByPageUsingPost(
  body: CATEGORY_API.CategoryQueryRequest,
  options?: { [key: string]: any },
) {
  return request<CATEGORY_API.BaseResponsePageCategoryVO_>('/category/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 更新图片分类 POST /category/update */
export async function updateCategoryUsingPost(
  body: CATEGORY_API.CategoryUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<CATEGORY_API.BaseResponseBoolean_>('/category/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}
