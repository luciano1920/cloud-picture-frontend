import request from '@/libs/axios/request'

/** 发表评论 POST /comment/add */
export async function addCommentUsingPost(
  body: COMMENT_API.CommentAddRequest,
  options?: { [key: string]: any },
) {
  return request<COMMENT_API.BaseResponseCommentVO_>('/comment/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 删除评论 POST /comment/delete */
export async function deleteCommentUsingPost(
  body: COMMENT_API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<COMMENT_API.BaseResponseBoolean_>('/comment/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 切换点踩状态 POST /comment/dislike/${param0} */
export async function toggleDislikeUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: COMMENT_API.toggleDislikeUsingPOSTParams,
  options?: { [key: string]: any },
) {
  const { commentId: param0, ...queryParams } = params
  return request<COMMENT_API.BaseResponseBoolean_>(`/comment/dislike/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...options,
  })
}

/** 切换点赞状态 POST /comment/like/${param0} */
export async function toggleLikeUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: COMMENT_API.toggleLikeUsingPOSTParams,
  options?: { [key: string]: any },
) {
  const { commentId: param0, ...queryParams } = params
  return request<COMMENT_API.BaseResponseBoolean_>(`/comment/like/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...options,
  })
}

/** 分页获取顶层评论（默认最热，可切换最新） POST /comment/list/page */
export async function listTopByPageUsingPost(
  body: COMMENT_API.CommentQueryRequest,
  options?: { [key: string]: any },
) {
  return request<COMMENT_API.BaseResponsePageCommentVO_>('/comment/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 获取评论预览（默认最热 3 条，未登录可访问） POST /comment/preview/list */
export async function listPreviewTopUsingPost(
  body: COMMENT_API.CommentQueryRequest,
  options?: { [key: string]: any },
) {
  return request<COMMENT_API.BaseResponseListCommentVO_>('/comment/preview/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 分页获取评论回复 POST /comment/reply/list/page */
export async function listRepliesByPageUsingPost(
  body: COMMENT_API.CommentQueryRequest,
  options?: { [key: string]: any },
) {
  return request<COMMENT_API.BaseResponsePageCommentVO_>('/comment/reply/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}
