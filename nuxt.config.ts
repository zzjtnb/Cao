// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-Hans-CN',
      },
      title: '争逐',
      titleTemplate: '%s - 争逐',
      meta: [
        { name: 'charset', content: 'utf-8' },
        { name: 'Author', content: '争逐' },
        { name: 'keywords', content: '争逐,编程,博客,政治,经济,军事,历史,天文,地理,人文,哲学' },
        { name: 'description', content: '纵观天下之势,发展强国之道' },
        { name: 'Copyright', content: '争逐版权所有' },
        { name: 'robots', content: 'all' },
        // 是否隐藏 Safari 地址栏等
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        // 指定应用名称
        { name: 'application-name', content: '争逐' },
        { name: 'apple-mobile-web-app-title', content: '争逐' },
        // 修改 iOS 状态栏颜色
        { name: 'theme-color', content: '#2d3748' },
        { name: 'msapplication-navbutton-color', content: '#2d3748' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'msapplication-starturl', content: '/' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1,user-scalable=no' },
      ],
    },
  },
  router: {
    options: {
      linkActiveClass: 'active',
      // linkExactActiveClass: 'active',
    },
  },
  css: ['@/assets/scss/reset.scss', '@/assets/scss/common.scss'],
  googleFonts: {
    download: true,
    display: 'swap',
    stylePath: 'css/fonts.css',
    inject: true,
    overwriting: false,
    prefetch: true,
    preconnect: true,
    preload: true,
    useStylesheet: false,
    families: {
      'Ma+Shan+Zhen': true,
      'Zhi+Mang+Xing': true,
    },
  },

  modules: ['@nuxtjs/google-fonts', '@shuimo-design/shuimo-ui-nuxt'],
  build: {
    transpile: ['shuimo-ui'],
  },
  devtools: { enabled: true },
})
