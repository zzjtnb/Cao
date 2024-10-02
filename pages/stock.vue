<script lang="ts" setup>
import { MMessage } from 'shuimo-ui'

const tag = reactive({
  up: '涨停计算器',
  target: '目标价计算器',
  limit: '涨停次数计算器',
})
const stock = reactive({
  price: null as number | null,
  target: null as number | null,
  market: 'normal',
  limit: 1,
  type: 'up' as 'up' | 'target' | 'limit',
  show: false,
  result: null as any,
})
const stockLimit = useStock()
console.log('🚀 ~ stockLimit:', stockLimit)
function calculate(e: Event) {
  e.preventDefault()
  if (!stock.price) {
    MMessage.error({ content: '请输入股票价格' })
    return
  }
  stockLimit.closePrice = +stock.price
  stockLimit.marketType = stock.market

  // 计算单次涨停后的价格
  if (stock.type === 'up') {
    stock.result = stockLimit.calculateLimitUp()
    console.log(`单次涨停价: ${stock.result} 元`)
  }
  // 计算达到目标价所需的涨停次数
  if (stock.type === 'target') {
    if (!stock.target) {
      MMessage.error({ content: '请输入目标价' })
      return
    }
    const targetPrice = +stock.target // 目标价
    stock.result = stockLimit.calculateLimitUpTimes(targetPrice)
    console.log(`需要 ${stock.result} 次涨停才能达到目标价 ${targetPrice} 元`)
  }
  // 计算经过指定涨停次数后的价格
  if (stock.type === 'limit') {
    if (!stock.limit) {
      MMessage.error({ content: '请输入涨停次数' })
      return
    }
    const limitUpCount = +stock.limit // 涨停次数
    stock.result = stockLimit.calculatePriceAfterLimitUps(limitUpCount)
    console.log(`经过 ${limitUpCount} 次涨停后的价格: ${stock.result} 元`)
  }
  stock.show = true
}
</script>

<template>
  <div class="stock">
    <div class="tag">
      <template v-for="(item, key) in tag" :key="key">
        <m-tag :type="stock.type === key ? 'primary' : ''" @click="stock.type = key">
          {{ item }}
        </m-tag>
      </template>
    </div>
    <m-form inline>
      <m-form-item label="股价:">
        <m-input v-model="stock.price" placeholder="请输入股价" type="number" />
      </m-form-item>
      <m-form-item label="市场:">
        <m-select v-model="stock.market" input-param="name" option-param="name" value-param="key" :options="StockCalculator.rates" />
      </m-form-item>
      <m-form-item v-if="stock.type === 'limit'" label="涨停板:">
        <m-input v-model="stock.limit" placeholder="请输入涨停板" type="number" />
      </m-form-item>
      <m-form-item v-if="stock.type === 'target'" label="目标价:">
        <m-input v-model="stock.target" placeholder="请输入目标价" type="number" />
      </m-form-item>
      <m-form-item class="submit">
        <m-button text="计算" @click="calculate" />
      </m-form-item>
    </m-form>
    <m-dialog v-model:visible="stock.show" :mask="{ show: false }" :teleport="{ to: '.stock' }">
      <div v-if="stock.type === 'up'" class="result">
        单次涨停价: <span>{{ stock.result }}</span> 元
      </div>
      <div v-if="stock.type === 'target'" class="result">
        需要 <span>{{ stock.result }}</span> 次涨停才能达到目标价 <span>{{ stock.target }}</span> 元
      </div>
      <div v-if="stock.type === 'limit'" class="result">
        经过 <span> {{ stock.limit }}</span> 次涨停后的价格: <span>{{ stock.result }}</span> 元
      </div>
    </m-dialog>
  </div>
</template>

<style scoped lang="scss">
.stock {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 10px 100px;

  .tag {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
    gap: 10px;
  }

  :deep(form) {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;

    .m-form-item-label {
      text-align: end;
    }

    .submit {
      text-align: center;
    }
  }

  :deep(.m-dialog) {
    display: flex;
    align-items: center;
    justify-content: center;

    @media (width <= 768px) {
      width: 80%;

      .m-model-close-btn {
        left: 80%;
      }
    }

    .result {
      font-size: 16px;
      font-weight: bold;

      span {
        color: #b31f45;
      }
    }
  }
}
</style>
