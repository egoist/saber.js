<script>
const NotFound = {
  head: {
    title: 'Not Found'
  },
  render(h) {
    return h('div', { style: { margin: '2rem' } }, [
      h('h1', { style: { margin: '0 0 20px 0' } }, ['Not Found']),
      h(
        'saber-link',
        {
          attrs: {
            to: '/'
          },
          style: {
            fontSize: '16px'
          }
        },
        ['← Back Home']
      )
    ])
  }
}

export default {
  functional: true,
  inject: ['layouts'],
  render(
    h,
    {
      injections: { layouts }
    }
  ) {
    return h(layouts['404'] || NotFound)
  }
}
</script>
