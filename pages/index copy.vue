<script lang="ts" setup>
import { ref } from 'vue'
import HanziWriter from 'hanzi-writer'

const content = ref<HTMLElement | null>(null)
const audioEl = ref<HTMLMediaElement | null>(null)
const trackEl = ref<HTMLTrackElement | null>(null)

const music = reactive({
  play: false,
  cues: [] as VTTCue[],
  currentCharacter: '', // 用于跟踪当前绘制的字符
  writers: [] as Array<Array<HanziWriter>>, // 存储 HanziWriter 实例
  refs: [] as HTMLElement[],
  cueID: 0,
})
function setRefs(el: HTMLElement, index: number) {
  music.refs[index] = el as HTMLElement // 添加类型断言
}
// 绘制字符
function drawCharacter(cue: VTTCue) {
  const cues = music.cues || []
  const cueID = +cue.id - 1
  const clientWidth = content.value?.clientWidth || 1920
  const baseWidth = clientWidth < 1400 ? clientWidth / cues.length : 50
  if (!music.writers[cueID]) {
    music.writers[cueID] = []
  }
  const time = +(+((cue.endTime - cue.startTime) / cue.text.length).toFixed(2) * 100)

  for (const char of cue.text) {
    const writer = HanziWriter.create(music.refs[cueID], char, {
      width: baseWidth, // 画布宽度
      height: baseWidth, // 画布高度
      padding: 0, // 画布内边距
      outlineColor: '#f03752', // 字体大小
      strokeColor: '#f0d695', // 动画过程中显示的颜色
      showCharacter: false,
      strokeAnimationSpeed: time, // 动画的速度
      delayBetweenStrokes: time, // 动画过程中每个汉字之间的间隔
      onLoadCharDataSuccess() {
        // console.log(`汉字 ${char} 数据加载成功`)
        // writer.animateCharacter() // 加载成功后开始动画
      },
      onLoadCharDataError() {
        // console.error(`汉字 ${char} 数据加载失败`)
      },
    })
    music.writers[cueID].push(writer)
  }
}

// 组件挂载时的初始化操作
// onMounted(async () => {
//   await nextTick()
//   console.log('页面数据更新完毕了')
//   // 使用 loadeddata 事件
//   audioEl.value?.addEventListener('loadeddata', () => {
//     console.log('音频数据加载完成')
//     if (trackEl.value && trackEl.value.track) {
//       if (trackEl.value.track.cues) {
//         // 当 track 的 cues 加载完毕后，绘制字符
//         music.cues = Array.from(trackEl.value.track.cues as unknown as Iterable<VTTCue>)
//         console.log('音轨数据:', music.cues)
//         music.cues.map(async (cue: VTTCue) => {
//           // 等待 refs 被设置后再绘制字符
//           await nextTick()
//           if (music.refs[+cue.id - 1]) {
//             drawCharacter(cue)
//           }
//         })
//       }

//       trackEl.value.addEventListener('cuechange', async () => {
//         const activeCues = trackEl.value?.track?.activeCues
//         if (activeCues && activeCues.length > 0) {
//           const cue = activeCues[0] as VTTCue // 取第一个活动提示
//           music.cueID = +cue.id
//           // 动画效果
//           const writers = music.writers[+cue.id - 1]
//           if (writers) {
//             for (const writer of writers) {
//               await writer.animateCharacter().then(() => {
//                 writer.hideCharacter()
//               })
//             }
//           }
//         }
//       })
//     }
//   })

//   audioEl.value?.addEventListener('play', () => {
//     music.play = true
//     console.log('音频开始播放')
//     // 这里可以执行其他你想要的代码，比如更新 UI 或记录日志
//   })

//   audioEl.value?.addEventListener('pause', () => {
//     music.play = false
//     console.log('音频暂停播放')
//     // 这里可以执行其他你想要的代码，比如更新 UI 或记录日志
//   })
// })

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

const hanziWriter = ref()
function runAnimation() {
  if (hanziWriter.value) {
    hanziWriter.value?.animateAll() // 调用子组件的 animateAll 方法
  }
}

function changeColor() {
  if (hanziWriter.value) {
    hanziWriter.value?.setColor('strokeColor', '#ff0000') // 调用子组件的 setColor 方法
    hanziWriter.value?.setColor('radicalColor', '#ff0000') // 调用子组件的 setColor 方法
  }
}
</script>

<template>
  <div class="home">
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

    <div v-if="music.cues" ref="content" class="kaiti-msz content" :class="[{ play: music.play }]">
      <div v-for="(item, index) in music.cues as unknown as Iterable<VTTCue>" :key="item.id + item.text" class="shadows" @click="playMusic(index)">
        <!-- <p :ref="(el) => (music.refs[index] = el)"></p> -->
        <p v-show="index < music.cueID" :ref="(el) => setRefs(el as HTMLElement, index)" />
        <p v-show="index >= music.cueID">
          {{ item.text }}
        </p>
      </div>
    </div>

    <div class="music" :class="[music.play ? 'active' : '']" @click="playMusic()">
      <img src="/images/music.png" :class="music.play ? 'active' : ''">
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
  position: absolute;
  right: 40px;
  bottom: 10%;
  overflow: hidden;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  box-shadow: 0 0 0 5px #fff;
  transform: rotateZ(0);
  transition: 0.3s ease all;

  &.active {
    box-shadow:
      0 0 0 4px #fff7f7,
      0 30px 50px -15px #afb7c1;
  }

  &::before {
    position: absolute;
    z-index: 2;
    top: 50%;
    right: 0;
    left: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin: -10px auto 0;
    background-color: #d6dee7;
    box-shadow: inset 0 0 0 2px #fff;
    content: '';
  }

  & img {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;

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
  width: 100%;
  height: 100%;

  // background: linear-gradient(to bottom, #c4b798, #e8b004);
  // mask-image: url('/images/seal.png');
}

:deep(.content) {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: 100px auto;
  writing-mode: vertical-rl;

  .shadows {
    animation: shadow 0.6s both;
    font-size: 2em;
    font-weight: bold;
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
