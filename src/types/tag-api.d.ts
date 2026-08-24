declare namespace TAG_API {
  interface BaseResponseBoolean_ {
    code?: number
    data?: boolean
    message?: string
  }

  interface BaseResponseListString_ {
    code?: number
    data?: string[]
    message?: string
  }

  interface BaseResponseLong_ {
    code?: number
    data?: number
    message?: string
  }

  interface BaseResponsePageTagVO_ {
    code?: number
    data?: PageTagVO_
    message?: string
  }

  interface BaseResponseTagVO_ {
    code?: number
    data?: TagVO
    message?: string
  }

  interface DeleteRequest {
    id?: number
  }

  interface getTagByIdUsingGETParams {
    /** id */
    id?: number
  }

  interface PageTagVO_ {
    current?: number
    pages?: number
    records?: TagVO[]
    size?: number
    total?: number
  }

  interface TagAddRequest {
    tagName?: string
  }

  interface TagQueryRequest {
    current?: number
    id?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    tagName?: string
    userId?: number
  }

  interface TagUpdateRequest {
    id?: number
    tagName?: string
  }

  interface TagVO {
    id?: number
    tagName?: string
    userId?: number
  }
}
