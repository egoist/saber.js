<script>
import sum from '../src/sum'

export default {
  render(h) {
    return h('h1', { class: this.$style.title }, ['lorem ', sum(1, 2)])
  }
}

export const page = {
  title: 'Flat oppai',
  layout: 'foo'
}
console.log('egoist is baka baka baka')
</script>

<style src="./hehe.css"></style>
<style src="./hehe.module.css" module></style>
