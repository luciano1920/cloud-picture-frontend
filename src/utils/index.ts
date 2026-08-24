import { saveAs } from 'file-saver'

/**
 * 获取当前页面 URL 中的查询参数（即 ? 后的部分）
 * @returns {Object} 包含所有查询参数的对象，键和值均为字符串；若无参数则返回空对象
 */
export const getUrlQueryParamsUtil = (): Record<string, string> => {
  const search = window.location.search
  if (!search) return {}

  const params = new URLSearchParams(search)
  const result: Record<string, string> = {}

  params.forEach((value, key) => {
    result[key] = value
  })

  return result
}

/**
 * 补零工具方法：将 1-9 转换为 '01'-'09'
 * @param num 需要补零的数字
 * @returns 补零后的字符串，如 '01', '09', '10'
 */
export const padZero = (num: number | string): string => {
  return String(num).padStart(2, '0')
}

/**
 * 格式化日期时间数组为 YYYY-MM-DD HH:mm
 * @param dateArr 日期时间数组，格式为 [year, month, day, time]
 * @returns 格式化后的日期时间字符串
 * @throws 当数组长度不足4或包含空值时抛出错误
 */
export const formatDateTimeArray = (dateArr: (string | number)[]): string => {
  if (!Array.isArray(dateArr) || dateArr.length < 4) {
    throw new Error('dateArray 必须是包含至少4个元素的数组')
  }

  const [year, month, day, time] = dateArr

  if ([year, month, day, time].some((item) => item === undefined || item === null || item === '')) {
    throw new Error('dateArray 不能包含空值')
  }

  return `${year}-${month}-${day} ${time}`
}

/**
 * 将日期时间字符串（如 "2026-04-24 14:30"）转换为数组格式（如 ["2026", "04", "24", "14:30"]）
 * @param dateStr 日期时间字符串，格式为 "YYYY-MM-DD HH:mm"
 * @returns 转换后的数组 [year, month, day, time]，格式不正确时返回 null
 */
export const parseDateTimeToArray = (dateStr: string): string[] | null => {
  if (!dateStr) return null

  const [datePart, timePart] = dateStr.split(' ')
  if (!datePart || !timePart) return null

  const [year, month, day] = datePart.split('-')
  if (!year || !month || !day) return null

  return [year, month, day, timePart]
}

/**
 * 格式化文件大小
 * @param size
 */
export const formatSize = (size?: number) => {
  if (!size) return '未知'
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
  return (size / (1024 * 1024)).toFixed(2) + ' MB'
}

/**
 * 下载图片
 * @param url 图片下载地址
 * @param fileName 要保存为的文件名
 */
export function downloadImage(url?: string, fileName?: string) {
  if (!url) {
    return
  }
  saveAs(url, fileName)
}

/**
 * 将输入的字符串转换为标准的十六进制颜色值格式
 * @param input - 输入的颜色值字符串，可以是带0x前缀或纯十六进制格式
 * @returns 返回标准的#RRGGBB格式的十六进制颜色值
 */
export function toHexColor(input: string) {
  // 去掉 0x 前缀，如果存在的话
  const colorValue = input.startsWith('0x') ? input.slice(2) : input

  // 将剩余部分解析为十六进制数，再转成 6 位十六进制字符串
  // 确保输出始终是6位，不足的前面补0
  const hexColor = parseInt(colorValue, 16).toString(16).padStart(6, '0')

  // 返回标准 #RRGGBB 格式的十六进制颜色值
  return `#${hexColor}`
}
