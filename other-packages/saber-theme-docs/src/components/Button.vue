<template>
  <component :is="as" v-bind="$attrs" :class="className"><slot /></component>
</template>

<script>
export default {
  props: {
    variantColor: {
      type: String
    },

    as: {
      type: String,
      default: 'button'
    }
  },

  computed: {
    className() {
      const { variantColor } = this

      const result = {
        'inline-flex': true,
        'items-center': true,
        'bg-theme': !variantColor || variantColor === 'theme',
        'bg-gray-500': variantColor === 'gray',
        'bg-gray-900': variantColor === 'dark',
        'bg-pink-500': variantColor === 'pink',
        rounded: true,
        'px-5': true,
        'h-12': true,
        'text-white': true
      }

      return result
    }
  }
}
</script>
