declare namespace USER_API {
  interface BaseResponseBoolean_ {
    code?: number
    data?: boolean
    message?: string
  }

  interface BaseResponseLoginUserVO_ {
    code?: number
    data?: LoginUserVO
    message?: string
  }

  interface BaseResponseLong_ {
    code?: number
    data?: number
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

  interface BaseResponsePageUserVO_ {
    code?: number
    data?: PageUserVO_
    message?: string
  }

  interface DeleteRequest {
    id?: number
  }

  interface getUserByIdUsingGETParams {
    /** id */
    id?: number
  }

  interface getUserVOByIdUsingGETParams {
    /** id */
    id?: number
  }

  interface LoginUserVO {
    createTime?: string
    editTime?: string
    id?: number
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  interface PageUserVO_ {
    current?: number
    pages?: number
    records?: UserVO[]
    size?: number
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

  interface UserDeleteRequest {
    password?: string
  }

  interface UserEditRequest {
    userAvatar?: string
    userName?: string
    userProfile?: string
  }

  interface UserLoginRequest {
    userAccount?: string
    userPassword?: string
  }

  interface UserPasswordChangeRequest {
    checkPassword?: string
    newPassword?: string
    oldPassword?: string
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

  interface UserRegisterRequest {
    checkPassword?: string
    userAccount?: string
    userName?: string
    userPassword?: string
  }

  interface UserUpdateRequest {
    id?: number
    userAvatar?: string
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
