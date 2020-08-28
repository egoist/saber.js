<template>
  <div class="lg:pl-2">
    <div v-for="item in $themeConfig.sidebarMenu" :key="item.title">
      <a v-if="item.link" :href="item.link" class="flex text-sm">{{
        item.title
      }}</a>
      <span v-else class="flex uppercase font-bold text-sm">{{
        item.title
      }}</span>
      <div v-if="item.children" class="mt-2 mb-8">
        <a
          v-for="child in item.children"
          :key="child.title"
          :href="child.link"
          class="menu-item--link rounded text-base flex text-gray-600 px-2 py-1 -ml-2 hover:text-theme focus:outline-none"
          :class="{ 'is-active': isActiveLink(child.link) }"
        >
          {{ child.title }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    isActiveLink(link) {
      return link === this.$route.path
    }
  }
}
</script>

<style scoped>
.menu-item--link.is-active {
  background: var(--sidebar-menu-active-bg);
  @apply text-theme;
}
</style>
