import NProgress from 'nprogress'
import { PROGRESS_DEFAULT_CONFIG, type ProgressConfig } from '@/libs/nprogress'

/**
 * 进度条控制工具 Hook
 * @param config 自定义配置，会与默认配置合并
 */
export const useProgress = (config: Partial<ProgressConfig> = {}) => {
  const mergeConfig = { ...PROGRESS_DEFAULT_CONFIG, ...config }
  NProgress.configure(mergeConfig)

  /** 启动进度条 */
  function start() {
    if (!mergeConfig.show) return
    NProgress.start()
  }

  /** 结束进度条 */
  function done() {
    if (!mergeConfig.show || !NProgress.isStarted()) return
    NProgress.done()
  }

  return { start, done }
}
