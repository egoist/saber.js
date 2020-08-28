<template>
  <header class="header border-b fixed top-0 left-0 right-0 bg-white z-10">
    <div
      class="container mx-auto flex items-center justify-between h-full px-5"
    >
      <h1 class="font-bold text-xl">
        <a href="/" class="flex items-center space-x-2"
          ><Logo /><span>{{ $siteConfig.title }}</span></a
        >
      </h1>
      <div class="flex items-center space-x-5">
        <DocSearch />
        <button class="flex lg:hidden" @click="toggleMobileSidebar">
          <svg fill="currentColor" viewBox="0 0 20 20" class="w-5 h-5">
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
        <HeaderNav class="hidden lg:flex" />
      </div>
    </div>
  </header>
</template>

<script>
import Logo from './Logo.vue'
import DocSearch from './DocSearch.vue'
import HeaderNav from './HeaderNav.vue'

export default {
  components: {
    Logo,
    DocSearch,
    HeaderNav
  },

  methods: {
    toggleMobileSidebar() {
      const $el = document.querySelector('.mobile-sidebar')
      if ($el) {
        if ($el.classList.contains('hidden')) {
          $el.classList.remove('hidden')
        } else {
          $el.classList.add('hidden')
        }
      }
    }
  }
}
</script>

<style scoped>
.header {
  height: var(--header-height);
}
</style>
