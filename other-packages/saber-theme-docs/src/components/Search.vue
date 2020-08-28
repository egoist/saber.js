<template>
  <div
    class="flex items-center text-gray-400 focus-within:text-gray-700 p-2 rounded"
  >
    <svg
      fill="currentColor"
      viewBox="0 0 20 20"
      width="1em"
      height="1em"
      class="mr-3"
    >
      <path
        fill-rule="evenodd"
        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
        clip-rule="evenodd"
      ></path>
    </svg>
    <input
      type="text"
      :id="inputId"
      placeholder="Search Documentation"
      class="bg-transparent focus:outline-none placeholder-current"
      :class="inputClass"
    />
  </div>
</template>

<script>
export default {
  props: {
    inputId: {
      type: String
    },
    inputClass: {
      type: [String, Object, Array]
    }
  }
}
</script>
