<template>
  <ul class="items-center space-y-2 lg:space-y-0 lg:space-x-5">
    <li
      v-for="item in $themeConfig.navLinks"
      :key="item.title"
      class="navitem group relative"
      :class="{ open }"
    >
      <a
        v-if="item.link"
        :href="item.link"
        class="navlink text-gray-500 flex"
        :class="{ 'is-active': isActiveLink(item.link) }"
        >{{ item.title }}</a
      >
      <span
        v-else
        class="navlink text-gray-500 flex items-center justify-between"
        :class="{ 'is-active': item.link }"
        @click="toggleChildren"
        ><span>{{ item.title }}</span>
        <svg
          class="lg:hidden ml-1 transform"
          :class="{ 'rotate-90': open }"
          width="1em"
          height="1em"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          ></path></svg
      ></span>
      <div
        v-if="item.children"
        class="navlink--children hidden lg:group-hover:block lg:absolute right-0"
      >
        <ul
          class="mt-2 pl-5 lg:pl-0 lg:shadow-lg lg:rounded bg-white overflow-hidden"
        >
          <li v-for="child in item.children" :key="child.title">
            <a
              :href="child.link"
              class="flex p-2 font-medium text-gray-600 hover:text-theme hover:bg-gray-100"
              >{{ child.title }}</a
            >
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      open: false
    }
  },

  methods: {
    isActiveLink(link) {
      return link === this.$route.path || `${link}/` === this.$route.path
    },

    toggleChildren() {
      if (document.body.clientWidth > 1028) return

      this.open = !this.open
    }
  }
}
</script>

<style scoped>
.navitem.open .navlink--children {
  @apply block;
}

.navlink {
  @apply cursor-pointer;
  @apply text-gray-500;
}

.navlink:hover,
.navlink.is-active {
  @apply text-theme;
}

.navlink--children {
  min-width: 150px;
}

.navlink--children a.router-link-exact-active {
  @apply text-theme;
}
</style>
