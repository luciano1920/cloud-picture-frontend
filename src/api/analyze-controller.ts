import request from '@/libs/axios/request'

/** 空间图片分类分析 POST /analyze/category */
export async function analyzeSpaceCategoryUsingPost(
  body: ANALYZE_API.SpaceCategoryAnalyzeRequest,
  options?: { [key: string]: any },
) {
  return request<ANALYZE_API.BaseResponseListSpaceCategoryAnalyzeResponse_>('/analyze/category', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 空间使用排行分析 POST /analyze/rank */
export async function analyzeSpaceRankUsingPost(
  body: ANALYZE_API.SpaceRankAnalyzeRequest,
  options?: { [key: string]: any },
) {
  return request<ANALYZE_API.BaseResponseListSpace_>('/analyze/rank', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 空间图片大小分析 POST /analyze/size */
export async function analyzeSpaceSizeUsingPost(
  body: ANALYZE_API.SpaceSizeAnalyzeRequest,
  options?: { [key: string]: any },
) {
  return request<ANALYZE_API.BaseResponseListSpaceSizeAnalyzeResponse_>('/analyze/size', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 空间图片标签分析 POST /analyze/tag */
export async function analyzeSpaceTagUsingPost(
  body: ANALYZE_API.SpaceTagAnalyzeRequest,
  options?: { [key: string]: any },
) {
  return request<ANALYZE_API.BaseResponseListSpaceTagAnalyzeResponse_>('/analyze/tag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 空间使用状态分析 POST /analyze/usage */
export async function analyzeSpaceUsageUsingPost(
  body: ANALYZE_API.SpaceUsageAnalyzeRequest,
  options?: { [key: string]: any },
) {
  return request<ANALYZE_API.BaseResponseSpaceUsageAnalyzeResponse_>('/analyze/usage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}

/** 空间用户上传行为分析 POST /analyze/user */
export async function analyzeSpaceUserUsingPost(
  body: ANALYZE_API.SpaceUserAnalyzeRequest,
  options?: { [key: string]: any },
) {
  return request<ANALYZE_API.BaseResponseListSpaceUserAnalyzeResponse_>('/analyze/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...options,
  })
}
