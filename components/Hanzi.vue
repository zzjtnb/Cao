<script lang="ts" setup>
import HanziWriter, { type ColorOptions, type DimensionOptions, type OnCompleteFunction } from 'hanzi-writer'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  options: {
    type: Object,
    default: () => ({}),
  },
})

const splitText = ref<string[]>([])
const writers = ref<(HanziWriter | null)[]>([]) // 保存所有 HanziWriter 实例
const hanziRefs = ref<(Element | null)[]>([]) // 用于存储每个汉字的 DOM 引用

const DEFAULT_BOX_WIDTH = 100
const DEFAULT_BOX_HEIGHT = 100

onMounted(async () => {
  splitText.value = props.text.split('')
  await nextTick()

  splitText.value.forEach((char: string, index: number) => {
    if (!char.trim()) {
      return
    }
    const hanziBox = hanziRefs.value[index] // 使用 refs 数组获取元素引用

    if (hanziBox) {
      const defaultOptions = {
        width: DEFAULT_BOX_WIDTH,
        height: DEFAULT_BOX_HEIGHT,
        strokeAnimationSpeed: 100,
        delayBetweenStrokes: 100,
      }
      const writer = HanziWriter.create(hanziBox as HTMLElement, char, { ...defaultOptions, ...props.options })
      writers.value[index] = writer // 保存实例
    }
  })
})

async function hideAll(type?: 'outline' | 'character') {
  const hideMethods = {
    outline: (writer: HanziWriter) => new Promise(resolve => writer.hideOutline({ duration: 0, onComplete: resolve })),
    character: (writer: HanziWriter) => new Promise(resolve => writer.hideCharacter({ duration: 0, onComplete: resolve })),
  }

  const hidePromises = writers.value.map((writer: HanziWriter | null) => {
    if (!writer)
      return Promise.resolve() // 如果 writer 为 null，返回已解决的 Promise
    const promises = (type ? [hideMethods[type]] : Object.values(hideMethods)).map(method => method(writer))
    return Promise.all(promises)
  })

  return Promise.all(hidePromises) // 直接返回
}

async function animateAll() {
  await hideAll()
  for (const writer of writers.value) {
    if (writer) {
      // 使用 requestAnimationFrame 确保动画的平滑执行
      await new Promise<void>((resolve) => {
        requestAnimationFrame(async () => {
          await writer.animateCharacter()
          resolve()
        })
      })
    }
  }
}

function setColor(
  colorName: keyof ColorOptions,
  colorVal: string,
  options?: {
    duration?: number
    onComplete?: OnCompleteFunction
  },
) {
  writers.value.forEach((writer: HanziWriter | null) => {
    if (writer) {
      writer.updateColor(colorName, colorVal, options)
    }
  })
}

function updateDimensions(options: Partial<DimensionOptions> = {}) {
  writers.value.forEach((writer: HanziWriter | null) => {
    if (writer) {
      writer.updateDimensions(options)
    }
  })
}

defineExpose({
  animateAll,
  setColor,
  hideAll,
  writers,
})
</script>

<template>
  <p class="hanzi-writer">
    <span v-for="(char, index) in splitText" :key="`hanzi-${char}-${index}`" :ref="(el) => (hanziRefs[index] = el as unknown as Element)" class="hanzi-container" />
  </p>
</template>

<style scoped>
.hanzi-writer {
  /* display: flex; */
}
</style>
