<script setup lang="ts">
// const { $hello } = useNuxtApp();
// $hello('World')

// 服务端
if (process.server) {
  // 访问运行时 nuxt 应用程序实例
  // const nuxtApp = useNuxtApp();
  // console.log('🚀 ~ file: app.vue ~ line 14 ~ useMyComposable ~ nuxtApp', nuxtApp);
}

// 客户端
if (process.client) {
  // 为了保证首屏渲染性能，在页面 onload 完之后注册 Service Worker
  // 不使用 window.onload 以免冲突
  // console.log('页面加载完毕');
}
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <!-- here -->
    <NuxtPage />
  </NuxtLayout>
</template>
