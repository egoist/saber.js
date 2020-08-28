<template>
  <div class="bg-gray-100 py-36 mt-16 px-5">
    <div
      class="max-w-6xl mx-auto flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8"
    >
      <div
        v-for="feature in features"
        :key="feature.title"
        class="w-full md:w-4/12 bg-white shadow rounded p-10"
      >
        <h3 class="text-xl font-bold mb-3">{{ feature.title }}</h3>
        <div class="text-gray-700 leading-snug">{{ feature.details }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    features: {
      type: Array,
      required: true
    }
  }
}
</script>
