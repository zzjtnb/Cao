<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue'
import type HanziWriter from 'hanzi-writer'
import type { HanziWriterOptions } from 'hanzi-writer'
// 定义 HanziWriter 实例的类型
interface HanziWriterInstance {
  animateAll: () => Promise<void>
  setColor: (type: string, color: string) => void
  hideAll: (type?: 'outline' | 'character') => Promise<void>
  // 添加其他必要的方法和属性
  writers: Array<HanziWriter>
}
// 选择 HanziWriterOptions 中的一些属性
type HanziOptionsSubset = Pick<HanziWriterOptions, 'padding' | 'showOutline' | 'showCharacter' | 'strokeColor'>

// 定义 hanziOptions，类型为 Partial<HanziWriterOptions>
const hanziOptions: HanziOptionsSubset = {
  padding: 0,
  showOutline: false,
  showCharacter: true,
  strokeColor: '#3e3c3d',
}

const audioEl = ref<HTMLMediaElement | null>(null)
const trackEl = ref<HTMLTrackElement | null>(null)

const base = ref(1920)
const music = reactive({
  play: false,
  cues: [] as VTTCue[],
  currentCharacter: '', // 用于跟踪当前绘制的字符
  writers: [] as Array<HanziWriter[]>, // 存储 HanziWriter 实例
  refs: [] as HanziWriterInstance[], // 改为存储 HTMLElement 或 null
  cueID: 0,
})

// 组件挂载时的初始化操作
onMounted(async () => {
  await nextTick()
  console.log('页面数据更新完毕了')

  // 使用 loadeddata 事件
  audioEl.value?.addEventListener('loadeddata', () => {
    console.log('音频数据加载完成')
    if (trackEl.value && trackEl.value.track) {
      if (trackEl.value.track.cues) {
        // 当 track 的 cues 加载完毕后，绘制字符
        music.cues = Array.from(trackEl.value.track.cues as unknown as Iterable<VTTCue>)
        const clientWidth = document.body.clientWidth || 1920
        base.value = +((clientWidth - clientWidth * 0.1 - music.cues.length * 10) / music.cues.length).toFixed(2)
        // console.log('音轨数据:', music.cues)
        music.cues.map(async (cue: VTTCue) => {
          // 等待 refs 被设置后再绘制字符
          await nextTick()
          if (music.refs[+cue.id - 1]) {
            // drawCharacter(cue)
          }
        })
      }

      trackEl.value.addEventListener('cuechange', async () => {
        const activeCues = trackEl.value?.track?.activeCues
        if (activeCues && activeCues.length > 0) {
          const cue = activeCues[0] as VTTCue // 取第一个活动提示
          music.cueID = +cue.id

          const hanziWriterRef = music.refs[+cue.id - 1]
          if (hanziWriterRef) {
            const time = +(+((cue.endTime - cue.startTime) / cue.text.length).toFixed(2) * 100)
            hanziWriterRef?.setColor('strokeColor', '#f03752') // 调用子组件的 setColor 方法
            hanziWriterRef?.setColor('radicalColor', '#f03752') // 调用子组件的 setColor 方法
            // 调用子组件的 animateAll 方法
            hanziWriterRef?.animateAll().then(async () => {
              hanziWriterRef?.setColor('strokeColor', hanziOptions.strokeColor)
              hanziWriterRef?.setColor('radicalColor', hanziOptions.strokeColor)
            })
          }
        }
      })
    }
  })

  audioEl.value?.addEventListener('play', () => {
    music.play = true
    console.log('音频开始播放')
    // 这里可以执行其他你想要的代码，比如更新 UI 或记录日志
  })

  audioEl.value?.addEventListener('pause', () => {
    music.play = false
    console.log('音频暂停播放')
    // 这里可以执行其他你想要的代码，比如更新 UI 或记录日志
  })
})

