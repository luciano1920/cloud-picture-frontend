declare namespace PICTURE_API {
  interface BaseResponseString_ {
    code?: number
    data?: string
    message?: string
  }

  interface BaseResponseBoolean_ {
    code?: number
    data?: boolean
    message?: string
  }

  interface BaseResponseCreateOutPaintingTaskResponse_ {
    code?: number
    data?: CreateOutPaintingTaskResponse
    message?: string
  }

  interface BaseResponseGetOutPaintingTaskResponse_ {
    code?: number
    data?: GetOutPaintingTaskResponse
    message?: string
  }

  interface BaseResponseInt_ {
    code?: number
    data?: number
    message?: string
  }

  interface BaseResponseListImageSearchResult_ {
    code?: number
    data?: ImageSearchResult[]
    message?: string
  }

  interface BaseResponsePicture_ {
    code?: number
    data?: Picture
    message?: string
  }

  interface BaseResponseListPictureVO_ {
    code?: number
    data?: PictureVO[]
    message?: string
  }

  interface BaseResponsePagePicture_ {
    code?: number
    data?: PagePicture_
    message?: string
  }

  interface BaseResponsePagePictureVO_ {
    code?: number
    data?: PagePictureVO_
    message?: string
  }

  interface BaseResponsePictureTagCategoryVO_ {
    code?: number
    data?: PictureTagCategoryVO
    message?: string
  }

  interface BaseResponsePictureVO_ {
    code?: number
    data?: PictureVO
    message?: string
  }

  interface CategoryVO {
    categoryName?: string
    id?: number
    userId?: number
  }

  interface CreateOutPaintingTaskResponse {
    code?: string
    message?: string
    output?: Output
    requestId?: string
  }

  interface DeleteRequest {
    id?: number
  }

  interface downloadPictureUsingPOSTParams {
    /** pictureId */
    pictureId: number
  }

  interface getPictureByIdUsingGETParams {
    /** id */
    id?: number
  }

  interface getPictureOutPaintingUsingGETParams {
    /** taskId */
    taskId?: string
  }

  interface getPictureVOByIdUsingGETParams {
    /** id */
    id?: number
  }

  interface ImageSearchResult {
    fromUrl?: string
    thumbUrl?: string
  }

  interface increasePictureViewCountUsingPOSTParams {
    /** pictureId */
    pictureId: number
  }

  interface PagePicture_ {
    current?: number
    pages?: number
    records?: Picture[]
    size?: number
    total?: number
  }

  interface PagePictureVO_ {
    current?: number
    pages?: number
    records?: PictureVO[]
    size?: number
    total?: number
  }

  interface Picture {
    category?: string
    createTime?: string
    deleted?: number
    downloadCount?: number
    editTime?: string
    favoriteCount?: number
    id?: number
    introduction?: string
    likeCount?: number
    picColor?: string
    picFormat?: string
    picHeight?: number
    picName?: string
    picScale?: number
    picSize?: number
    picWidth?: number
    reviewMessage?: string
    reviewStatus?: number
    reviewTime?: string
    reviewerId?: number
    spaceId?: number
    tags?: string
    thumbnailUrl?: string
    updateTime?: string
    url?: string
    userId?: number
    viewCount?: number
  }

  interface PictureEditByBatchRequest {
    category?: string
    nameRule?: string
    pictureIdList?: number[]
    spaceId?: number
    tags?: string[]
  }

  interface PictureEditRequest {
    category?: string
    id?: number
    introduction?: string
    picName?: string
    tags?: string[]
  }

  interface PictureOutPaintingRequest {
    parameters?: Parameters
    pictureId?: number
  }

  interface PictureQueryRequest {
    category?: string
    current?: number
    endEditTime?: string
    id?: number
    introduction?: string
    nullSpaceId?: boolean
    pageSize?: number
    picFormat?: string
    picHeight?: number
    picName?: string
    picScale?: number
    picSize?: number
    picWidth?: number
    reviewMessage?: string
    reviewStatus?: number
    reviewTime?: string
    reviewerId?: number
    searchText?: string
    sortField?: string
    sortOrder?: string
    spaceId?: number
    startEditTime?: string
    tags?: string[]
    userId?: number
  }

  interface PictureReviewRequest {
    id?: number
    reviewMessage?: string
    reviewStatus?: number
  }

  interface PictureTagCategoryVO {
    categoryList?: string[]
    tagList?: string[]
  }

  interface PictureUpdateRequest {
    category?: string
    id?: number
    introduction?: string
    picName?: string
    tags?: string[]
  }

  interface PictureUploadByBatchRequest {
    count?: number
    namePrefix?: string
    searchText?: string
  }

  interface PictureUploadRequest {
    fileUrl?: string
    id?: number
    picName?: string
    spaceId?: number
  }

  interface PictureVO {
    category?: string
    createTime?: string
    downloadCount?: number
    editTime?: string
    favoriteCount?: number
    id?: number
    introduction?: string
    isFavorited?: boolean
    isLiked?: boolean
    likeCount?: number
    permissionList?: string[]
    picColor?: string
    picFormat?: string
    picHeight?: number
    picName?: string
    picScale?: number
    picSize?: number
    picWidth?: number
    spaceId?: number
    tags?: string[]
    thumbnailUrl?: string
    updateTime?: string
    url?: string
    user?: USER_API.UserVO
    userId?: number
    viewCount?: number
  }

  interface SearchPictureByColorRequest {
    picColor?: string
    spaceId?: number
  }

  interface SearchPictureByPictureRequest {
    pictureId?: number
  }

  interface toggleFavoriteUsingPOSTParams {
    /** pictureId */
    pictureId: number
  }

  interface toggleLikeUsingPOST1Params {
    /** pictureId */
    pictureId: number
  }

  interface uploadPictureUsingPOSTParams {
    fileUrl?: string
    id?: number
    picName?: string
    spaceId?: number
  }
}
