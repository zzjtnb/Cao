// 股票涨停计算器
export class StockCalculator {
  // 定义市场类型和对应的涨停比例（以百分比表示）
  static rates = [
    {
      name: '沪深',
      key: 'normal',
      ratio: 10,
    },
    {
      name: 'ST',
      key: 'st',
      ratio: 5,
    },
    {
      name: '科创板',
      key: 'kcb',
      ratio: 20,
    },
    {
      name: '创业板',
      key: 'cyb',
      ratio: 20,
    },
    {
      name: '北交所',
      key: 'bjs',
      ratio: 30,
    },
  ]

  /**
   * 创建一个 StockCalculator 实例
   * @param {number} [closePrice] - 前一交易日的收盘价，默认为 0
   * @param {string} [marketType] - 股票市场类型，默认为 'normal'
   */
  constructor(closePrice = 0, marketType = 'normal') {
    this.closePrice = closePrice // 使用传入的收盘价，默认为 0
    this.marketType = marketType.toLowerCase() // 转为小写
  }

  /**
   * 在计算时验证输入数据
   */
  validateInputs() {
    return this.isValidClosePrice() && this.isValidMarketType()
  }

  /**
   * 验证收盘价是否有效
   * @returns {boolean} 收盘价是否有效
   */
  isValidClosePrice() {
    const isValid = typeof this.closePrice === 'number' && this.closePrice > 0
    if (!isValid) {
      console.error('收盘价必须是大于0的有效数字')
    }
    return isValid
  }

  /**
   * 验证市场类型是否有效
   * @returns {boolean} 市场类型是否有效
   */
  isValidMarketType() {
    const isValid = StockCalculator.rates.some(rate => rate.key === this.marketType)
    if (!isValid) {
      console.error('未知的市场类型')
    }
    return isValid
  }

  /**
   * 验证涨停次数是否有效
   * @param {number} limitUpCount - 涨停次数
   * @returns {boolean} 是否有效
   */
  isValidLimitUpCount(limitUpCount) {
    const isValid = typeof limitUpCount === 'number' && limitUpCount >= 0
    if (!isValid) {
      console.error('涨停次数必须是一个非负整数')
    }
    return isValid
  }

  /**
   * 获取当前市场类型的涨停率
   * @returns {number} 当前市场类型的涨停率（小数形式）
   */
  getLimitRate() {
    const rateInfo = StockCalculator.rates.find(rate => rate.key === this.marketType)
    return rateInfo ? rateInfo.ratio / 100 : 0
  }

  /**
   * 计算单次涨停后的价格
   * @returns {string|null} 单次涨停后的价格或 null
   */
  calculateLimitUp() {
    if (!this.validateInputs())
      return null // 计算时验证

    return (this.closePrice * (1 + this.getLimitRate())).toFixed(2)
  }

  /**
   * 计算经过指定次数的涨停后的价格
   * @param {number} limitUpCount - 涨停次数，必须为非负整数
   * @returns {string|null} 指定次数涨停后的价格或 null
   */
  calculatePriceAfterLimitUps(limitUpCount) {
    if (!this.validateInputs() || !this.isValidLimitUpCount(limitUpCount))
      return null

    return (this.closePrice * (1 + this.getLimitRate()) ** limitUpCount).toFixed(2)
  }

  /**
   * 计算达到目标价所需的涨停次数
   * @param {number} targetPrice - 目标价，必须大于 0
   * @returns {number|null} 达到目标价所需的涨停次数或 null
   */
  calculateLimitUpTimes(targetPrice) {
    if (!this.validateInputs() || !this.isValidTargetPrice(targetPrice))
      return null

    if (targetPrice <= this.closePrice)
      return 0

    let currentPrice = this.closePrice
    let count = 0

    while (currentPrice < targetPrice) {
      currentPrice *= 1 + this.getLimitRate()
      count++
    }

    return count
  }

  /**
   * 验证目标价格是否有效
   * @param {number} targetPrice - 目标价格
   * @returns {boolean} 是否有效
   */
  isValidTargetPrice(targetPrice) {
    const isValid = typeof targetPrice === 'number' && targetPrice > 0
    if (!isValid) {
      console.error('目标价必须是大于0的有效数字')
    }
    return isValid
  }
}

// 使用函数创建 StockCalculator 实例
export function useStock(closePrice = 0, marketType = 'normal') {
  return new StockCalculator(closePrice, marketType)
}

// // 示例使用
// const calculator = useStock(4.96, 'normal') // 创建实例，传入前一交易日收盘价和市场类型
// // 计算单次涨停后的价格
// const limitUpPrice = calculator.calculateLimitUp()
// console.log(`单次涨停价: ${limitUpPrice} 元`)
// // 计算达到目标价所需的涨停次数
// const targetPrice = 10.3 // 目标价
// const times = calculator.calculateLimitUpTimes(targetPrice)
// console.log(`需要 ${times} 次涨停才能达到目标价 ${targetPrice} 元`)
// // 计算经过指定涨停次数后的价格
// const limitUpCount = 8 // 涨停次数
// const priceAfterLimitUps = calculator.calculatePriceAfterLimitUps(limitUpCount)
// console.log(`经过 ${limitUpCount} 次涨停后的价格: ${priceAfterLimitUps} 元`)
