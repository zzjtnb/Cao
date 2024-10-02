<script lang="ts" setup>
import type { HanziWriterOptions } from 'hanzi-writer'
import HanziWriter from 'hanzi-writer'

useHead({ title: '汉字书写' })
const write = reactive({
  text: '争霸世界逐鹿全球',
  list: [] as string[],
  refs: [] as HTMLElement[],
  config: {
    width: 100,
    height: 100,
    padding: 5,
    showOutline: false,
    showCharacter: false,
    strokeColor: '#f03752', // 字的颜色
    strokeAnimationSpeed: 5, // 5x normal speed
    delayBetweenStrokes: 20, // milliseconds
  },
})

function setRef(el: any, index: number) {
  write.refs[index] = el
}
/* 文字书写方法 */
function drawCharacter(index = 0, config: Partial<HanziWriterOptions>) {
  if (!(write.refs[index] instanceof HTMLElement))
    return
  const textWriter = HanziWriter.create(write.refs[index], write.list[index], config)
  textWriter.animateCharacter().then(() => {
    if (write.list[index + 1])
      drawCharacter(index + 1, config)
  })
}
write.list = write.text.split('')
onMounted(() => {
  drawCharacter(0, write.config)
})

const hanziWriter = ref()
function runAnimation() {
  if (hanziWriter.value) {
    hanziWriter.value?.animateAll() // 调用子组件的 animateAll 方法
  }
}

function changeColor() {
  if (hanziWriter.value) {
    hanziWriter.value?.setColor('strokeColor', '#f03752') // 调用子组件的 setColor 方法
    hanziWriter.value?.setColor('radicalColor', '#f03752') // 调用子组件的 setColor 方法
  }
}
</script>

<template>
  <div class="hanzi">
    <div>
      <h1>汉字书写动画</h1>
      <Hanzi ref="hanziWriter" text="你好" />
      <!-- 也可以传入有空格的字符串 -->
      <Hanzi text="你 好" />
      <button @click="runAnimation">
        重新执行动画
      </button>
      <button @click="changeColor">
        改变颜色
      </button>
    </div>
    <div class="hanzi-box">
      <div v-for="(item, index) in write.text" :id="`hanzi${index}`" :ref="(el) => setRef(el, index)" :key="index" class="text" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.hanzi-box {
  display: flex;
  height: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.text {
  width: 100px;
  height: 100px;
  font-size: 1.06rem;
  font-weight: 800;
}
</style>
