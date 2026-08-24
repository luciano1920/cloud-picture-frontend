declare namespace FILE_API {
  interface BaseResponseString_ {
    code?: number
    data?: string
    message?: string
  }

  interface testDownloadFileUsingGETParams {
    /** filePath */
    filePath?: string
  }
}
