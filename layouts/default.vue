<script setup></script>

<template>
  <m-rice-paper class="default">
    <Header />
    <m-divider />
    <main class="container mx-auto">
      <slot />
    </main>
  </m-rice-paper>
</template>

<style>
.default {
  /* background: rgba(255, 255, 255, 0.5); */
  height: 100%;

  main {
    height: 100%;
  }
}
</style>
