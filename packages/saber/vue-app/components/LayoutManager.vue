<script>
export default {
  name: 'LayoutManager',
  functional: true,
  inject: ['layouts'],
  render(
    h,
    {
      injections: { layouts },
      parent,
      scopedSlots
    }
  ) {
    const page = parent.$page
    const { layout, isVueSFC } = parent.$options
    const { component: componentSlot, default: defaultSlot } = scopedSlots

    const attrs = { props: { page } }

    const wrapSlot = slot => {
      const { markPageContent } = parent.$ssrContext || {}
      if (markPageContent) {
        const result = h(
          'div',
          null,
          [markPageContent[0]].concat(slot, markPageContent[1])
        )
        return Array.isArray(slot) ? [result] : result
      }
      return slot
    }

    if (typeof layout !== 'string') {
      return componentSlot
        ? wrapSlot(componentSlot(attrs.props))
        : h(
            'div',
            {
              ...attrs,
              class: '_saber-page'
            },
            wrapSlot(defaultSlot ? defaultSlot() : undefined)
          )
    }

    const LayoutComponent = layouts[layout] || layouts.default

    if (!LayoutComponent) {
      console.error(`Cannot find layout component "${layout}" in `, layouts)
    }

    return h(
      LayoutComponent,
      attrs,
      wrapSlot(
        componentSlot
          ? componentSlot(attrs.props)
          : defaultSlot
          ? defaultSlot()
          : undefined
      )
    )
  }
}
</script>
