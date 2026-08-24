import request from '@/libs/axios/request'

/** 删除图片 POST /picture/delete */
export async function deletePictureUsingPost(
  body: PICTURE_API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<PICTURE_API.BaseResponseBoolean_>('/picture/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 下载图片 POST /picture/download/${param0} */
export async function downloadPictureUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: PICTURE_API.downloadPictureUsingPOSTParams,
  options?: { [key: string]: any },
) {
  const { pictureId: param0, ...queryParams } = params
  return request<PICTURE_API.BaseResponseString_>(`/picture/download/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...options,
  })
}

/** 编辑图片 POST /picture/edit */
export async function editPictureUsingPost(
  body: PICTURE_API.PictureEditRequest,
  options?: { [key: string]: any },
) {
  return request<PICTURE_API.BaseResponseBoolean_>('/picture/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 批量编辑图片 POST /picture/edit/batch */
export async function editPictureByBatchUsingPost(
  body: PICTURE_API.PictureEditByBatchRequest,
  options?: { [key: string]: any },
) {
  return request<PICTURE_API.BaseResponseBoolean_>('/picture/edit/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 切换图片收藏状态 POST /picture/favorite/${param0} */
export async function toggleFavoriteUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: PICTURE_API.toggleFavoriteUsingPOSTParams,
  options?: { [key: string]: any },
) {
  const { pictureId: param0, ...queryParams } = params
  return request<PICTURE_API.BaseResponseBoolean_>(`/picture/favorite/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...options,
  })
}

/** 获取当前用户收藏的图片列表 POST /picture/favorite/list/page/vo */
export async function listUserFavoritePictureByPageUsingPost(
  body: PICTURE_API.PictureQueryRequest,
  options?: { [key: string]: any },
) {
  return request<PICTURE_API.BaseResponsePagePictureVO_>('/picture/favorite/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 获取图片详情 GET /picture/get */
export async function getPictureByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: PICTURE_API.getPictureByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<PICTURE_API.BaseResponsePicture_>('/picture/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...options,
  })
}

/** 获取图片视图对象详情 GET /picture/get/vo */
export async function getPictureVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: PICTURE_API.getPictureVOByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<PICTURE_API.BaseResponsePictureVO_>('/picture/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...options,
  })
}

/** 切换图片点赞状态 POST /picture/like/${param0} */
export async function toggleLikeUsingPost1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: PICTURE_API.toggleLikeUsingPOST1Params,
  options?: { [key: string]: any },
) {
  const { pictureId: param0, ...queryParams } = params
  return request<PICTURE_API.BaseResponseBoolean_>(`/picture/like/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...options,
  })
}

/** 分页获取图片列表 POST /picture/list/page */
export async function listPictureByPageUsingPost(
  body: PICTURE_API.PictureQueryRequest,
  options?: { [key: string]: any },
) {
  return request<PICTURE_API.BaseResponsePagePicture_>('/picture/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 分页获取图片信息响应对象列表 POST /picture/list/page/vo */
export async function listPictureVoByPageUsingPost(
  body: PICTURE_API.PictureQueryRequest,
  options?: { [key: string]: any },
) {
  return request<PICTURE_API.BaseResponsePagePictureVO_>('/picture/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 分页获取图片信息响应对象列表（有缓存） POST /picture/list/page/vo/cache */
export async function listPictureVoByPageWithCacheUsingPost(
  body: PICTURE_API.PictureQueryRequest,
  options?: { [key: string]: any },
) {
  return request<PICTURE_API.BaseResponsePagePictureVO_>('/picture/list/page/vo/cache', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 创建 AI 扩图任务 POST /picture/out-painting/create-task */
export async function createPictureOutPaintingUsingPost(
  body: PICTURE_API.PictureOutPaintingRequest,
  options?: { [key: string]: any },
) {
  return request<PICTURE_API.BaseResponseCreateOutPaintingTaskResponse_>(
    '/picture/out-painting/create-task',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...options,
    },
  )
}

/** 查询 AI 扩图任务 GET /picture/out-painting/get-task */
export async function getPictureOutPaintingUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: PICTURE_API.getPictureOutPaintingUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<PICTURE_API.BaseResponseGetOutPaintingTaskResponse_>(
    '/picture/out-painting/get-task',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...options,
    },
  )
}

/** 审核图片 POST /picture/review */
export async function reviewPictureUsingPost(
  body: PICTURE_API.PictureReviewRequest,
  options?: { [key: string]: any },
) {
  return request<PICTURE_API.BaseResponseBoolean_>('/picture/review', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 按颜色搜图 POST /picture/search/color */
export async function searchPictureByColorUsingPost(
  body: PICTURE_API.SearchPictureByColorRequest,
  options?: { [key: string]: any },
) {
  return request<PICTURE_API.BaseResponseListPictureVO_>('/picture/search/color', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 以图搜图 POST /picture/search/picture */
export async function searchPictureByPictureUsingPost(
  body: PICTURE_API.SearchPictureByPictureRequest,
  options?: { [key: string]: any },
) {
  return request<PICTURE_API.BaseResponseListImageSearchResult_>('/picture/search/picture', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 获取图片标签和分类列表 GET /picture/tag-category */
export async function listPictureTagCategoryVoUsingGet(options?: { [key: string]: any }) {
  return request<PICTURE_API.BaseResponsePictureTagCategoryVO_>('/picture/tag-category', {
    method: 'GET',
    ...options,
  })
}

/** 更新图片 POST /picture/update */
export async function updatePictureUsingPost(
  body: PICTURE_API.PictureUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<PICTURE_API.BaseResponseBoolean_>('/picture/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 图片文件上传 POST /picture/upload */
export async function uploadPictureUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: PICTURE_API.uploadPictureUsingPOSTParams,
  body: {},
  file?: File,
  options?: { [key: string]: any },
) {
  const formData = new FormData()

  if (file) {
    formData.append('file', file)
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele]

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''))
        } else {
          formData.append(ele, new Blob([JSON.stringify(item)], { type: 'application/json' }))
        }
      } else {
        formData.append(ele, item)
      }
    }
  })

  return request<PICTURE_API.BaseResponsePictureVO_>('/picture/upload', {
    method: 'POST',
    params: {
      ...params,
    },
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...options,
  })
}

/** 批量抓取并创建图片 POST /picture/upload/batch */
export async function uploadPictureByBatchUsingPost(
  body: PICTURE_API.PictureUploadByBatchRequest,
  options?: { [key: string]: any },
) {
  return request<PICTURE_API.BaseResponseInt_>('/picture/upload/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 图片URL上传 POST /picture/upload/url */
export async function uploadPictureByUrlUsingPost(
  body: PICTURE_API.PictureUploadRequest,
  options?: { [key: string]: any },
) {
  return request<PICTURE_API.BaseResponsePictureVO_>('/picture/upload/url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 增加图片浏览量 POST /picture/view/${param0} */
export async function increasePictureViewCountUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: PICTURE_API.increasePictureViewCountUsingPOSTParams,
  options?: { [key: string]: any },
) {
  const { pictureId: param0, ...queryParams } = params
  return request<PICTURE_API.BaseResponseBoolean_>(`/picture/view/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...options,
  })
}
