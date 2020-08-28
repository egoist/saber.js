<template>
  <div>
    <Header />
    <MobileSidebar />
    <div class="container max-w-2xl mx-auto">
      <div class="main px-5">
        <h2 class="page-title">Blog</h2>
        <h3 class="text-xl text-gray-500 font-medium mt-4">
          Comprehensive posts written by humans
        </h3>

        <div class="flex flex-col space-y-5 mt-5">
          <a
            v-for="post in page.data.posts"
            :key="post.permalink"
            class="block shadow rounded-lg p-5"
            :href="post.permalink"
          >
            <h3 class="text-2xl font-bold">{{ post.title }}</h3>
            <div class="mt-3 text-gray-500">
              Published on {{ formatDate(post.createdAt, 'DD MMM, YYYY') }}
            </div>
          </a>
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
