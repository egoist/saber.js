<template>
  <Search
    inputId="site--search"
    @hook:mounted="onMounted"
    class="focus-within:bg-gray-100"
    inputClass="focus:bg-gray-100"
  />
</template>

<script>
import Search from './Search.vue'

export default {
  components: {
    Search
  },
  methods: {
    async onMounted() {
      const docsearch = await import(
        /* webpackChunkName: "docsearch" */ 'docsearch.js'
      )
      docsearch.default({
        apiKey: '226f92e3cf36f89eda7c402258e73cb2',
        indexName: 'saber',
        inputSelector: '#site--search',
        autocompleteOptions: {
          openOnFocus: true
        },
        handleSelected: (input, event, suggestion) => {
          this.$router.push(
            suggestion.url.replace(/^https:\/\/saber\.land/, '')
          )
        },
        debug: 'debugSearch' in this.$route.query
      })
    }
  }
}
</script>

<style src="docsearch.js/dist/cdn/docsearch.min.css"></style>

<style>
/* Override docsearch */
.algolia-autocomplete .ds-dropdown-menu {
  @media (max-width: 768px) {
    min-width: 300px;
  }
}
</style>
