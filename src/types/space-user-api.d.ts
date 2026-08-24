declare namespace SPACE_USER_API {
  interface BaseResponseBoolean_ {
    code?: number
    data?: boolean
    message?: string
  }

  interface BaseResponseListSpaceUserVO_ {
    code?: number
    data?: SpaceUserVO[]
    message?: string
  }

  interface BaseResponseLong_ {
    code?: number
    data?: number
    message?: string
  }

  interface BaseResponseSpaceUser_ {
    code?: number
    data?: SpaceUser
    message?: string
  }

  interface DeleteRequest {
    id?: number
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

  interface SpaceUser {
    createTime?: string
    id?: number
    spaceId?: number
    spaceRole?: string
    updateTime?: string
    userId?: number
  }

  interface SpaceUserAddRequest {
    spaceId?: number
    spaceRole?: string
    userId?: number
  }

  interface SpaceUserEditRequest {
    id?: number
    spaceRole?: string
  }

  interface SpaceUserQueryRequest {
    id?: number
    spaceId?: number
    spaceRole?: string
    userId?: number
  }

  interface SpaceUserVO {
    createTime?: string
    id?: number
    space?: SpaceVO
    spaceId?: number
    spaceRole?: string
    updateTime?: string
    user?: UserVO
    userId?: number
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

  interface UserEditRequest {
    userAvatar?: string
    userName?: string
    userProfile?: string
  }

  interface UserQueryRequest {
    current?: number
    id?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    userAccount?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  interface UserVO {
    createTime?: string
    id?: number
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
    vipCode?: string
    vipExpireTime?: string
    vipNumber?: number
  }
}
