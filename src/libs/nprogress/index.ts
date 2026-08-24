import type { NProgressOptions } from 'nprogress'
import { EASING_FUNCTIONS } from '@/constants/easing'

export interface ProgressConfig extends NProgressOptions {
  /** 是否显示进度条 */
  show: boolean
}

export const PROGRESS_DEFAULT_CONFIG: Partial<ProgressConfig> = {
  /** CSS3 缓冲动画字符串，支持 ease、linear、ease-in、ease-out、ease-in-out 以及自定义 cubic-bezier 等 */
  easing: EASING_FUNCTIONS.smooth,
  /** 指定进度条的父容器，默认为 body */
  parent: 'body',
  /** 是否显示进度条，可通过环境变量控制 */
  show: true,
  /** 是否显示右侧的环形进度动画 */
  showSpinner: true,
  /** 是否开启自动递增模式 */
  trickle: true,
  /** 设置开始时最低百分比，范围 0-1 */
  minimum: 0.08,
  /** 动画速度，单位毫秒 */
  speed: 200,
}
