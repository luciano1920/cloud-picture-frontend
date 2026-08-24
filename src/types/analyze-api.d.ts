declare namespace ANALYZE_API {
  interface BaseResponseCategoryVO_ {
    code?: number
    data?: CategoryVO
    message?: string
  }

  interface BaseResponseGetOutPaintingTaskResponse_ {
    code?: number
    data?: GetOutPaintingTaskResponse
    message?: string
  }

  interface BaseResponseListSpace_ {
    code?: number
    data?: Space[]
    message?: string
  }

  interface BaseResponseListSpaceCategoryAnalyzeResponse_ {
    code?: number
    data?: SpaceCategoryAnalyzeResponse[]
    message?: string
  }

  interface BaseResponseListSpaceSizeAnalyzeResponse_ {
    code?: number
    data?: SpaceSizeAnalyzeResponse[]
    message?: string
  }

  interface BaseResponseListSpaceTagAnalyzeResponse_ {
    code?: number
    data?: SpaceTagAnalyzeResponse[]
    message?: string
  }

  interface BaseResponseListSpaceUserAnalyzeResponse_ {
    code?: number
    data?: SpaceUserAnalyzeResponse[]
    message?: string
  }

  interface BaseResponsePicture_ {
    code?: number
    data?: Picture
    message?: string
  }

  interface BaseResponseSpace_ {
    code?: number
    data?: Space
    message?: string
  }

  interface BaseResponseSpaceUsageAnalyzeResponse_ {
    code?: number
    data?: SpaceUsageAnalyzeResponse
    message?: string
  }

  interface BaseResponseSpaceVO_ {
    code?: number
    data?: SpaceVO
    message?: string
  }

  interface BaseResponseTagVO_ {
    code?: number
    data?: TagVO
    message?: string
  }

  interface BaseResponseUser_ {
    code?: number
    data?: User
    message?: string
  }

  interface BaseResponseUserVO_ {
    code?: number
    data?: UserVO
    message?: string
  }

  interface GetOutPaintingTaskResponse {
    output?: Output1
    requestId?: string
  }

  interface Output {
    taskId?: string
    taskStatus?: string
  }

  interface Output1 {
    code?: string
    endTime?: string
    message?: string
    outputImageUrl?: string
    scheduledTime?: string
    submitTime?: string
    taskId?: string
    taskMetrics?: TaskMetrics
    taskStatus?: string
  }

  interface Parameters {
    addWatermark?: boolean
    angle?: number
    bestQuality?: boolean
    bottomOffset?: number
    leftOffset?: number
    limitImageSize?: boolean
    outputRatio?: string
    rightOffset?: number
    topOffset?: number
    xScale?: number
    yScale?: number
  }

  interface Space {
    createTime?: string
    deleted?: number
    editTime?: string
    id?: number
    maxCount?: number
    maxSize?: number
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
    totalCount?: number
    totalSize?: number
    updateTime?: string
    userId?: number
  }

  interface SpaceCategoryAnalyzeRequest {
    queryAll?: boolean
    queryPublic?: boolean
    spaceId?: number
  }

  interface SpaceCategoryAnalyzeResponse {
    category?: string
    count?: number
    totalSize?: number
  }

  interface SpaceRankAnalyzeRequest {
    topN?: number
  }

  interface SpaceSizeAnalyzeRequest {
    queryAll?: boolean
    queryPublic?: boolean
    spaceId?: number
  }

  interface SpaceSizeAnalyzeResponse {
    count?: number
    sizeRange?: string
  }

  interface SpaceTagAnalyzeRequest {
    queryAll?: boolean
    queryPublic?: boolean
    spaceId?: number
  }

  interface SpaceTagAnalyzeResponse {
    count?: number
    tag?: string
  }

  interface SpaceUsageAnalyzeRequest {
    queryAll?: boolean
    queryPublic?: boolean
    spaceId?: number
  }

  interface SpaceUsageAnalyzeResponse {
    countUsageRatio?: number
    maxCount?: number
    maxSize?: number
    sizeUsageRatio?: number
    usedCount?: number
    usedSize?: number
  }

  interface SpaceUser {
    createTime?: string
    id?: number
    spaceId?: number
    spaceRole?: string
    updateTime?: string
    userId?: number
  }

  interface SpaceUserAnalyzeRequest {
    queryAll?: boolean
    queryPublic?: boolean
    spaceId?: number
    timeDimension?: string
    userId?: number
  }

  interface SpaceUserAnalyzeResponse {
    count?: number
    period?: string
  }

  interface TaskMetrics {
    failed?: number
    succeeded?: number
    total?: number
  }

  interface User {
    createTime?: string
    deleted?: number
    editTime?: string
    id?: number
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userPassword?: string
    userProfile?: string
    userRole?: string
  }
}
