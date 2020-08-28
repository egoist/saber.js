<template>
  <div class="overflow-x-hidden">
    <div class="uppercase font-semibold text-gray-400 mb-3">On this page</div>
    <a
      v-for="(heading, index) in headings"
      :key="index"
      :data-level="heading.level"
      :href="`#${heading.slug}`"
      class="toc-item block text-gray-500 hover:text-theme hover:translate-r-2px"
      :class="[`#${heading.slug}` === $route.hash && 'is-active']"
    >
      {{ heading.text }}
    </a>
  </div>
</template>

<script>
export default {
  props: {
    headings: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.toc-item:hover {
  transform: translateX(2px);
  transition: transform cubic-bezier(0.075, 0.82, 0.165, 1) 200ms;
}

.toc-item.is-active {
  @apply text-theme;
}
</style>
