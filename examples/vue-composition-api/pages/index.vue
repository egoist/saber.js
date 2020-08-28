<template>
  <button @click="increment">{{ state.count }} * 2 = {{ doubleCount }}</button>
</template>

<script>
// Using Vue 3.x composition API in Vue 2.x
import { createComponent, reactive, computed } from '@vue/composition-api'

// Wrapping component definition with `createComponent`
// is only required for TypeScript users
export default createComponent({
  setup() {
    const state = reactive({
      count: 0
    })
    const doubleCount = computed(() => state.count * 2)
    return {
      state,
      doubleCount,
      increment() {
        state.count++
      }
    }
  }
})
</script>
