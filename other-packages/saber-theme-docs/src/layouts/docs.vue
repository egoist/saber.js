<template>
  <div>
    <Header />
    <MobileSidebar />
    <div class="container mx-auto lg:px-5">
      <div class="flex">
        <div
          class="hidden lg:block lg:static w-full lg:h-auto lg:inset-0 lg:w-1/4 xl:w-1/5"
        >
          <div
            class="sidebar-inner h-full lg:h-auto lg:sticky overflow-y-auto -ml-2 pr-8"
          >
            <SidebarMenu />
          </div>
        </div>
        <div class="w-full lg:w-3/4 xl:w-4/5 flex lg:static lg:max-h-full">
          <div class="main px-5 lg:px-8 max-w-3xl xl:mx-0 xl:px-12 xl:w-3/4">
            <h2 class="page-title">{{ page.title }}</h2>
            <div class="page-content">
              <slot />
            </div>
          </div>

          <div class="hidden xl:text-sm xl:block xl:w-1/4 xl:px-6">
            <div class="toc-inner lg:sticky overflow-y-auto">
              <TOC :headings="page.markdownHeadings" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import SidebarMenu from '../components/SidebarMenu.vue'
import TOC from '../components/TOC.vue'
import MobileSidebar from '../components/MobileSidebar.vue'

export default {
  components: {
    Header,
    Footer,
    SidebarMenu,
    TOC,
    MobileSidebar
  },

  props: ['page'],

  head() {
    return {
      title: `${this.page.title} - ${this.$siteConfig.title}`
    }
  }
}
</script>

<style scoped>
.sidebar-inner,
.toc-inner {
  top: var(--header-height);
  padding-top: theme('spacing.8');
  height: calc(100vh - var(--header-height));
}
</style>
