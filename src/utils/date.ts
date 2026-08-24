import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

// 初始化 dayjs 插件和全局配置
dayjs.extend(utc)
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

// 定义统一的入参类型，支持各种常见格式
export type DateInput = string | number | Date | null | undefined

// 定义时间范围的返回类型
export interface DateRange {
  startTime: string
  endTime: string
}

/**
 * 核心解析函数（内部使用，处理各种入参的容错）
 * @param date 入参（时间戳、日期字符串、Date对象等）
 * @returns dayjs 对象或 null
 */
function parseToDate(date: DateInput): dayjs.Dayjs | null {
  if (!date && date !== 0) return null // 过滤 null、undefined、''

  // 1. 处理纯数字：自动兼容 10位(秒) 和 13位(毫秒) 时间戳
  if (typeof date === 'number') {
    // 小于 10000000000 肯定是秒级时间戳，dayjs 默认需要毫秒，所以乘 1000
    return dayjs(date < 10000000000 ? date * 1000 : date)
  }

  // 2. 处理字符串或 Date 对象，交给 dayjs 原生解析
  const d = dayjs(date)
  return d.isValid() ? d : null
}

/* ==========================================
 1. 万能格式化函数（最常用）
========================================== */
/**
 * 将任意合法时间转换为指定格式的字符串
 * @param date 时间
 * @param format 格式模板（默认 'YYYY-MM-DD HH:mm:ss'）
 * @returns 格式化后的时间，解析失败返回 '-'
 */
export function formatDate(date: DateInput, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = parseToDate(date)
  return d ? d.format(format) : '--'
}

/* ==========================================
 2. 针对特定业务场景的快捷方法
========================================== */
/** 只格式化成年月日 */
export function formatDateYMD(date: DateInput): string {
  return formatDate(date, 'YYYY-MM-DD')
}

/** 格式化成 Element Plus 月份选择器需要的格式 (如 202604) */
export function formatToMonthStr(date: DateInput): string {
  return formatDate(date, 'YYYYMM')
}

/** 格式化成中文年月日（如 2026年03月05日） */
export function formatDateCN(date: DateInput): string {
  return formatDate(date, 'YYYY年MM月DD日')
}

/** 格式化成中文全拼（如 2026年03月05日 15时35分24秒） */
export function formatDateTimeCN(date: DateInput): string {
  return formatDate(date, 'YYYY年MM月DD日 HH时mm分ss秒')
}

/** 格式化为时分秒 */
export function formatTime(date: DateInput): string {
  return formatDate(date, 'HH:mm:ss')
}

/**
 * 格式化时间段
 * @param range 包含 startTime 和 endTime 的对象
 * @returns 格式化后的时间段字符串，格式为 'YYYY/MM/DD HH:mm ~ YYYY/MM/DD HH:mm'。如果解析失败返回 '--'
 */
export function formatDateRange(range: DateRange, format: string = 'YYYY/MM/DD HH:mm'): string {
  const { startTime, endTime } = range

  // 使用已有的 formatDate 函数处理单个时间，减少重复逻辑
  const startStr = formatDate(startTime, format)
  const endStr = formatDate(endTime, format)

  // 如果任一时间解析失败，直接返回 '-'
  if (startStr === '--' || endStr === '--') {
    return '--'
  }

  return `${startStr} ~ ${endStr}`
}

/* ==========================================
 3. 日期格式转时间戳功能
========================================== */
/**
 * 将日期字符串或数字转换为时间戳
 * 支持: '2026-04-20', '2026/04/20', '2026-01' 等各种 dayjs 支持的格式
 * @param date 日期入参
 * @param isSeconds 是否返回秒级时间戳（默认 false，返回毫秒级时间戳）
 * @returns 成功返回时间戳数字，失败返回 0
 */
export function toTimestamp(date: DateInput, isSeconds: boolean = false): number {
  const d = parseToDate(date)
  if (!d) return 0

  return isSeconds ? d.unix() : d.valueOf()
}

/* ==========================================
 4. 处理后端传来的 UTC 时间或带时区时间
========================================== */
/**
 * 将后端的 UTC 时间（带 Z 或不带 Z）转为本地时间显示
 * @param date
 * @param format
 * @returns
 */
export function formatUTCToLocal(date: DateInput, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  if (!date) return '--'
  // 强制当做 UTC 时间解析，然后再转为本地时间输出
  const d = dayjs.utc(date).local()
  return d.isValid() ? d.format(format) : '--'
}

/* ==========================================
 5. 相对时间（朋友圈/评论时间常用）
========================================== */
/**
 * 转换为相对时间（如"刚刚"、"3分钟前"、"2天前"）
 * @param date
 * @returns
 */
export function formatRelative(date: DateInput): string {
  const d = parseToDate(date)
  return d ? d.fromNow() : '--'
}

/* ==========================================
 6. 日期计算与获取（常用于查询条件默认值）
========================================== */
/** 获取今天的开始和结束时间 */
export function getTodayRange(): DateRange {
  const startTime = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss')
  const endTime = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')
  return { startTime, endTime }
}

/** 获取当前月的第一天和最后一天 */
export function getCurrentMonthRange(): DateRange {
  const startTime = dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss')
  const endTime = dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss')
  return { startTime, endTime }
}

/** 获取当前月的最后一天 */
export function getCurrentMonthEnd(): string {
  return dayjs().endOf('month').format('YYYY-MM-DD')
}

/**
 * 判断给定日期是否为未来日期（即晚于今天）
 * 常用于考勤、预约等场景，禁用今天之后的日期
 * @param date 日期入参（支持各种常见格式）
 * @returns 如果是未来日期返回 true，否则返回 false。解析失败返回 false
 */
export function isFutureDate(date: DateInput): boolean {
  const d = parseToDate(date)
  if (!d) return false // 容错：解析失败的日期不算未来日期

  // 传入 'day' 作为粒度，表示只比较年月日，忽略时分秒
  // 例如：今天是 2026-05-02，那么 2026-05-02 的任何时间点都不会被判定为未来
  return d.isAfter(dayjs(), 'day')
}
