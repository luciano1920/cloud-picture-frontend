declare namespace CATEGORY_API {
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

  interface BaseResponseCategoryVO_ {
    code?: number
    data?: CategoryVO
    message?: string
  }

  interface BaseResponsePageCategoryVO_ {
    code?: number
    data?: PageCategoryVO_
    message?: string
  }

  interface CategoryAddRequest {
    categoryName?: string
  }

  interface CategoryQueryRequest {
    categoryName?: string
    current?: number
    id?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    userId?: number
  }

  interface CategoryUpdateRequest {
    categoryName?: string
    id?: number
  }

  interface CategoryVO {
    categoryName?: string
    id?: number
    userId?: number
  }

  interface DeleteRequest {
    id?: number
  }

  interface getCategoryByIdUsingGETParams {
    /** id */
    id?: number
  }

  interface PageCategoryVO_ {
    current?: number
    pages?: number
    records?: CategoryVO[]
    size?: number
    total?: number
  }
}