function playMusic(index?: number) {
  console.log(audioEl.value)
  if (audioEl.value) {
    console.log('🚀 ~ playMusic ~ index:', index)
    if (music.play) {
      audioEl.value.pause() // 暂停音乐
    }
    else {
      if (Number.isInteger(index)) {
        console.log(music.cues[0])
        audioEl.value.currentTime = music.cues[index as number].startTime
      }
      audioEl.value.play() // 播放音乐
    }
  }
}

function setOptions(cue: VTTCue) {
  if (cue) {
    const time = +(+((cue.endTime - cue.startTime) / cue.text.length).toFixed(2) * 100)

    const clientWidth = document.body.clientWidth || 1920
    console.log('🚀 ~ setOptions ~ clientWidth:', clientWidth)
    if (clientWidth < 1000) {
      base.value = 36
    }

    return { ...hanziOptions, width: base.value, height: base.value, strokeAnimationSpeed: time, delayBetweenStrokes: time }
  }
}
</script>

<template>
  <div class="home">
    <div v-if="music.cues" class="kaiti-msz content" :class="[{ play: music.play }]">
      <template v-for="(item, index) in music.cues as unknown as Iterable<VTTCue>" :key="item.id + item.text">
        <Hanzi :ref="(el) => (music.refs[index] = el as unknown as HanziWriterInstance)" :text="item.text" :options="setOptions(item)" class="shadows" @click="playMusic(index)" />
      </template>
    </div>

    <div class="music" :class="[music.play ? 'active' : '']" @click="playMusic()">
      <!-- <img src="/images/music.png" :class="music.play ? 'active' : ''" /> -->
      <div class="icon" :class="{ active: music.play }" />
      <ClientOnly>
        <audio ref="audioEl" autoplay loop>
          <source src="/audio/曹操.mp3" type="audio/mp3">
          <track ref="trackEl" default kind="subtitles" src="/audio/曹操.vtt">
        </audio>
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped lang="scss">
.music {
  position: fixed;
  right: 40px;
  bottom: 10%;
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  box-shadow: 0 0 0 0.2rem #fff;
  transform: rotateZ(0);
  transition: 0.3s ease all;

  @media (width <= 768px) {
    width: 3rem;
    height: 3rem;
  }

  &.active {
    box-shadow:
      0 0 0 4px #fff7f7,
      0 30px 50px -15px #afb7c1;
  }

  & .icon {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #d3d0c9;
    background-image: url('/images/taiji.png');
    background-position: center center;
    background-size: cover;
    clip-path: circle(50% at 50% 50%);

    &.active {
      z-index: 1;
      animation: rotate-album-art 3s linear 0s infinite forwards;
    }

    @keyframes rotate-album-art {
      0% {
        transform: rotateZ(0);
      }

      100% {
        transform: rotateZ(360deg);
      }
    }
  }
}

.home {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  overflow-y: auto;
  scroll-behavior: smooth;

  // background: linear-gradient(to bottom, #c4b798, #e8b004);
  // mask-image: url('/images/seal.png');
  :deep(.content) {
    display: flex;
    width: 100%;
    height: auto;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 2rem 0;
    gap: 10px;
    writing-mode: vertical-rl;

    @media (width <= 768px) {
      align-items: center;
      margin-bottom: 4rem;
      writing-mode: revert;
    }

    .shadows {
      // width: 100%;
      animation: shadow 0.6s both;

      // font-size: 2em;
      font-weight: bold;
    }
  }
}

@keyframes shadow {
  0% {
    text-shadow: 0 0 0 transparent;
  }

  20% {
    text-shadow: 0 0 0 hsl(136deg 100% 20%);
  }

  40% {
    text-shadow: 0 0 0 hsl(136deg 100% 50%);
  }

  60% {
    text-shadow: 0 0 0 hsl(136deg 100% 70%);
  }

  80% {
    text-shadow: 0 0 0 hsl(136deg 100% 80%);
  }

  100% {
    text-shadow: 0 -6px 18px rgb(0 0 0 / 35%);
  }
}
</style>
