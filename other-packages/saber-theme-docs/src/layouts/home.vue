<template>
  <div>
    <Header />
    <MobileSidebar />
    <div class="mt-16 py-16">
      <div class="text-center">
        <h1 class="text-5xl font-bold max-w-xl mx-auto leading-none">
          {{ page.slogan || $siteConfig.description }}
        </h1>
        <h2 class="max-w-3xl text-2xl mx-auto text-gray-700 mt-10 font-medium">
          {{ page.details }}
        </h2>
      </div>
      <div class="text-center mt-10 flex justify-center space-x-3">
        <Button as="saber-link" to="/docs"
          ><svg
            fill="currentColor"
            viewBox="0 0 20 20"
            width="1em"
            height="1em"
          >
            <path
              fill-rule="evenodd"
              d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
              clip-rule="evenodd"
            ></path></svg
          ><span class="ml-2">Getting Started</span></Button
        >
        <Button
          variantColor="dark"
          as="saber-link"
          to="https://github.com/saberland/saber"
          ><svg
            id="i-github"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            width="1em"
            height="1em"
          >
            <path
              stroke-width="0"
              fill="currentColor"
              d="M32 0 C14 0 0 14 0 32 0 53 19 62 22 62 24 62 24 61 24 60 L24 55 C17 57 14 53 13 50 13 50 13 49 11 47 10 46 6 44 10 44 13 44 15 48 15 48 18 52 22 51 24 50 24 48 26 46 26 46 18 45 12 42 12 31 12 27 13 24 15 22 15 22 13 18 15 13 15 13 20 13 24 17 27 15 37 15 40 17 44 13 49 13 49 13 51 20 49 22 49 22 51 24 52 27 52 31 52 42 45 45 38 46 39 47 40 49 40 52 L40 60 C40 61 40 62 42 62 45 62 64 53 64 32 64 14 50 0 32 0 Z"
            />
          </svg>
          <span class="ml-2">GitHub</span></Button
        >
        <Button
          variantColor="pink"
          as="saber-link"
          to="https://github.com/sponsors/egoist"
          ><svg
            fill="currentColor"
            viewBox="0 0 20 20"
            width="1em"
            height="1em"
          >
            <path
              fill-rule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span class="ml-2">Sponsor</span></Button
        >
      </div>
      <HomeFeatures :features="page.features || []" />
      <slot />
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Button from '../components/Button.vue'
import HomeFeatures from '../components/HomeFeatures.vue'
import MobileSidebar from '../components/MobileSidebar.vue'

export default {
  components: {
    Header,
    Footer,
    Button,
    HomeFeatures,
    MobileSidebar
  },

  props: ['page'],

  head() {
    return {
      title: this.$siteConfig.title
    }
  }
}
</script>
