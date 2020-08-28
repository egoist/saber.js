<template>
  <div>
    <Header />
    <MobileSidebar />
    <div class="container mx-auto">
      <div class="w-full lg:w-3/4">
        <div class="main px-5">
          <div class="flex flex-col space-y-5">
            <h2 class="page-title">{{ page.title }}</h2>
            <div class="mt-3 text-gray-500">
              Published on {{ formatDate(page.createdAt, 'DD MMM, YYYY') }}
            </div>
            <div class="page-content"><slot /></div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import MobileSidebar from '../components/MobileSidebar.vue'

export default {
  components: {
    Header,
    Footer,
    MobileSidebar
  },

  props: ['page'],

  head() {
    return {
      title: `${this.page.title} - ${this.$siteConfig.title}`
    }
  },

  methods: {
    formatDate(date, format) {
      return dayjs(date).format(format)
    }
  }
}
</script>
