declare namespace COMMENT_API {
  interface BaseResponseBoolean_ {
    code?: number
    data?: boolean
    message?: string
  }

  interface BaseResponseCommentVO_ {
    code?: number
    data?: CommentVO
    message?: string
  }

  interface BaseResponseListCommentVO_ {
    code?: number
    data?: CommentVO[]
    message?: string
  }

  interface BaseResponsePageCommentVO_ {
    code?: number
    data?: PageCommentVO_
    message?: string
  }

  interface CommentAddRequest {
    content?: string
    contentType?: number
    contentUrl?: string
    parentId?: number
    replyUserId?: number
    targetId?: number
    targetType?: number
  }

  interface CommentQueryRequest {
    current?: number
    pageSize?: number
    parentId?: number
    sortField?: string
    sortOrder?: string
    targetId?: number
    targetType?: number
  }

  interface CommentVO {
    content?: string
    contentType?: number
    contentUrl?: string
    createTime?: string
    dislikeCount?: number
    editTime?: string
    id?: number
    isDisliked?: boolean
    isLiked?: boolean
    isTargetAuthor?: boolean
    likeCount?: number
    parentId?: number
    replyCount?: number
    replyUser?: UserVO
    replyUserId?: number
    targetId?: number
    targetType?: number
    updateTime?: string
    user?: UserVO
    userId?: number
  }

  interface DeleteRequest {
    id?: number
  }

  interface PageCommentVO_ {
    current?: number
    pages?: number
    records?: CommentVO[]
    size?: number
    total?: number
  }

  interface toggleDislikeUsingPOSTParams {
    /** commentId */
    commentId: number
  }

  interface toggleLikeUsingPOSTParams {
    /** commentId */
    commentId: number
  }
}
