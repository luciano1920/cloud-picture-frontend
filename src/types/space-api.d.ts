declare namespace SPACE_API {
  interface BaseResponseBoolean_ {
    code?: number
    data?: boolean
    message?: string
  }

  interface BaseResponseListSpaceLevel_ {
    code?: number
    data?: SpaceLevel[]
    message?: string
  }

  interface BaseResponseLong_ {
    code?: number
    data?: number
    message?: string
  }

  interface BaseResponseSpace_ {
    code?: number
    data?: Space
    message?: string
  }

  interface BaseResponseSpaceVO_ {
    code?: number
    data?: SpaceVO
    message?: string
  }

  interface BaseResponsePageSpace_ {
    code?: number
    data?: PageSpace_
    message?: string
  }

  interface BaseResponsePageSpaceVO_ {
    code?: number
    data?: PageSpaceVO_
    message?: string
  }

  interface DeleteRequest {
    id?: number
  }

  interface getSpaceByIdUsingGETParams {
    /** id */
    id?: number
  }

  interface getSpaceVOByIdUsingGETParams {
    /** id */
    id?: number
  }

  interface PageSpace_ {
    current?: number
    pages?: number
    records?: Space[]
    size?: number
    total?: number
  }

  interface PageSpaceVO_ {
    current?: number
    pages?: number
    records?: SpaceVO[]
    size?: number
    total?: number
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

  interface SpaceAddRequest {
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
  }

  interface SpaceEditRequest {
    id?: number
    spaceName?: string
  }

  interface SpaceLevel {
    maxCount?: number
    maxSize?: number
    text?: string
    value?: number
  }

  interface SpaceQueryRequest {
    current?: number
    id?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
    userId?: number
  }

  interface SpaceUpdateRequest {
    id?: number
    maxCount?: number
    maxSize?: number
    spaceLevel?: number
    spaceName?: string
  }

  interface SpaceVO {
    createTime?: string
    editTime?: string
    id?: number
    maxCount?: number
    maxSize?: number
    permissionList?: string[]
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
    totalCount?: number
    totalSize?: number
    updateTime?: string
    user?: UserVO
    userId?: number
  }
}
