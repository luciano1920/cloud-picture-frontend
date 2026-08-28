/** 布局项输入：调用方提供 key、宽高比和任意业务数据 */
export interface JustifyItem<T> {
  key: string
  index: number
  ratio: number
  data: T
  width: number
}

export interface JustifyRow<T> {
  /** 行首项在原始数组中的下标 */
  startIndex: number
  /** 最终渲染的布局行高 */
  height: number
  items: JustifyItem<T>[]
}

export interface JustifyOptions {
  /** 目标行高 */
  targetRowHeight: number
  /** 行高下限，低于则退图到下一行 */
  minRowHeight: number
  /** 间距 */
  gap: number
  /** 图片以外的附加高度（如信息栏） */
  extraHeight: number
}

/**
 * Justified（等高行）布局：贪心分行，行内按宽高比分宽
 */
export const justifyLayout = <T>(
  inputs: JustifyItem<T>[],
  containerWidth: number,
  options: JustifyOptions,
): JustifyRow<T>[] => {
  const { targetRowHeight, minRowHeight, gap, extraHeight } = options
  if (!containerWidth || !inputs.length) return []

  const resultRows: JustifyRow<T>[] = []
  let currentRowItems: JustifyItem<T>[] = []
  let ratioSum = 0 // 增量维护，避免每轮 reduce

  /**
   * 封行方法：根据当前行内图片比例和数量，计算行高，并确定每张图片的实际宽度
   * @param isLastRow 是否为最后一行
   */
  const flushLayoutRow = (isLastRow: boolean) => {
    if (!currentRowItems.length) {
      return
    }

    const gapSum = (currentRowItems.length - 1) * gap
    // 核心公式：所需行高 = (容器宽 - 间距总和) / 比例总和
    const imageHeight = isLastRow ? targetRowHeight : (containerWidth - gapSum) / ratioSum
    // 确定行高后就实际计算图片宽度
    currentRowItems.forEach((item) => (item.width = item.ratio * imageHeight))
    resultRows.push({
      startIndex: currentRowItems[0]!.index,
      height: imageHeight + extraHeight,
      items: currentRowItems,
    })

    // 一行处理完毕后就清空当前行和行内子项比例总和
    currentRowItems = []
    ratioSum = 0
  }

  inputs.forEach((input) => {
    const item: JustifyItem<T> = { ...input }

    currentRowItems.push(item)
    ratioSum += item.ratio

    // 行未满则继续；满了可能还需要连续退多张图（while），直到行高达标
    while (currentRowItems.length) {
      const gapSum = (currentRowItems.length - 1) * gap
      // 计算在对应的目标行高（targetRowHeight）下，当前行内图片比例和数量会占据的实际容器宽度
      const naturalWidth = ratioSum * targetRowHeight + gapSum

      // 当前实际宽度小于页面容器宽度 --- 行还没满
      if (naturalWidth < containerWidth) {
        break
      }

      // 如果实际宽度大于容器宽度，则退图到下一行
      // 预估所需行高 = (容器宽 - 间距总和) / 比例总和
      const estimatedRowHeight = (containerWidth - gapSum) / ratioSum
      // 当某行如果塞了太多竖图，反推出的行高可能只有 100px，小于最小兜底行高，所有图会被过度压缩。
      if (estimatedRowHeight < minRowHeight && currentRowItems.length > 1) {
        // 行太扁：退最后一张到下一行，继续检查剩余的行高是否达标
        const removed = currentRowItems.pop()!
        ratioSum -= removed.ratio
        flushLayoutRow(false)
        currentRowItems.push(removed)
        ratioSum += removed.ratio
      } else {
        flushLayoutRow(false) // 正常封行
        break
      }
    }
  })

  // 最后一行不满就不满，按目标行高左对齐展示
  flushLayoutRow(true)

  return resultRows
}
