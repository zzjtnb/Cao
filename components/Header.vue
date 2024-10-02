<script lang="ts" setup>
const menu = [
  {
    name: '首页',
    path: '/',
  },
  {
    name: '股票计算器',
    path: '/stock',
  },
  {
    name: '汉字',
    path: '/hanzi',
  },
]
</script>

<template>
  <header class="kaiti-msz">
    <nav class="m-color m-cursor-pointer">
      <ul>
        <li v-for="(item, idx) in menu" :key="idx">
          <NuxtLink :to="item.path">
            {{ item.name }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped lang="scss">
header {
  border-radius: 4px;
  background: #0f142333;
  color: #2b333e;
  font-size: 18px;
  font-weight: bold;
  text-align: center;

  nav {
    display: flex;
    justify-content: center;
    padding: 10px;

    ul {
      display: flex;
      align-items: center;
      padding: 0 2px;

      li {
        padding: 10px;

        a {
          &.active,
          &:hover {
            color: #f03752;
          }
        }
      }
    }
  }
}
</style>
