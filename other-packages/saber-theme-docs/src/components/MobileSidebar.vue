<template>
  <div
    class="mobile-sidebar hidden fixed w-full bottom-0 bg-white overflow-y-auto lg:hidden z-20"
  >
    <div>
      <div class="border-b">
        <div class="container mx-auto p-5">
          <HeaderNav />
        </div>
      </div>
      <div>
        <div class="container mx-auto p-5">
          <SidebarMenu />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderNav from './HeaderNav.vue'
import SidebarMenu from './SidebarMenu.vue'

export default {
  components: {
    HeaderNav,
    SidebarMenu
  }
}
</script>

<style scoped>
.mobile-sidebar {
  top: var(--header-height);
}
</style>
